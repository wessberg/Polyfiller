import ts from "rollup-plugin-ts";
import json from "@rollup/plugin-json";
import {di} from "@wessberg/di-compiler";
import pkg from "./package.json" assert {type: "json"};
import {builtinModules} from "module";

const SHARED_OUTPUT_OPTIONS = {
	sourcemap: true,
	hoistTransitiveImports: false,
	generatedCode: "es2015",
	compact: false,
	minifyInternalExports: false
};

export default {
	input: "src/index.ts",
	output: [
		{
			file: pkg.exports.require,
			format: "cjs",
			...SHARED_OUTPUT_OPTIONS
		},
		{
			file: pkg.exports.import,
			format: "esm",
			...SHARED_OUTPUT_OPTIONS
		}
	],
	plugins: [
		json({
			preferConst: true
		}),
		ts({
			tsconfig: "tsconfig.build.json",
			transformers: [di]
		})
	],
	external: [...builtinModules, ...Object.keys(pkg.dependencies == null ? {} : pkg.dependencies), ...Object.keys(pkg.devDependencies)]
};