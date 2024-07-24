"use client";

import { CampaignManager } from "./_components/CampainManagerProvider";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export default function Home() {
	return <CampaignManager />;
}
