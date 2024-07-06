"use server";

import { auth } from "@/lib/auth";
import { openai } from "@ai-sdk/openai";
import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { ReactNode } from "react";
import { ShopTool } from "./_tools/Shop";

export interface ServerMessage {
	role: "user" | "assistant";
	content: string;
}

export interface ClientMessage {
	id: string;
	role: "user" | "assistant";
	display: ReactNode;
	isWidget?: boolean;
}

async function continueConversation(input: string): Promise<ClientMessage> {
	"use server";
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
				history.done((messages: ServerMessage[]) => [
					...messages,
					{ role: "assistant", content },
				]);
			}

			return <div>{content}</div>;
		},
		tools: {
			shop: ShopTool,
		},
	});

	return {
		id: generateId(),
		role: "assistant",
		display: result.value,
	};
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
	actions: {
		continueConversation,
	},
	initialAIState: [],
	initialUIState: [
		{
			id: generateId(),
			role: "assistant",
			display:
				"Welcome to the campaign tracker! There are variety of tools available to help you manage your campaign. What would you like to do?",
		},
	],
});
