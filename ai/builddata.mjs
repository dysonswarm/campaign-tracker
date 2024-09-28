import fs from "node:fs/promises";

const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
const requestOptions = {
	method: "GET",
	headers: myHeaders,
	redirect: "follow",
};

async function fetcher(path) {
	const response = await fetch(
		"https://www.dnd5eapi.co" + path,
		requestOptions,
	);
	return response.json();
}

function checkFileExists(file) {
	return fs
		.access(file, fs.constants.F_OK)
		.then(() => true)
		.catch(() => false);
}

const filesProcessed = new Set();
async function writeFile(path) {
	const dir = `./data${path.split("/").slice(0, -1).join("/")}`;
	const filename = `${dir}/${path.split("/").pop()}.json`;
	if (filesProcessed.has(filename)) {
		return {};
	}

	filesProcessed.add(filename);
	if (!(await checkFileExists(dir))) {
		await fs.mkdir(dir, { recursive: true });
	}

	let data = {};
	if (!(await checkFileExists(filename))) {
		data = await fetcher(path);
		await fs.writeFile(filename, JSON.stringify(data, null, 2));
	} else {
		data = JSON.parse(await fs.readFile(filename, "utf8"));
	}

	return data;
}

async function writeDataFiles(data) {
	if (data instanceof Object) {
		const keys = Object.keys(data);
		for (const key of keys) {
			if (
				typeof data[key] === "string" &&
				/^\/api\/[^.]+$/.test(data[key])
			) {
				const newData = await writeFile(data[key]);
				await writeDataFiles(newData);
			} else if (
				data[key] instanceof Object ||
				data[key] instanceof Array
			) {
				await writeDataFiles(data[key]);
			}
		}
	} else if (data instanceof Array) {
		await Promise.all(
			data.map(async (item) => {
				await writeDataFiles(item);
			}),
		);
	}
}

const allEndpoints = await fetcher("/api");
console.log(allEndpoints);
await Promise.all(
	Object.keys(allEndpoints).map(async (key) => {
		const path = allEndpoints[key];
		const response = await fetcher(path);
		9;
		await writeFile(path, key, response);
		await writeDataFiles(response);
	}),
);
