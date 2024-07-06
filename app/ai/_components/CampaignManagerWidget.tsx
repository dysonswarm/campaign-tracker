"use client";
import { PropsWithChildren, useContext } from "react";
import { CampaignManagerContext } from "./CampainManagerProvider";

export function CampianManagerWidget({
	widget,
	data,
}: PropsWithChildren<{ widget: string; data: any }>) {
	const { addWidget } = useContext(CampaignManagerContext);
	addWidget(widget, data);
	return <p>Widget added to dashboard.</p>;
}
