import fs from 'fs';
import path from 'path';

function updatePackageExports(packageJsonPath, directoryPath) {
  // Read the package.json file
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Get all files in the directory
  const files = fs.readdirSync(directoryPath);

  // Create the exports object
  const exports = {};

  // Add each file to the exports object
  files.forEach(file => {
    const baseName = path.basename(file, path.extname(file));
    exports[`./components/${baseName}`] = `./components/ui/${file}`;
  });

  // Update the package.json exports
  packageJson.exports = { ...packageJson.exports, ...exports };

  // Write the updated package.json back to file
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// Usage
updatePackageExports('./package.json', './components/ui');