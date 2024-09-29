import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import mongoClientPromise from "../mongo";

const embeddingModel = openai.embedding("text-embedding-ada-002");
const generateChunks = (input: string): string[] => {
	return input
		.trim()
		.split(".")
		.filter((i) => i !== "");
};

export const generateEmbeddings = async (
	value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
	const chunks = generateChunks(value);
	const { embeddings } = await embedMany({
		model: embeddingModel,
		values: chunks,
	});
	return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
	const input = value.replaceAll("\\n", " ");
	const { embedding } = await embed({
		model: embeddingModel,
		value: input,
	});
	return embedding;
};

interface Embedding {
	embedding: number[];
	content: string;
}

export const findRelevantContent = async (
	userQuery: string,
	similarityScore?: number,
	limit?: number,
) => {
	const userQueryEmbedded = await generateEmbedding(userQuery);
	// const emb = Buffer.from(new Uint8Array(new Float32Array(userQueryEmbedded).buffer));
	const mongoClient = await mongoClientPromise;
	const db = mongoClient.db("ct_dev");
	const col = db.collection<Embedding>("embeddings");
	const results = await col
		.aggregate([
			{
				$vectorSearch: {
					index: "vector_index",
					path: "embedding",
					queryVector: userQueryEmbedded,
					numCandidates: 200,
					limit: limit ?? 5,
				},
			},
			{
				$addFields: {
					score: {
						$meta: "vectorSearchScore",
					},
				},
			},
			{
				$match: {
					score: {
						$gte: similarityScore ?? 0.5,
					},
				},
			},
			{
				$unset: ["_id", "embedding"],
			},
			{
				$sort: {
					score: -1,
				},
			},
		])
		.toArray();

	// const similarity = sql<number>`1 - (${cosineDistance(
	// 	embeddings.embedding,
	// 	userQueryEmbedded,
	// )})`;
	// const similarGuides = await db
	// 	.select({ name: embeddings.content, similarity })
	// 	.from(embeddings)
	// 	.where(gt(similarity, similarityScore ?? 0.5))
	// 	.orderBy((t) => desc(t.similarity))
	// 	.limit(limit ?? 5);
	// console.log(JSON.stringify(similarGuides));
	return results;
};
