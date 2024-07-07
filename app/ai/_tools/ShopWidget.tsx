"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShopkeeperProps, ShopkeeprItemList } from "./Shop";

function ItemList({ itemList }: { itemList: ShopkeeprItemList }) {
	if (!itemList) {
		return <div>Shopkeeper is currently out please check back soon.</div>;
	}

	return (
		<>
			{itemList.map((item) => (
				<Card key={item.name}>
					<CardHeader>
						<CardTitle>{item.name}</CardTitle>
						<CardDescription>{item.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<Card>
							<CardHeader>
								<CardTitle>Price: {item.price}</CardTitle>
								<CardDescription>Quanity: {item.quanity}</CardDescription>
							</CardHeader>
						</Card>
					</CardContent>
				</Card>
			))}
		</>
	);
}

export function ShopWidget({ shopName, keeperName, itemList }: ShopkeeperProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Welcome to {shopName}!</CardTitle>
				<CardDescription>
					My name is {keeperName} and I am the shopkeeper here. How can I help you?
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ItemList itemList={itemList} />
			</CardContent>
		</Card>
	);
}
