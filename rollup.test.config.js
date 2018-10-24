import typescriptRollupPlugin from "@wessberg/rollup-plugin-ts";
import diPlugin from "@wessberg/rollup-plugin-di";
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
		diPlugin(),
		typescriptRollupPlugin({
			tsconfig: "tsconfig.json"
		})
	],
	external: [
		...Object.keys(packageJSON.dependencies),
		...Object.keys(packageJSON.devDependencies),
		"path", "fs", "util", "crypto", "buffer", "zlib", "fs/promises", "http", "https", "http2", "net", "url"
	]
};