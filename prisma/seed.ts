import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { prisma, vectorStore } from "../lib/db";
// const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
// const db = client.db(process.env.ASTRA_DB_API_ENDPOINT as string);
interface Open5eApiResult<T> {
	count: number;
	next: any;
	previous: any;
	results: T[];
}

interface ArchType {
	name: string;
	slug: string;
	desc: string;
	document__slug: string;
	document__title: string;
	document__license_url: string;
	document__url: string;
}

interface ClassResult {
	name: string;
	slug: string;
	desc: string;
	hit_dice: string;
	hp_at_1st_level: string;
	hp_at_higher_levels: string;
	prof_armor: string;
	prof_weapons: string;
	prof_tools: string;
	prof_saving_throws: string;
	prof_skills: string;
	equipment: string;
	table: string;
	spellcasting_ability: string;
	subtypes_name: string;
	document__slug: string;
	document__title: string;
	document__license_url: string;
	document__url: string;
	archetypes: ArchType[];
}

function buildProperty(title: string, value: string) {
	return `## ${title}\n\n${value}\n\n`;
}

function capitalizeAllWords(val: string) {
	return val
		.split("_")
		.map((x) => capitalizeFirstLetter(x))
		.join(" ");
}

function capitalizeFirstLetter(val: string): string {
	return val.charAt(0).toUpperCase() + val.slice(1);
}

function buildDoc(classResult: ClassResult) {
	let result: string = "";
	Object.keys(classResult).forEach((x) => {
		if (x.startsWith("document__")) {
		} else if (x.startsWith("prof_")) {
			result += buildProperty(`${capitalizeFirstLetter(x.split("_")[1])} Proficiency`, (classResult as any)[x]);
		} else if (x.startsWith("archetypes")) {
		} else {
			result += buildProperty(`${capitalizeAllWords(x)}`, (classResult as any)[x]);
		}
	});

	return result;
}

async function main() {
	console.log(`Start seeding ...`);
	const req = await fetch("https://api.open5e.com/v1/classes/?format=json");
	const data: Open5eApiResult<ClassResult> = await req.json();
	console.log(buildDoc(data.results[0]));
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 500,
		chunkOverlap: 50,
	});
	//const collection = db.collection("dnd_vectors");
//	await collection.deleteMany();
	await prisma.document.deleteMany();

	for (let i = 0; i < data.results.length; i++) {
		const doc = buildDoc(data.results[i]);
		const docsSplits = await textSplitter.splitText(doc);

		// await collection.insertMany(
		// 	docsSplits.map((x) => ({
		// 		$vectorize: x,
		// 	})),
		// );

		await vectorStore.addModels(
			await prisma.$transaction(
				docsSplits.map((x) =>
					prisma.document.create({ data: { content: x, type: "Class", slug: data.results[i].slug } }),
				),
			),
		);
	}

	console.log(`Seeding finished.`);
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
