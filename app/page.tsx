"use client";

import { readStreamableValue } from "ai/rsc";
import { useState } from "react";
import { continueConversationStreamText, Message } from "./actions";
import { Input } from "@/components/ui/input";

export const maxDuration = 30;

export default function Chat() {
	const [conversation, setConversation] = useState<Message[]>([]);
	const [input, setInput] = useState<string>("");

	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			<div className="space-y-4">
				{conversation.map((message, index) => (
					<div key={index} className="whitespace-pre-wrap">
						<div>
							<div className="font-bold">{message.role}</div>
							<p>{message.content}</p>
						</div>
					</div>
				))}
			</div>

			<form
				action={async () => {
					setInput("");
					const { messages, newMessage } =
						await continueConversationStreamText([
							...conversation,
							{ role: "user", content: input },
						]);

					let textContent = "";

					for await (const delta of readStreamableValue(newMessage)) {
						textContent = `${textContent}${delta}`;

						setConversation([
							...messages,
							{ role: "assistant", content: textContent },
						]);
					}
				}}
			>
				<Input
					className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
					value={input}
					placeholder="Say something..."
					onChange={(event) => setInput(event.target.value)}
				/>
			</form>
		</div>
	);
}
