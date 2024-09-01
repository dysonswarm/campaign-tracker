"use server";

import { createResource } from "@/lib/actions/resources";
import { findRelevantContent } from "@/lib/ai/embedding";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

export interface Message {
	role: "user" | "assistant";
	content: string;
}

export async function continueConversationStreamText(history: Message[]) {
	"use server";
	const stream = createStreamableValue();
	(async () => {
		const result = await streamText({
			model: openai("gpt-3.5-turbo"),
			system: `You are a helpful assistant. Check your knowledge base before answering any questions.
		Only respond to questions using information from tool calls.
		if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
			messages: history,
			tools: {
				addResource: tool({
					description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
					parameters: z.object({
						content: z
							.string()
							.describe(
								"the content or resource to add to the knowledge base",
							),
					}),
					execute: async ({ content }) => createResource({ content }),
				}),
				getInformation: tool({
					description: `get information from your knowledge base to answer questions.`,
					parameters: z.object({
						question: z.string().describe("the users question"),
					}),
					execute: async ({ question }) => {
						const similarGuides =
							await findRelevantContent(question);
						if (similarGuides.length === 0) {
							return "Sorry, I don't know.";
						}
						return similarGuides[0].name;
					},
				}),
			},
		});

		for await (const streamPart of result.fullStream) {
			if (streamPart.type === "text-delta") {
				stream.update(streamPart.textDelta);
			} else if (
				streamPart.type === "roundtrip-finish" ||
				streamPart.type === "finish"
			) {
				console.info(streamPart.finishReason);
				console.info(streamPart.usage);
			} else if (streamPart.type === "tool-call") {
				console.info(streamPart.toolName);
				console.info(streamPart.args);
				stream.update(`Calling ${streamPart.toolName}...`);
			} else if (streamPart.type === "tool-result") {
				stream.update(streamPart.result);
			} else {
				stream.update(JSON.stringify(streamPart));
			}
		}

		stream.done();
	})();

	return {
		messages: history,
		newMessage: stream.value,
	};
}
