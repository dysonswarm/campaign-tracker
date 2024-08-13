import fs from "node:fs/promises";

const packageStr = await fs.readFile("./package.json");
const packageJson = JSON.parse(packageStr);
console.log(packageJson);

const uiFiles = await fs.readdir("./src/ui");
console.log(uiFiles);
const exports = uiFiles.reduce((pre, curr) => {
    return { 
        ...pre,
        [`./${curr.split(".")[0]}`]: `./src/ui/${curr}`
    };
}, {});
console.log(exports);
const newPackage = {
    ...packageJson,
    exports
};
console.log(newPackage);

await fs.writeFile("./package.json", JSON.stringify(newPackage, null, 2));