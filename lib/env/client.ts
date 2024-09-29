import { z } from "zod";

const envSchema = z.object({
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
	NEXT_PUBLIC_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
});

export const env = envSchema.parse({
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
		process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	NEXT_PUBLIC_ENV: process.env.NODE_ENV,
});
