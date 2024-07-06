import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { z } from "zod";
import { CampianManagerWidget } from "../_components/CampaignManagerWidget";
import { RenderTool } from "./types";

export function ShopLoading() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Shopkeeper Loading</CardTitle>
				<CardDescription>
					Shopkeeper is currently out please check back soon.
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
export type ShopkeeperProps = {
	shopName: string;
	keeperName: string;
	id: string;
};

export const ShopTool: RenderTool = {
	description: "Create a shop for a TTRPG game",
	parameters: z.object({
		id: z.string({ description: "The ID of the shop" }),
		shopName: z.string({ description: "The name of the shop" }),
		keeperName: z.string({ description: "The name of the shopkeeper" }),
		//itemList: z.array()
	}),
	generate: async function* ({ ...props }) {
		return (
			<>
				<Suspense>
					<CampianManagerWidget widget={"ShopWidget"} data={props} />
				</Suspense>
				<p>Shop created.</p>
			</>
		);
	},
};
