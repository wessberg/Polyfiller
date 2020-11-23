const fs = require("fs");

[
	// TODO: Remove this when https://github.com/swc-project/swc/issues/1179 has been resolved
	{
		file: "node_modules/@wessberg/connection-observer/dist/index.js",
		match: String.raw`if (new.target === undefined) {`,
		replacement: String.raw`if ((this instanceof ConnectionObserver ? this.constructor : void 0) === undefined) {`
	},
	// TODO: Remove this when https://github.com/swc-project/swc/issues/1179 has been resolved
	{
		file: "node_modules/@polyfiller/object-fit/polyfill/index.js",
		match: String.raw`if (new.target === undefined) {`,
		replacement: String.raw`if ((this instanceof ComputedStyleObserver ? this.constructor : void 0) === undefined) {`
	}
].forEach(replace);

function replace({file, match, replacement, replacementFile}) {
	if (!fs.existsSync(file)) {
		throw new ReferenceError(`No such file: ${file}`);
	}

	if (replacementFile != null) {
		if (!fs.existsSync(replacementFile)) {
			throw new ReferenceError(`No such file: ${replacementFile}`);
		}

		const originalBinary = fs.readFileSync(file, "binary");
		const replacementFileBinary = fs.readFileSync(replacementFile, "binary");
		if (originalBinary !== replacementFileBinary) {
			fs.copyFileSync(replacementFile, file);
			console.log("Replaced file:", file, "with:", replacementFile);
		}
	} else {
		const fileContents = fs.readFileSync(file, "utf8");
		const matchPosition = fileContents.indexOf(match);
		const replacementPosition = fileContents.indexOf(replacement);
		if (matchPosition < 0 && replacementPosition < 0) {
			throw new ReferenceError(`File: ${file} does not include: ${match}`);
		} else if (matchPosition >= 0) {
			const updatedFileContents = fileContents.slice(0, matchPosition) + replacement + fileContents.slice(matchPosition + match.length);
			fs.writeFileSync(file, updatedFileContents);
			console.log("Updated contents of file:", file);
		}
	}
}
