import { z } from "zod";
import { RenderTool } from "./types";
export const ShopKeeper: RenderTool = {
	description: "Deploy repository to vercel",
	parameters: z.object({
		repositoryName: z
			.string()
			.describe("The name of the repository, example: vercel/ai-chatbot"),
	}),
	generate: async function* ({ repositoryName }) {
		yield <div>Cloning repository {repositoryName}...</div>;
		await new Promise((resolve) => setTimeout(resolve, 3000));
		yield <div>Building repository {repositoryName}...</div>;
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return <div>{repositoryName} deployed!</div>;
	},
};
