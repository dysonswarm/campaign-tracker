"use server";

import { auth } from "@/lib/auth";
import { vectorStore } from "@/lib/db";
import { openai } from "@ai-sdk/openai";
import { embed, generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { z } from "zod";
import { IntegrationSpinner } from "./_components/IntegrationSpinner";
import { Markdown } from "./_components/Markdown";

async function generateEmbedding(raw: string) {
	// OpenAI recommends replacing newlines with spaces for best results
	const input = raw.replace(/\n/g, " ");
	const { embedding } = await embed({
		model: openai.embedding("text-embedding-3-small"),
		value: input,
	});
	return embedding;
}

export const AI = createAI({
	actions: {
		continueConversation: async (input: string): Promise<any> => {
			const session = await auth();
			if (session === null) {
				throw new Error("Unauthenticated");
			}

			if (!["admin", "trusted"].includes(session.user.role)) {
				throw new Error("Unauthorized");
			}

			const history = getMutableAIState();

			const result = await streamUI({
				model: openai("gpt-3.5-turbo", { user: session?.user.id }),
				messages: [...history.get(), { role: "user", content: input }],
				text: ({ content, done }) => {
					if (done) {
						history.done([...history.get(), { role: "assistant", content }]);
					}

					return <Markdown>{content}</Markdown>;
				},
				tools: {
					getClasses: {
						description: "A tool used to get a list of DnD classes",
						parameters: z.object({
							query: z.string(),
						}),
						generate: async function* ({ query }) {
							console.log("Looking for classes", { query });
							yield (
								<div className="flex items-center gap-4">
									<IntegrationSpinner /> Asking DnD AI...
								</div>
							);

							const results: any = await vectorStore.similaritySearch(query);

							return <Markdown>{JSON.stringify(results)}</Markdown>;
						},
					},
					// shop: ShopTool,
				},
			});

			return {
				id: generateId(),
				role: "assistant",
				display: result.value,
			};
		},
	},
	initialAIState: [],
	initialUIState: [
		{
			id: generateId(),
			role: "assistant",
			isMessage: true,
			display:
				"Welcome to the campaign tracker! There are variety of tools available to help you manage your campaign. What would you like to do?",
		},
	],
});
