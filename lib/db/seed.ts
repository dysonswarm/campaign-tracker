import { env } from "@/lib/env/server";
import { createResource } from "../actions/resources";
import { iterateFiles } from "../../ai/iterate-files.mjs";
import fs from "fs";
const runSeed = async () => {
	if (!env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined");
	}

	console.log("⏳ Seeding database...");

	const start = Date.now();

	await iterateFiles("./data/api", async (path: string) => {
		if (path.endsWith(".md")) {
			const file = fs.readFileSync(path, "utf8");
			const resource = await createResource({ content: file });
			console.log("Inserted resource", resource);
		}
	});

	const end = Date.now();

	console.log("✅ Seeding completed in", end - start, "ms");

	process.exit(0);
};

runSeed().catch((err) => {
	console.error("❌ Migration failed");
	console.error(err);
	process.exit(1);
});
