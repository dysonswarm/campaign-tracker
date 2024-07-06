"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShopkeeperProps } from "./Shop";

export function ShopWidget({ shopName, keeperName }: ShopkeeperProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Welcome to {shopName}!</CardTitle>
				<CardDescription>
					My name is {keeperName} and I am the shopkeeper here. How can I help you?
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
