import fs from "fs/promises";
export async function iterateFiles(dir, callback) {
	console.log(`Iterating through directory: ${dir}`);
	const filesAndDirs = await fs.readdir(dir);
	console.log(`Found ${filesAndDirs.length} files and directories`);
	await Promise.all(
		filesAndDirs.map(async (fileOrDir) => {
			const path = `${dir}/${fileOrDir}`;
			console.log(`Processing: ${path}`);
			const stats = await fs.stat(path);
			if (stats.isDirectory()) {
				console.log(`${path} is a directory, recursing...`);
				await iterateFiles(path, callback);
			} else {
				console.log(`${path} is a file, calling callback...`);
				await callback(path);
			}
		}),
	);
	console.log(`Finished processing directory: ${dir}`);
}
