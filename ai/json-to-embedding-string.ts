import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import fs from "fs/promises";

const parser = new StringOutputParser();
const model = new ChatOpenAI({
	model: "gpt-3.5-turbo",
	maxTokens: 300,
	temperature: 0.7,
});

async function getTemplate() {
	return await fs.readFile(
		"ai/prompts/ConvertJsonToTextForEmbedding.txt",
		"utf-8",
	);
}

export async function convertJsonToEmbeddingString(
	jsonContent: object,
): Promise<string | undefined> {
	const template = await getTemplate();
	const promptTemplate = PromptTemplate.fromTemplate(template);
	const llmChain = promptTemplate.pipe(model).pipe(parser);
	return await llmChain.invoke({
		jsonContent: JSON.stringify(jsonContent, null, 2),
	});
}
