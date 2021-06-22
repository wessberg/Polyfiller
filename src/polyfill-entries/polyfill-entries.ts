import pkg from "../../package.json";
import {PolyfillEntries} from "./polyfill-entry";
import {ModuleResolvable} from "../common/lib/module-resolver/module-resolver";
import {ALL, WINDOW, WINDOW_WORKER} from "./polyfill-context";
import {WINDOW_CONTEXT} from "../polyfill/polyfill-context";

export interface GeneratePolyfillEntriesOptions {
	resolver: ModuleResolvable;
}

export function generatePolyfillEntries(options: GeneratePolyfillEntriesOptions): PolyfillEntries {
	const {resolver} = options;

	return {
		// Lib
		"lib.systemjs": {
			entry: (context, meta) => {
				if (meta.variant === "s") {
					return resolver.resolve("systemjs/dist/s.js");
				}
				switch (context) {
					case "window":
					case "worker":
						return resolver.resolve("systemjs/dist/system.js");
					case "node":
						return resolver.resolve("systemjs/dist/system-node.cjs");
				}
			},
			version: pkg.dependencies.systemjs,
			dependencies: ["es.object.create", "es.object.freeze", "es.object.define-property", "es.promise", "fetch"],
			context: ALL
		},

		"lib.regenerator-runtime": {
			entry: resolver.resolve("regenerator-runtime"),
			version: pkg.dependencies["regenerator-runtime"],
			dependencies: ["es.promise"],
			context: ALL
		},

		// CSS
		"css.object-fit": {
			entry: "@polyfiller/object-fit/polyfill/index.js",
			check: () => {
				const edgeUaMatch = navigator.userAgent.match(/Edge\/(\d{2})\./);
				const edgeVersion = edgeUaMatch == null ? undefined : parseInt(edgeUaMatch[1]);
				return (
					typeof document !== "undefined" &&
					"objectFit" in document.documentElement.style &&
					"objectPosition" in document.documentElement.style &&
					(edgeVersion == null || edgeVersion >= 80)
				);
			},
			features: ["object-fit"],
			version: pkg.dependencies["@polyfiller/object-fit"],
			dependencies: [
				"window",
				"document",
				"element",
				"event",
				"mutation-observer",
				"get-computed-style",
				"dom.collections.iterable",
				"request-animation-frame",
				"es.array.concat",
				"es.array.filter",
				"es.array.for-each",
				"es.array.from",
				"es.array.is-array",
				"es.map",
				"es.set",
				"es.weak-map",
				"es.symbol.iterator",
				"es.symbol.to-string-tag",
				"es.symbol.constructor",
				"es.number.to-fixed",
				"es.object.define-property",
				"es.object.get-own-property-descriptor",
				"es.object.keys"
			],
			context: WINDOW
		},

		// API
		"api.constructable-stylesheets": {
			entry: resolver.resolve("construct-style-sheets-polyfill"),
			check: () => typeof document !== "undefined" && "adoptedStyleSheets" in document,
			features: ["api.Document.adoptedStyleSheets", "api.ShadowRoot.adoptedStyleSheets"],
			version: pkg.dependencies["construct-style-sheets-polyfill"],
			dependencies: ["document"],
			context: WINDOW,
			mustComeAfter: ["shadow-dom"]
		},

		"api.performance.now": {
			entry: context => {
				switch (context) {
					case "window":
					case "worker":
						return resolver.resolve("perfnow");
					case "node":
						return resolver.resolve("performance-now");
				}
			},
			check: () => typeof performance !== "undefined" && "now" in performance,
			features: ["high-resolution-time"],
			version: [pkg.dependencies.perfnow, pkg.dependencies["performance-now"]],
			dependencies: ["es.date.now"],
			context: ALL
		},
		"api.url": {
			entry: resolver.resolve("url-polyfill"),
			check: () => typeof URL !== "undefined" && typeof URLSearchParams !== "undefined",
			features: ["url", "urlsearchparams"],
			version: pkg.dependencies["url-polyfill"],

			dependencies: ["es.object.define-properties", "es.array.for-each"],
			context: ALL
		},
		"api.form-data": {
			entry: resolver.resolve("@polyfiller/form-data/polyfill/index.js"),
			check: () => typeof FormData !== "undefined" && "get" in FormData.prototype && "entries" in FormData.prototype,
			features: ["api.FormData", "api.FormData.get", "api.FormData.getAll", "api.FormData.has", "api.FormData.set", "api.FormData.entries"],
			version: pkg.dependencies["@polyfiller/form-data"],
			dependencies: [],
			context: WINDOW_WORKER
		},

		"api.console": {
			entry: resolver.resolve("console-polyfill"),
			check: () => typeof console !== "undefined" && "debug" in console && "error" in console && "trace" in console && "time" in console,
			features: ["console-basic", "console-time"],
			version: pkg.dependencies["console-polyfill"],

			dependencies: [],
			context: ALL
		},

		"api.base64": {
			entry: resolver.resolve("Base64"),
			check: () => typeof btoa !== "undefined" && typeof atob !== "undefined",
			features: ["atob-btoa"],
			version: pkg.dependencies.Base64,
			dependencies: [],
			context: ALL
		},

		"api.blob": {
			entry: resolver.resolve("blob-polyfill"),
			check: () => {
				try {
					const blobSupported = new Blob(["ä"]).size === 2;
					const blobSupportsArrayBufferView = new Blob([new Uint8Array([1, 2])]).size === 2;

					return blobSupported && blobSupportsArrayBufferView;
				} catch (e) {
					return false;
				}
			},
			features: ["blobbuilder", "bloburls"],
			version: pkg.dependencies["blob-polyfill"],
			dependencies: ["base64", "url"],
			context: ALL
		},
		"api.request-idle-callback": {
			entry: "requestidlecallback",
			check: () => typeof requestIdleCallback !== "undefined",
			features: ["requestidlecallback"],
			version: pkg.dependencies.requestidlecallback,
			dependencies: ["requestanimationframe"],
			context: WINDOW
		},
		"api.request-animation-frame": {
			entry: "requestanimationframe",
			check: () => typeof requestAnimationFrame !== "undefined",
			features: ["requestanimationframe"],
			version: pkg.dependencies.requestanimationframe,
			dependencies: ["es.date.now", "performance.now"],
			context: WINDOW
		}
	};
}
