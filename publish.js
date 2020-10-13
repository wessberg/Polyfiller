const {mkdirSync, readFileSync, writeFileSync, copySync, removeSync} = require("fs-extra");
const {join} = require("path");
const {execSync} = require("child_process");

const distDir = "dist";
const polyfillLibDir = "polyfill-lib";
const publishDir = "publish-dir";

mkdirSync(publishDir, {recursive: true});
mkdirSync(join(publishDir, distDir), {recursive: true});
mkdirSync(join(publishDir, polyfillLibDir), {recursive: true});
copySync(distDir, join(publishDir, distDir));
copySync(polyfillLibDir, join(publishDir, polyfillLibDir));

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

// Remove unwanted keys from the package.json that will be published to the NPM registry
writeFileSync(
	join(publishDir, "package.json"),
	JSON.stringify(
		{
			...pkg,
			private: undefined,
			scripts: undefined,
			devDependencies: undefined,
			ava: undefined,
			husky: undefined,
			dependencies: {
				...pkg.dependencies,
				// These are only runtime dependencies for the standard package.json file when running on CI
				"useragent-generator": undefined,
				"@wessberg/di-compiler": undefined,
				"@wessberg/rollup-plugin-ts": undefined,
				typescript: undefined,
				"@wessberg/ts-config": undefined
			}
		},
		null,
		"  "
	)
);

console.log(`Publishing v${pkg.version} on NPM...`);
execSync("npm publish patch", {cwd: publishDir, stdio: "inherit"});
console.log(`Successfully published! Cleaning up...`);
removeSync(publishDir);
console.log(`Done`);
