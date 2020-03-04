import ts from "@wessberg/rollup-plugin-ts";
import {di} from "@wessberg/di-compiler";
import packageJSON from "./package.json";

export default {
	input: "test/server/server.test.ts",
	output: {
		file: "compiled/server.test.js",
		format: "cjs",
		sourcemap: true
	},
	treeshake: true,
	plugins: [
		ts({
			tsconfig: "tsconfig.json",
			transpileOnly: true,
			transformers: [di]
		})
	],
	external: [
		...Object.keys(packageJSON.dependencies),
		...Object.keys(packageJSON.devDependencies),
		"path",
		"fs",
		"util",
		"crypto",
		"buffer",
		"zlib",
		"fs/promises",
		"http",
		"https",
		"http2",
		"net",
		"url"
	]
};
