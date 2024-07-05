import { ReactNode } from "react";
import { z } from "zod";
export type TOOL = z.ZodTypeAny;
export type Streamable = ReactNode | Promise<ReactNode>;
export type Renderer<T extends Array<any>> = (
	...args: T
) =>
	| Streamable
	| Generator<Streamable, Streamable, void>
	| AsyncGenerator<Streamable, Streamable, void>;
export type RenderTool = {
	description?: string;
	parameters: z.ZodTypeAny;
	generate?: Renderer<
		[
			z.infer<z.ZodTypeAny>,
			{
				toolName: string;
				toolCallId: string;
			},
		]
	>;
};
