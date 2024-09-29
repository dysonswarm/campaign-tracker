import { Document } from "mongodb";

function jsonToEmbeddingString(json: Document): string {
	function processValue(
		value: object | string | number | boolean | null,
	): string {
		if (typeof value === "object" && value !== null) {
			if (Array.isArray(value)) {
				return value.map(processValue).join(" ");
			} else {
				return Object.entries(value)
					.filter(([key, val]) => {
						if (key === "_id" || key === "index") return false;
						if (typeof val === "string" && val.startsWith("/api"))
							return false;
						return true;
					})
					.map(([key, val]) => `${key} ${processValue(val)}`)
					.join(" ");
			}
		} else if (
			typeof value === "string" ||
			typeof value === "number" ||
			typeof value === "boolean"
		) {
			return value.toString();
		}
		return "";
	}

	return processValue(json).trim();
}

export default jsonToEmbeddingString;
