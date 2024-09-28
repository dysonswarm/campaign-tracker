import fs from "fs";

function buildMarkdown(jsonData) {
	const tags = new Set();

	function buildTags(item) {
		if (item.index) tags.add(item.index);
		if (item.url) {
			const urlWithoutApi = item.url.replace("/api/", "");
			tags.add(urlWithoutApi);
			urlWithoutApi.split("/").forEach((segment) => {
				if (segment) tags.add(segment);
			});
		}
		return Array.from(tags);
	}

	function convertToTitleCase(str) {
		return str
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	function buildSubHeading(value, headingLevel) {
		const heading = "#".repeat(headingLevel);
		const titleCaseKey = convertToTitleCase(value);
		return `${heading} ${titleCaseKey}\n\n`;
	}

	function processProperty(key, value, depth) {
		let markdown = key !== "results" ? buildSubHeading(key, depth + 1) : "";

		if (Array.isArray(value)) {
			if (typeof value[0] === "string") {
				markdown += value.join("\n\n") + "\n\n";
			} else if (typeof value[0] === "object") {
				value.forEach((item) => {
					if (item.name) markdown += `- ${item.name}\n`;
					buildTags(item);
				});
				markdown += "\n";
			}
		} else if (typeof value === "object") {
			processObject(value, depth + 1);
		} else {
			markdown += `${value}\n\n`;
		}

		return markdown;
	}

	function processObject(obj, depth = 1) {
		let markdown = "";
		buildTags(obj);
		for (const [key, value] of Object.entries(obj)) {
			if (key === "index" || key === "url" || key === "count") {
				continue;
			} else if (key === "name" && depth === 1) {
				markdown += `# ${convertToTitleCase(value)}\n\n`;
			} else {
				markdown += processProperty(key, value, depth);
			}
		}

		return markdown;
	}

	function processTags() {
		let markdown = "";
		if (tags.size > 0) {
			markdown += "## Tags\n\n";
			Array.from(tags)
				.sort()
				.forEach((tag) => {
					markdown += `- ${tag}\n`;
				});
		}
		return markdown;
	}

	return processObject(jsonData) + processTags();
}

function convertFileToMarkdown(filePath) {
	const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
	const category = filePath.split("/").pop().split(".")[0];
	if (jsonData.count && jsonData.results) {
		const newJsonData = {
			name: category,
			...jsonData,
		};
		return buildMarkdown(newJsonData);
	} else {
		return buildMarkdown(jsonData);
	}
}

export default convertFileToMarkdown;
