import { createEnv } from "@t3-oss/env-nextjs";
import "dotenv/config";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		DATABASE_URL: z.string().min(1),
		OPENAI_API_KEY: z.string().min(1),
		LANGCHAIN_TRACING_V2: z.coerce.boolean().default(false),
		LANGCHAIN_ENDPOINT: z.string().min(1),
		LANGCHAIN_API_KEY: z.string().min(1),
		LANGCHAIN_PROJECT: z.string().min(1),
		CLERK_SECRET_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
});
