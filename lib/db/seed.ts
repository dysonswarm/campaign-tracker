import { env } from "@/lib/env.mjs";
import { createResource } from "../actions/resources";

const runSeed = async () => {
	if (!env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined");
	}

	console.log("⏳ Sedding database...");

	const start = Date.now();

	// TODO: Add seed logic here
	const resource = await createResource({ content: "Hello World" });

	console.log("Inserted resource", resource);

	const end = Date.now();

	console.log("✅ Seeding completed in", end - start, "ms");

	process.exit(0);
};

runSeed().catch((err) => {
	console.error("❌ Migration failed");
	console.error(err);
	process.exit(1);
});
