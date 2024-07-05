"use server";

import { auth } from "@/lib/auth";
import { openai } from "@ai-sdk/openai";
import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { Flight } from "./_components/flight";
import { Stock } from "./_components/stock";

export interface ServerMessage {
	role: "user" | "assistant";
	content: string;
}

export interface ClientMessage {
	id: string;
	role: "user" | "assistant";
	display: ReactNode;
}

export async function continueConversation(
	input: string,
): Promise<ClientMessage> {
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
			deploy: {
				description: "Deploy repository to vercel",
				parameters: z.object({
					repositoryName: z
						.string()
						.describe(
							"The name of the repository, example: vercel/ai-chatbot",
						),
				}),
				generate: async function* ({ repositoryName }) {
					yield <div>Cloning repository {repositoryName}...</div>; // [!code highlight:5]
					await new Promise((resolve) => setTimeout(resolve, 3000));
					yield <div>Building repository {repositoryName}...</div>;
					await new Promise((resolve) => setTimeout(resolve, 2000));
					return <div>{repositoryName} deployed!</div>;
				},
			},
			showStockInformation: {
				description:
					"Get stock information for symbol for the last numOfMonths months",
				parameters: z.object({
					symbol: z
						.string()
						.describe("The stock symbol to get information for"),
					numOfMonths: z
						.number()
						.describe(
							"The number of months to get historical information for",
						),
				}),
				generate: async ({ symbol, numOfMonths }) => {
					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							content: `Showing stock information for ${symbol}`,
						},
					]);

					return <Stock symbol={symbol} numOfMonths={numOfMonths} />;
				},
			},
			showFlightStatus: {
				description: "Get the status of a flight",
				parameters: z.object({
					flightNumber: z
						.string()
						.describe("The flight number to get status for"),
				}),
				generate: async ({ flightNumber }) => {
					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							content: `Showing flight status for ${flightNumber}`,
						},
					]);

					return <Flight flightNumber={flightNumber} />;
				},
			},
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
	initialUIState: [],
});
