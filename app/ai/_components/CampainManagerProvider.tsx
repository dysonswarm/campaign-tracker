import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useUIState } from "ai/rsc";
import { createContext, Fragment, ReactNode, useCallback, useReducer } from "react";
import { ShopWidget } from "../_tools/ShopWidget";
import { CampaignManagerChat } from "./CampaignManagerChat";
const widgetRegistry = {
	ShopWidget,
};
type WidgetType = keyof typeof widgetRegistry;
type State = {
	focusedWidget?: string;
	widgets: { [key: string]: { widget: WidgetType; data: React.ComponentProps<any> } };
};
type WidgetManager = {
	state: State;
	addWidget: (widget: string, data: any) => void;
};
type Action = {
	type: "addWidget";
	payload: { widget: string; data: React.ComponentProps<any> };
};
export const CampaignManagerContext = createContext<WidgetManager>({
	state: { widgets: {} },
	addWidget: (widget: string, data: any) => {},
});
function reducer(state: State, action: Action) {
	switch (action.type) {
		case "addWidget":
			return {
				...state,
				focusedWidget: action.payload.data.id,
				widgets: { ...state.widgets, [action.payload.data.id]: action.payload },
			};
		default:
			return state;
	}
}

export function CampaignManagerProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, { widgets: {} });
	const addWidget = useCallback(
		(widget: string, data: any) => {
			dispatch({ type: "addWidget", payload: { widget, data } });
		},
		[dispatch],
	);
	return <CampaignManagerContext.Provider value={{ state, addWidget }}>{children}</CampaignManagerContext.Provider>;
}

export function CampaignManager() {
	const [conversation, setConversation] = useUIState();
	return (
		<ResizablePanelGroup direction="horizontal" className="h-screen">
			<ResizablePanel defaultSize={25} minSize={25} maxSize={50} collapsible={true}>
				<CampaignManagerChat conversation={conversation} setConversation={setConversation} />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={75}>
				<WidgetDisplay conversation={conversation} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

export function WidgetDisplay({ conversation }: { conversation: any }) {
	return (
		<>
			{conversation.map((message: any) => (
				<Fragment key={message.id}>
					<div className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent">
						{message.role}: {message.display}
					</div>
				</Fragment>
			))}
		</>
	);
}
