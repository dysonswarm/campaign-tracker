import { MongoClient, WithId, Document } from "mongodb";
import { convertJsonToEmbeddingString } from "./json-to-embedding-string";
import { env } from "../lib/env/server";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import fs from "fs/promises";
//import { findRelevantContent } from "../lib/ai/embedding";

const embeddingModel = openai.embedding("text-embedding-ada-002");
const client = new MongoClient(env.MONGODB_URI);
const clientAtlas = new MongoClient(env.MONGODB_ATLAS_URI);

const generateEmbedding = async (value: string): Promise<number[]> => {
	const input = value.replaceAll("\\n", " ");
	const { embedding } = await embed({
		model: embeddingModel,
		value: input,
	});
	return embedding;
};

type DocumentList = {
	documents: WithId<Document>[];
	type: string;
};

async function getDocuments(
	collectionNames: string[],
): Promise<DocumentList[]> {
	const db = client.db("5e-database");
	const result = [];
	for (const collectionName of collectionNames) {
		console.log(`Processing ${collectionName}`);
		const collection = db.collection(collectionName);
		result.push({
			type: collection.collectionName,
			documents: await collection.find({}).toArray(),
		});
	}
	return result;
}

async function creatEmbeddings(documentLists: DocumentList[]) {
	const result = [];
	for (const documentList of documentLists) {
		const documents = [];
		for (const document of documentList.documents) {
			console.log(`Processing ${document.name}`);
			const embeddingString =
				await convertJsonToEmbeddingString(document);
			if (embeddingString) {
				const embedding = await generateEmbedding(embeddingString);
				documents.push({
					...document,
					embedding,
					content: embeddingString,
					type: documentList.type,
				});
			}
		}
		result.push({
			type: documentList.type,
			documents: documents as WithId<Document>[],
		});
	}
	return result;
}

async function run() {
	try {
		const db = client.db("5e-database");
		const documents = await getDocuments(
			(await db.collections()).map(
				(collection) => collection.collectionName,
			),
		);
		const embeddings = await creatEmbeddings(documents);
		for (const embedding of embeddings) {
			if (embedding) {
				await fs.writeFile(
					`embeddings/${embedding.type}.json`,
					JSON.stringify(embedding.documents),
				);
			}
		}
		embeddings.filter(Boolean).forEach(async (embedding) => {
			embedding.documents.forEach(async (document) => {
				console.log(embedding);
				if (embedding) {
					await clientAtlas
						.db("ct_dev")
						.collection("embeddings")
						.insertOne(document);
				}
			});
		});
		// await clientAtlas.connect();
		// await clientAtlas.db("ct_dev").collection("embeddings").deleteMany({});
		// const db = client.db("5e-database");
		// const collections = await db.collections();
		// await Promise.all(collections.map(async collection => {
		// 	//const collection = db.collection("ability-scores");
		// 	console.log('CollectionName', collection.collectionName);
		// 	const documents = await collection.find({}).toArray();
		// 	console.log('documents for', collection.collectionName, documents);
		// 	const embeddings = await Promise.all(documents.map(async (document) => {
		// 		const embeddingString  = await convertJsonToEmbeddingString(document);
		// 		console.log(embeddingString);
		// 		if (embeddingString) {
		// 			const embedding = await generateEmbedding(embeddingString);
		// 			return {
		// 				...document,
		// 				embedding,
		// 				content: embeddingString,
		// 				type: collection.collectionName,
		// 			};
		// 		}
		// 	}));

		// 	embeddings.filter(Boolean).forEach(async (embedding) => {
		// 		console.log(embedding);
		// 		if (embedding) {
		// 			await clientAtlas.db("ct_dev").collection("embeddings").insertOne(embedding);
		// 		}
		// 	});
		// }));
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	} finally {
		await client.close();
	}
}
run();

// async function test(question: string) {
// 	const similarGuides = await findRelevantContent(
// 		question,
// 		0.88,
// 		25,
// 	);
// 	console.log(similarGuides);
// }
// test("What is the best ability score to grapple?");
