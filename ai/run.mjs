import fs from "node:fs/promises";
import { iterateFiles } from "./iterate-files.mjs";
import convertFileToMarkdown from "./convert-json-to-markdown.mjs";

iterateFiles("./data/api", async (path) => {
	if (path.endsWith(".json")) {
		console.log(`Converting ${path} to markdown...`);
		const markdownContent = convertFileToMarkdown(path);
		const markdownPath = path.replace(".json", ".md");
		await fs.writeFile(markdownPath, markdownContent);
	}
});
