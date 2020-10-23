const fs = require("fs");

[
	{
		file: "node_modules/core-js/internals/whitespaces.js",
		match: String.raw`module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';`,
		replacement: String.raw`module.exports = String.fromCharCode("0x0009") + String.fromCharCode("0x000A") + String.fromCharCode("0x000B") + String.fromCharCode("0x000C") + String.fromCharCode("0x000D") + String.fromCharCode("0x0020") + String.fromCharCode("0x00A0") + String.fromCharCode("0x1680") + String.fromCharCode("0x2000") + String.fromCharCode("0x2001") + String.fromCharCode("0x2002") + String.fromCharCode("0x2003") + String.fromCharCode("0x2004") + String.fromCharCode("0x2005") + String.fromCharCode("0x2006") + String.fromCharCode("0x2007") + String.fromCharCode("0x2008") + String.fromCharCode("0x2009") + String.fromCharCode("0x200A") + String.fromCharCode("0x202F") + String.fromCharCode("0x205F") + String.fromCharCode("0x3000") + String.fromCharCode("0x2028") + String.fromCharCode("0x2029") + String.fromCharCode("0xFEFF");`
	},
	{
		file: "node_modules/@wessberg/connection-observer/dist/index.js",
		match: String.raw`if (new.target === undefined) {`,
		replacement: String.raw`if ((this instanceof ConnectionObserver ? this.constructor : void 0) === undefined) {`
	}
].forEach(replace);

function replace({file, match, replacement}) {
	if (!fs.existsSync(file)) {
		throw new ReferenceError(`No such file: ${file}`);
	}

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
