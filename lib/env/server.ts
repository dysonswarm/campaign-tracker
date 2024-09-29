import { z } from "zod";
const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	OPENAI_API_KEY: z.string().min(1),
	LANGCHAIN_TRACING_V2: z.coerce.boolean().default(false),
	LANGCHAIN_ENDPOINT: z.string().min(1),
	LANGCHAIN_API_KEY: z.string().min(1),
	LANGCHAIN_PROJECT: z.string().min(1),
	CLERK_SECRET_KEY: z.string().min(1),
	MONGODB_URI: z.string().min(1),
	MONGODB_ATLAS_URI: z.string().min(1),
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
});

export const env = envSchema.parse(process.env);
