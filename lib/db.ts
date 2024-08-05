import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Document, Prisma, PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
	const neon = new Pool({
		connectionString: process.env.DATABASE_URL,
	});
	const adapter = new PrismaNeon(neon);
	return new PrismaClient({ adapter });
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

const vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(
	new OpenAIEmbeddings({
		model: "text-embedding-3-small",
	}),
	{
		prisma: Prisma,
		tableName: "Document",
		vectorColumnName: "vector",
		columns: {
			id: PrismaVectorStore.IdColumn,
			content: PrismaVectorStore.ContentColumn,
			slug: "string",
		},
	},
);

export { prisma, vectorStore };

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
