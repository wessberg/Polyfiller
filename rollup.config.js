import ts from "rollup-plugin-ts";
import json from "@rollup/plugin-json";
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
		json({
			preferConst: true
		}),
		ts({
			tsconfig: "tsconfig.build.json",
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
		"os",
		"url"
	]
};
