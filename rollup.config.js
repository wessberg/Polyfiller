import ts from "@wessberg/rollup-plugin-ts";
import {di} from "@wessberg/di-compiler";
import packageJSON from "./package.json";

export default {
	input: "src/index.ts",
	output: [
		{
			file: packageJSON.main,
			format: "cjs",
			sourcemap: true
		}
	],
	treeshake: true,
	plugins: [
		ts({
			tsconfig: process.env.NODE_ENV === "production" ? "tsconfig.dist.json" : "tsconfig.json",
			transformers: [
				di
			]
		})
	],
	external: [
		...Object.keys(packageJSON.dependencies),
		...Object.keys(packageJSON.devDependencies),
		"path", "fs", "util", "crypto", "buffer", "zlib", "fs/promises", "http", "https", "http2", "net", "url"
	]
};