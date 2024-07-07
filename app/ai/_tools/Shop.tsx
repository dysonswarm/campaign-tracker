import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { ShopWidget } from "./ShopWidget";
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
export type ShopkeeprItemList = {
	name: string;
	description: string;
	price: number;
	quanity: number;
}[];
export type ShopkeeperProps = {
	shopName: string;
	keeperName: string;
	id: string;
	itemList: ShopkeeprItemList;
};

export const ShopTool: RenderTool = {
	description: "Create a shop for a TTRPG game",
	parameters: z.object({
		shopName: z.string({ description: "The name of the shop" }),
		keeperName: z.string({ description: "The name of the shopkeeper" }),
		itemList: z.array(
			z.object({
				name: z.string({ description: "The name of the item" }),
				description: z.string({ description: "The description of the item" }),
				price: z.number({ description: "The price of the item" }),
				quanity: z.number({ description: "The quanity of item in the shop" }),
			}),
		),
	}),
	generate: async function* ({ ...props }) {
		return <ShopWidget {...props} />;
	},
};
