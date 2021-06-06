import pkg from "../../package.json";
import {PolyfillEntries} from "./polyfill-entry";
import {WINDOW_CONTEXT} from "./polyfill-context";

export const polyfillEntries: PolyfillEntries = {
	// Web APIs
	"constructable-style-sheets": {
		check: () => "adoptedStyleSheets" in document,
		entry: "construct-style-sheets-polyfill",
		dependencies: ["shadow-dom"],
		version: pkg.dependencies["construct-style-sheets-polyfill"],
		context: WINDOW_CONTEXT
	},

	// Helper Libs
	systemjs: {
		entry: (context, meta) => {
			if (meta.variant === "s") {
				return "systemjs/dist/s.js";
			}
			switch (context) {
				case "window":
				case "worker":
					return "systemjs/dist/system.js";
				case "node":
					return "systemjs/dist/system-node.cjs";
			}
		},
		version: pkg.dependencies.systemjs,
		dependencies: ["es.object.create", "es.object.freeze", "es.object.define-property", "es.promise", "fetch"]
	}
};
