import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { Fragment, useEffect, useRef, useState } from "react";
import { ClientMessage } from "../actions";

export function CampaignManagerChat() {
	const [conversation, setConversation] = useUIState();
	const [disableSubmit, setDisableSubmit] = useState(false);
	const { continueConversation } = useActions();
	const formRef = useRef<HTMLFormElement>(null);
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.shiftKey && event.key === "Enter") {
				formRef.current?.requestSubmit();
				event.stopPropagation();
				event.preventDefault();
			}
		}
		document.addEventListener("keydown", handleKeyDown, true);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-1 flex-col h-screen">
				<div className="p-4 h-[175px]">
					<form
						ref={formRef}
						action={async (formData: FormData) => {
							const input = formData.get("messageText") as string;
							if (!input) return;
							formRef.current?.reset();
							debugger;
							setConversation((currentConversation: ClientMessage[]) => [
								...currentConversation,
								{
									id: generateId(),
									role: "user",
									display: input,
								},
							]);

							const message = await continueConversation(input);

							setConversation((currentConversation: ClientMessage[]) => [
								...currentConversation,
								message,
							]);
							setDisableSubmit(false);
						}}
					>
						<div className="grid gap-4">
							<Textarea className="p-4" name="messageText" />
							<Button
								type="submit"
								onClick={() => setDisableSubmit(true)}
								disabled={disableSubmit}
							>
								Send Message (Shift + Enter)
							</Button>
						</div>
					</form>
				</div>
				<ScrollArea className="h-[calc(100vh-175px)]">
					<div className="flex flex-col gap-2 p-4 pt-0">
						{conversation.map((message: ClientMessage) => (
							<Fragment key={message.id}>
								<div className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent">
									{message.role}: {message.display}
								</div>
								<Separator />
							</Fragment>
						))}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
