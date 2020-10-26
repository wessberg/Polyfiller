const fs = require("fs");

[
	// TODO: Remove this when https://github.com/swc-project/swc/issues/1188 has been resolved
	{
		file: "node_modules/core-js/internals/whitespaces.js",
		match: String.raw`module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';`,
		replacement: String.raw`module.exports = String.fromCharCode("0x0009") + String.fromCharCode("0x000A") + String.fromCharCode("0x000B") + String.fromCharCode("0x000C") + String.fromCharCode("0x000D") + String.fromCharCode("0x0020") + String.fromCharCode("0x00A0") + String.fromCharCode("0x1680") + String.fromCharCode("0x2000") + String.fromCharCode("0x2001") + String.fromCharCode("0x2002") + String.fromCharCode("0x2003") + String.fromCharCode("0x2004") + String.fromCharCode("0x2005") + String.fromCharCode("0x2006") + String.fromCharCode("0x2007") + String.fromCharCode("0x2008") + String.fromCharCode("0x2009") + String.fromCharCode("0x200A") + String.fromCharCode("0x202F") + String.fromCharCode("0x205F") + String.fromCharCode("0x3000") + String.fromCharCode("0x2028") + String.fromCharCode("0x2029") + String.fromCharCode("0xFEFF");`
	},
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
	},
	// TODO: Remove this when https://github.com/swc-project/swc/issues/1180 has been resolved
	{
		file: "node_modules/core-js/internals/collection-strong.js",
		match: String.raw`else that.size++;`,
		replacement: String.raw`else {that.size++;}`
	},
	// TODO: Remove this when https://github.com/swc-project/swc/issues/1180 has been resolved
	{
		file: "node_modules/core-js/internals/collection-strong.js",
		match: String.raw`else that.size--;`,
		replacement: String.raw`else {that.size--;}`
	},
	// TODO: Remove this when @swc/core has been published to NPM
	{
		file: "node_modules/@swc/core-darwin/swc.darwin.node",
		replacementFile: "polyfill-lib/swc.darwin.node"
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
