import {IConstant} from "./i-constant";
import tempDirectory from "temp-dir";
import {join} from "path";
import {ALL_CONTEXTS, WINDOW_CONTEXT, WINDOW_NODE_CONTEXT, WINDOW_WORKER_CONTEXT} from "../polyfill/polyfill-context";
import pkg from "../../package.json";
import {booleanize} from "../api/util";

const tempRoot = join(
	tempDirectory,
	pkg.name,
	(process.env.PRODUCTION != null && (process.env.PRODUCTION === "" || booleanize(process.env.PRODUCTION))) || process.env.NODE_ENV === "production" ? "production" : "development"
);

export const constant: IConstant = {
	cacheVersion: 3,
	endpoint: {
		index: "/api",
		polyfill: "/api/polyfill"
	},
	header: {
		polyfills: "x-applied-polyfills",
		cache: {
			immutable: "public,max-age=31536000,immutable"
		},
		maxChars: 600
	},
	meta: {
		name: pkg.name,
		version: pkg.version,
		github: pkg.repository.url
	},

	path: {
		cacheRoot: join(tempRoot),
		cachePackageVersionMap: join(tempRoot, "cache_package_version_map.json"),
		configChecksum: join(tempRoot, "config_checksum")
	},

	polyfill: {
		systemjs: {
			library: "systemjs",
			relativePaths: {
				window: ["dist/system.js"],
				worker: ["dist/system.js"],
				node: ["dist/system-node.cjs"]
			},
			meta: {
				system: {
					window: ["dist/system.js"],
					worker: ["dist/system.js"],
					node: ["dist/system-node.cjs"]
				},
				s: "dist/s.js"
			},
			features: [],

			dependencies: ["es.object.create", "es.object.freeze", "es.object.define-property", "es.promise", "fetch"],
			contexts: ALL_CONTEXTS
		},
		zone: {
			library: "zone.js",
			meta: {
				error: "fesm2015/zone-error.js",
				shadydom: "fesm2015/webapis-shadydom.js",
				mediaquery: "fesm2015/webapis-media-query.js",
				fetch: "fesm2015/zone-patch-fetch.js",
				resizeobserver: "fesm2015/zone-patch-resize-observer.js"
			},
			relativePaths: {
				window: ["fesm2015/zone.js"],
				worker: ["fesm2015/zone.js"],
				node: ["fesm2015/zone-node.js"]
			},
			features: [],

			dependencies: [],
			mustComeAfter: "*",
			contexts: WINDOW_NODE_CONTEXT
		},
		"performance.now": {
			library: {
				window: "perfnow",
				worker: "perfnow",
				node: "performance-now"
			},
			relativePaths: {
				window: ["perfnow.js"],
				worker: ["perfnow.js"],
				node: ["lib/performance-now.js"]
			},
			features: ["high-resolution-time"],

			dependencies: ["es.date.now"],
			contexts: ALL_CONTEXTS
		},
		url: {
			library: "url-polyfill",
			relativePaths: ["url-polyfill.js"],
			features: ["url", "urlsearchparams"],

			dependencies: ["es.object.define-properties", "es.array.for-each"],
			contexts: ALL_CONTEXTS
		},
		formdata: {
			polyfills: ["form-data"]
		},
		"form-data": {
			library: "@polyfiller/form-data",
			relativePaths: ["polyfill/index.js"],
			features: ["api.FormData", "api.FormData.get", "api.FormData.getAll", "api.FormData.has", "api.FormData.set", "api.FormData.entries"],

			dependencies: [],
			contexts: WINDOW_WORKER_CONTEXT
		},
		"object-fit": {
			library: "@polyfiller/object-fit",
			relativePaths: ["polyfill/index.js"],
			features: ["object-fit"],

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
			contexts: WINDOW_CONTEXT
		},
		console: {
			library: "console-polyfill",
			relativePaths: ["index.js"],
			features: ["console-basic", "console-time"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		base64: {
			library: "Base64",
			relativePaths: ["base64.js"],
			features: ["atob-btoa"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		blob: {
			library: "blob-polyfill",
			relativePaths: ["Blob.js"],
			features: ["blobbuilder", "bloburls"],

			dependencies: ["base64", "url"],
			contexts: ALL_CONTEXTS
		},
		requestidlecallback: {
			polyfills: ["request-idle-callback"]
		},
		requestanimationframe: {
			polyfills: ["request-animation-frame"]
		},
		"request-idle-callback": {
			library: "requestidlecallback",
			relativePaths: ["index.js"],
			features: ["requestidlecallback"],

			dependencies: ["requestanimationframe"],
			contexts: WINDOW_CONTEXT
		},
		"request-animation-frame": {
			library: "requestanimationframe",
			relativePaths: ["app/requestAnimationFrame.js"],
			features: ["requestanimationframe"],

			dependencies: ["es.date.now", "performance.now"],
			contexts: WINDOW_CONTEXT
		},
		proxy: {
			library: "proxy-polyfill",
			relativePaths: ["proxy.min.js"],
			features: ["proxy"],

			dependencies: ["es"],
			contexts: ALL_CONTEXTS
		},
		es: {
			polyfills: [
				"es.promise",
				"es.object",
				"es.function",
				"es.array",
				"es.array-buffer",
				"es.string",
				"es.data-view",
				"es.regexp",
				"es.number",
				"es.math",
				"es.date",
				"es.symbol",
				"es.collections",
				"es.typed-array",
				"es.reflect"
			]
		},
		// es2015 is an alias for 'es'
		es2015: {
			polyfills: ["es"]
		},
		"es.promise": {
			polyfills: ["es.promise.constructor", "es.promise.any", "es.promise.all-settled", "es.promise.finally"]
		},
		"es.promise.constructor": {
			library: "core-js",
			relativePaths: ["modules/es.promise.js"],
			features: ["promises"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.promise.finally": {
			library: "core-js",
			relativePaths: ["modules/es.promise.finally.js"],
			features: ["javascript.builtins.Promise.finally"],

			dependencies: ["es.promise.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.promise.all-settled": {
			library: "core-js",
			relativePaths: ["modules/es.promise.all-settled.js"],
			features: ["javascript.builtins.Promise.allSettled"],

			dependencies: ["es.promise.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.promise.try": {
			library: "core-js",
			relativePaths: ["modules/esnext.promise.try.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.promise.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.promise.any": {
			library: "core-js",
			relativePaths: ["modules/es.promise.any.js"],
			features: ["javascript.builtins.Promise.any"],

			dependencies: ["es.promise.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.object": {
			polyfills: [
				"es.object.assign",
				"es.object.create",
				"es.object.define-getter",
				"es.object.define-setter",
				"es.object.entries",
				"es.object.from-entries",
				"es.object.get-own-property-descriptors",
				"es.object.lookup-getter",
				"es.object.lookup-setter",
				"es.object.values",
				"es.object.define-properties",
				"es.object.define-property",
				"es.object.freeze",
				"es.object.get-own-property-descriptor",
				"es.object.get-own-property-names",
				"es.object.get-prototype-of",
				"es.object.is-extensible",
				"es.object.is-frozen",
				"es.object.is-sealed",
				"es.object.is",
				"es.object.keys",
				"es.object.prevent-extensions",
				"es.object.seal",
				"es.object.set-prototype-of",
				"es.object.to-string"
			]
		},
		"es.object.lookup-getter": {
			library: "core-js",
			relativePaths: ["modules/es.object.lookup-getter.js"],
			features: ["javascript.builtins.Object.lookupGetter"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.from-entries": {
			library: "core-js",
			relativePaths: ["modules/es.object.from-entries.js"],
			features: ["javascript.builtins.Object.fromEntries"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.lookup-setter": {
			library: "core-js",
			relativePaths: ["modules/es.object.lookup-setter.js"],
			features: ["javascript.builtins.Object.lookupSetter"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.define-getter": {
			library: "core-js",
			relativePaths: ["modules/es.object.define-getter.js"],
			features: ["javascript.builtins.Object.defineGetter"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.define-setter": {
			library: "core-js",
			relativePaths: ["modules/es.object.define-setter.js"],
			features: ["javascript.builtins.Object.defineSetter"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.entries": {
			library: "core-js",
			relativePaths: ["modules/es.object.entries.js"],
			features: ["javascript.builtins.Object.entries"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.values": {
			library: "core-js",
			relativePaths: ["modules/es.object.values.js"],
			features: ["object-values"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.get-own-property-descriptors": {
			library: "core-js",
			relativePaths: ["modules/es.object.get-own-property-descriptors.js"],
			features: ["javascript.builtins.Object.getOwnPropertyDescriptors"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.assign": {
			library: "core-js",
			relativePaths: ["modules/es.object.assign.js"],
			features: ["javascript.builtins.Object.assign"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.create": {
			library: "core-js",
			relativePaths: ["modules/es.object.create.js"],
			features: ["javascript.builtins.Object.create"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.define-properties": {
			library: "core-js",
			relativePaths: ["modules/es.object.define-properties.js"],
			features: ["javascript.builtins.Object.defineProperties"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.define-property": {
			library: "core-js",
			relativePaths: ["modules/es.object.define-property.js"],
			features: ["javascript.builtins.Object.defineProperty"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.freeze": {
			library: "core-js",
			relativePaths: ["modules/es.object.freeze.js"],
			features: ["javascript.builtins.Object.freeze"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.get-own-property-descriptor": {
			library: "core-js",
			relativePaths: ["modules/es.object.get-own-property-descriptor.js"],
			features: ["javascript.builtins.Object.getOwnPropertyDescriptor"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.get-own-property-names": {
			library: "core-js",
			relativePaths: ["modules/es.object.get-own-property-names.js"],
			features: ["javascript.builtins.Object.getOwnPropertyNames"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.get-prototype-of": {
			library: "core-js",
			relativePaths: ["modules/es.object.get-prototype-of.js"],
			features: ["javascript.builtins.Object.getPrototypeOf"],

			dependencies: ["proto"],
			contexts: ALL_CONTEXTS
		},
		"es.object.is-extensible": {
			library: "core-js",
			relativePaths: ["modules/es.object.is-extensible.js"],
			features: ["javascript.builtins.Object.isExtensible"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.is-frozen": {
			library: "core-js",
			relativePaths: ["modules/es.object.is-frozen.js"],
			features: ["javascript.builtins.Object.isFrozen"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.is-sealed": {
			library: "core-js",
			relativePaths: ["modules/es.object.is-sealed.js"],
			features: ["javascript.builtins.Object.isSealed"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.is": {
			library: "core-js",
			relativePaths: ["modules/es.object.is.js"],
			features: ["javascript.builtins.Object.is"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.keys": {
			library: "core-js",
			relativePaths: ["modules/es.object.keys.js"],
			features: ["javascript.builtins.Object.keys"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.prevent-extensions": {
			library: "core-js",
			relativePaths: ["modules/es.object.prevent-extensions.js"],
			features: ["javascript.builtins.Object.preventExtensions"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.seal": {
			library: "core-js",
			relativePaths: ["modules/es.object.seal.js"],
			features: ["javascript.builtins.Object.seal"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.set-prototype-of": {
			library: "core-js",
			relativePaths: ["modules/es.object.set-prototype-of.js"],
			features: ["javascript.builtins.Object.setPrototypeOf"],

			dependencies: ["proto"],
			contexts: ALL_CONTEXTS
		},
		"es.object.to-string": {
			library: "core-js",
			relativePaths: ["modules/es.object.to-string.js"],
			features: ["javascript.builtins.Object.toString"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.function": {
			polyfills: ["es.function.bind", "es.function.name"]
		},
		"es.function.bind": {
			library: "core-js",
			relativePaths: ["modules/es.function.bind.js"],
			features: ["javascript.builtins.Function.bind"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.function.name": {
			library: "core-js",
			relativePaths: ["modules/es.function.name.js"],
			features: ["javascript.builtins.Function.name"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},

		"es.array": {
			polyfills: [
				"es.array.concat",
				"es.array.copy-within",
				"es.array.every",
				"es.array.flat",
				"es.array.flat-map",
				"es.array.fill",
				"es.array.filter",
				"es.array.find",
				"es.array.find-index",
				"es.array.for-each",
				"es.array.from",
				"es.array.includes",
				"es.array.index-of",
				"es.array.is-array",
				"es.array.iterator",
				"es.array.join",
				"es.array.last-index-of",
				"es.array.map",
				"es.array.of",
				"es.array.reduce",
				"es.array.reduce-right",
				"es.array.slice",
				"es.array.some",
				"es.array.sort",
				"es.array.species",
				"es.array.splice"
			]
		},
		"es.array.concat": {
			library: "core-js",
			relativePaths: ["modules/es.array.concat.js"],
			features: ["javascript.builtins.Array.concat"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.flat": {
			library: "core-js",
			relativePaths: ["modules/es.array.flat.js"],
			features: ["javascript.builtins.Array.flat"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.flat-map": {
			library: "core-js",
			relativePaths: ["modules/es.array.flat-map.js"],
			features: ["javascript.builtins.Array.flatMap"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.last-index": {
			library: "core-js",
			relativePaths: ["modules/esnext.array.last-index.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.last-item": {
			library: "core-js",
			relativePaths: ["modules/esnext.array.last-item.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.copy-within": {
			library: "core-js",
			relativePaths: ["modules/es.array.copy-within.js"],
			features: ["javascript.builtins.Array.copyWithin"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.every": {
			library: "core-js",
			relativePaths: ["modules/es.array.every.js"],
			features: ["javascript.builtins.Array.every"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.fill": {
			library: "core-js",
			relativePaths: ["modules/es.array.fill.js"],
			features: ["javascript.builtins.Array.fill"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.filter": {
			library: "core-js",
			relativePaths: ["modules/es.array.filter.js"],
			features: ["javascript.builtins.Array.filter"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.find-index": {
			library: "core-js",
			relativePaths: ["modules/es.array.find-index.js"],
			features: ["javascript.builtins.Array.findIndex"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.find": {
			library: "core-js",
			relativePaths: ["modules/es.array.find.js"],
			features: ["javascript.builtins.Array.find"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.for-each": {
			library: "core-js",
			relativePaths: ["modules/es.array.for-each.js"],
			features: ["javascript.builtins.Array.forEach"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.from": {
			library: "core-js",
			relativePaths: ["modules/es.array.from.js"],
			features: ["javascript.builtins.Array.from"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.includes": {
			library: "core-js",
			relativePaths: ["modules/es.array.includes.js"],
			features: ["javascript.builtins.Array.includes"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.index-of": {
			library: "core-js",
			relativePaths: ["modules/es.array.index-of.js"],
			features: ["javascript.builtins.Array.indexOf"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.is-array": {
			library: "core-js",
			relativePaths: ["modules/es.array.is-array.js"],
			features: ["javascript.builtins.Array.isArray"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.iterator": {
			library: "core-js",
			relativePaths: ["modules/es.array.iterator.js"],
			features: ["javascript.builtins.Array.@@iterator"],

			dependencies: ["es.symbol.iterator"],
			contexts: ALL_CONTEXTS
		},
		"es.array.join": {
			library: "core-js",
			relativePaths: ["modules/es.array.join.js"],
			features: ["javascript.builtins.Array.join"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.last-index-of": {
			library: "core-js",
			relativePaths: ["modules/es.array.last-index-of.js"],
			features: ["javascript.builtins.Array.lastIndexOf"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.map": {
			library: "core-js",
			relativePaths: ["modules/es.array.map.js"],
			features: ["javascript.builtins.Array.map"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.of": {
			library: "core-js",
			relativePaths: ["modules/es.array.of.js"],
			features: ["javascript.builtins.Array.of"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.reduce-right": {
			library: "core-js",
			relativePaths: ["modules/es.array.reduce-right.js"],
			features: ["javascript.builtins.Array.reduceRight"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.reduce": {
			library: "core-js",
			relativePaths: ["modules/es.array.reduce.js"],
			features: ["javascript.builtins.Array.reduce"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.slice": {
			library: "core-js",
			relativePaths: ["modules/es.array.slice.js"],
			features: ["javascript.builtins.Array.slice"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.some": {
			library: "core-js",
			relativePaths: ["modules/es.array.some.js"],
			features: ["javascript.builtins.Array.some"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.sort": {
			library: "core-js",
			relativePaths: ["modules/es.array.sort.js"],
			features: ["javascript.builtins.Array.sort"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.species": {
			library: "core-js",
			relativePaths: ["modules/es.array.species.js"],
			features: ["javascript.builtins.Array.@@species"],

			dependencies: ["es.symbol.species"],
			contexts: ALL_CONTEXTS
		},
		"es.array.splice": {
			library: "core-js",
			relativePaths: ["modules/es.array.splice.js"],
			features: ["javascript.builtins.Array.splice"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array-buffer": {
			polyfills: ["es.array-buffer.constructor", "es.array-buffer.is-view", "es.array-buffer.slice"]
		},
		"es.array-buffer.constructor": {
			library: "core-js",
			relativePaths: ["modules/es.array-buffer.constructor.js"],
			features: ["javascript.builtins.ArrayBuffer"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array-buffer.is-view": {
			library: "core-js",
			relativePaths: ["modules/es.array-buffer.is-view.js"],
			features: ["javascript.builtins.ArrayBuffer.isView"],

			dependencies: ["es.array-buffer.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.array-buffer.slice": {
			library: "core-js",
			relativePaths: ["modules/es.array-buffer.slice.js"],
			features: ["javascript.builtins.ArrayBuffer.slice"],

			dependencies: ["es.array-buffer.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.string": {
			polyfills: [
				"es.string.anchor",
				"es.string.big",
				"es.string.blink",
				"es.string.bold",
				"es.string.code-point-at",
				"es.string.ends-with",
				"es.string.fixed",
				"es.string.fontcolor",
				"es.string.fontsize",
				"es.string.from-code-point",
				"es.string.includes",
				"es.string.italics",
				"es.string.iterator",
				"es.string.link",
				"es.string.match",
				"es.string.pad-end",
				"es.string.pad-start",
				"es.string.raw",
				"es.string.repeat",
				"es.string.search",
				"es.string.small",
				"es.string.split",
				"es.string.starts-with",
				"es.string.strike",
				"es.string.sub",
				"es.string.sup",
				"es.string.trim",
				"es.string.trim-start",
				"es.string.trim-end",
				"es.string.replace-all"
			]
		},
		"es.string.at": {
			library: "core-js",
			relativePaths: ["modules/esnext.string.at.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.code-points": {
			library: "core-js",
			relativePaths: ["modules/esnext.string.code-points.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.match-all": {
			library: "core-js",
			relativePaths: ["modules/es.string.match-all.js"],
			features: ["javascript.builtins.String.matchAll"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.replace-all": {
			library: "core-js",
			relativePaths: ["modules/es.string.replace-all.js"],
			features: ["javascript.builtins.String.replaceAll"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.trim-start": {
			library: "core-js",
			relativePaths: ["modules/es.string.trim-start.js"],
			features: ["javascript.builtins.String.trimStart"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.trim-end": {
			library: "core-js",
			relativePaths: ["modules/es.string.trim-end.js"],
			features: ["javascript.builtins.String.trimEnd"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.anchor": {
			library: "core-js",
			relativePaths: ["modules/es.string.anchor.js"],
			features: ["javascript.builtins.String.anchor"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.big": {
			library: "core-js",
			relativePaths: ["modules/es.string.big.js"],
			features: ["javascript.builtins.String.big"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.blink": {
			library: "core-js",
			relativePaths: ["modules/es.string.blink.js"],
			features: ["javascript.builtins.String.blink"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.bold": {
			library: "core-js",
			relativePaths: ["modules/es.string.bold.js"],
			features: ["javascript.builtins.String.bold"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.code-point-at": {
			library: "core-js",
			relativePaths: ["modules/es.string.code-point-at.js"],
			features: ["javascript.builtins.String.codePointAt"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.ends-with": {
			library: "core-js",
			relativePaths: ["modules/es.string.ends-with.js"],
			features: ["javascript.builtins.String.endsWith"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.fixed": {
			library: "core-js",
			relativePaths: ["modules/es.string.fixed.js"],
			features: ["javascript.builtins.String.fixed"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.fontcolor": {
			library: "core-js",
			relativePaths: ["modules/es.string.fontcolor.js"],
			features: ["javascript.builtins.String.fontcolor"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.fontsize": {
			library: "core-js",
			relativePaths: ["modules/es.string.fontsize.js"],
			features: ["javascript.builtins.String.fontsize"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.from-code-point": {
			library: "core-js",
			relativePaths: ["modules/es.string.from-code-point.js"],
			features: ["javascript.builtins.String.fromCodePoint"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.includes": {
			library: "core-js",
			relativePaths: ["modules/es.string.includes.js"],
			features: ["javascript.builtins.String.includes"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.italics": {
			library: "core-js",
			relativePaths: ["modules/es.string.italics.js"],
			features: ["javascript.builtins.String.italics"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.iterator": {
			library: "core-js",
			relativePaths: ["modules/es.string.iterator.js"],
			features: ["javascript.builtins.String.@@iterator"],

			dependencies: ["es.symbol.iterator"],
			contexts: ALL_CONTEXTS
		},
		"es.string.link": {
			library: "core-js",
			relativePaths: ["modules/es.string.link.js"],
			features: ["javascript.builtins.String.link"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.match": {
			library: "core-js",
			relativePaths: ["modules/es.string.match.js"],
			features: ["javascript.builtins.String.match"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.pad-end": {
			library: "core-js",
			relativePaths: ["modules/es.string.pad-end.js"],
			features: ["javascript.builtins.String.padEnd"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.pad-start": {
			library: "core-js",
			relativePaths: ["modules/es.string.pad-start.js"],
			features: ["javascript.builtins.String.padStart"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.raw": {
			library: "core-js",
			relativePaths: ["modules/es.string.raw.js"],
			features: ["javascript.builtins.String.raw"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.repeat": {
			library: "core-js",
			relativePaths: ["modules/es.string.repeat.js"],
			features: ["javascript.builtins.String.repeat"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.replace": {
			library: "core-js",
			relativePaths: ["modules/es.string.replace.js"],
			features: ["javascript.builtins.String.replace"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.search": {
			library: "core-js",
			relativePaths: ["modules/es.string.search.js"],
			features: ["javascript.builtins.String.search"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.small": {
			library: "core-js",
			relativePaths: ["modules/es.string.small.js"],
			features: ["javascript.builtins.String.small"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.split": {
			library: "core-js",
			relativePaths: ["modules/es.string.split.js"],
			features: ["javascript.builtins.String.split"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.starts-with": {
			library: "core-js",
			relativePaths: ["modules/es.string.starts-with.js"],
			features: ["javascript.builtins.String.startsWith"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.strike": {
			library: "core-js",
			relativePaths: ["modules/es.string.strike.js"],
			features: ["javascript.builtins.String.strike"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.sub": {
			library: "core-js",
			relativePaths: ["modules/es.string.sub.js"],
			features: ["javascript.builtins.String.sub"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.sup": {
			library: "core-js",
			relativePaths: ["modules/es.string.sup.js"],
			features: ["javascript.builtins.String.sup"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.trim": {
			library: "core-js",
			relativePaths: ["modules/es.string.trim.js"],
			features: ["javascript.builtins.String.trim"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.regexp": {
			polyfills: ["es.regexp.constructor", "es.regexp.flags", "es.regexp.to-string"]
		},
		"es.regexp.constructor": {
			library: "core-js",
			relativePaths: ["modules/es.regexp.constructor.js"],
			features: ["javascript.builtins.RegExp"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.regexp.flags": {
			library: "core-js",
			relativePaths: ["modules/es.regexp.flags.js"],
			features: ["javascript.builtins.RegExp.flags"],

			dependencies: ["es.regexp.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.regexp.to-string": {
			library: "core-js",
			relativePaths: ["modules/es.regexp.to-string.js"],
			features: ["javascript.builtins.RegExp.toString"],

			dependencies: ["es.regexp.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.number": {
			polyfills: [
				"es.number.constructor",
				"es.number.epsilon",
				"es.number.is-finite",
				"es.number.is-integer",
				"es.number.is-nan",
				"es.number.is-safe-integer",
				"es.number.max-safe-integer",
				"es.number.min-safe-integer",
				"es.number.parse-float",
				"es.number.parse-int",
				"es.number.to-fixed",
				"es.number.to-precision"
			]
		},
		"es.number.from-string": {
			library: "core-js",
			relativePaths: ["modules/esnext.number.from-string.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.constructor": {
			library: "core-js",
			relativePaths: ["modules/es.number.constructor.js"],
			features: ["javascript.builtins.Number"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.epsilon": {
			library: "core-js",
			relativePaths: ["modules/es.number.epsilon.js"],
			features: ["javascript.builtins.Number.EPSILON"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.is-finite": {
			library: "core-js",
			relativePaths: ["modules/es.number.is-finite.js"],
			features: ["javascript.builtins.Number.isFinite"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.is-integer": {
			library: "core-js",
			relativePaths: ["modules/es.number.is-integer.js"],
			features: ["javascript.builtins.Number.isInteger"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.is-nan": {
			library: "core-js",
			relativePaths: ["modules/es.number.is-nan.js"],
			features: ["javascript.builtins.Number.isNaN"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.is-safe-integer": {
			library: "core-js",
			relativePaths: ["modules/es.number.is-safe-integer.js"],
			features: ["javascript.builtins.Number.isSafeInteger"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.max-safe-integer": {
			library: "core-js",
			relativePaths: ["modules/es.number.max-safe-integer.js"],
			features: ["javascript.builtins.Number.MAX_SAFE_INTEGER"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.min-safe-integer": {
			library: "core-js",
			relativePaths: ["modules/es.number.min-safe-integer.js"],
			features: ["javascript.builtins.Number.MIN_SAFE_INTEGER"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.parse-float": {
			library: "core-js",
			relativePaths: ["modules/es.number.parse-float.js"],
			features: ["javascript.builtins.Number.parseFloat"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.parse-int": {
			library: "core-js",
			relativePaths: ["modules/es.number.parse-int.js"],
			features: ["javascript.builtins.Number.parseInt"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.to-fixed": {
			library: "core-js",
			relativePaths: ["modules/es.number.to-fixed.js"],
			features: ["javascript.builtins.Number.toFixed"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.to-precision": {
			library: "core-js",
			relativePaths: ["modules/es.number.to-precision.js"],
			features: ["javascript.builtins.Number.toPrecision"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math": {
			polyfills: [
				"es.math.acosh",
				"es.math.asinh",
				"es.math.atanh",
				"es.math.cbrt",
				"es.math.clz32",
				"es.math.cosh",
				"es.math.expm1",
				"es.math.fround",
				"es.math.hypot",
				"es.math.imul",
				"es.math.log1p",
				"es.math.log2",
				"es.math.log10",
				"es.math.sign",
				"es.math.sinh",
				"es.math.tanh",
				"es.math.trunc"
			]
		},
		"es.math.clamp": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.clamp.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.deg-per-rad": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.deg-per-rad.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.degrees": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.degrees.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.fscale": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.fscale.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.iaddh": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.iaddh.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.imulh": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.imulh.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.isubh": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.isubh.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.rad-per-deg": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.rad-per-deg.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.radians": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.radians.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.scale": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.scale.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.signbit": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.signbit.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.umulh": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.umulh.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.acosh": {
			library: "core-js",
			relativePaths: ["modules/es.math.acosh.js"],
			features: ["javascript.builtins.Math.acosh"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.asinh": {
			library: "core-js",
			relativePaths: ["modules/es.math.asinh.js"],
			features: ["javascript.builtins.Math.asinh"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.atanh": {
			library: "core-js",
			relativePaths: ["modules/es.math.atanh.js"],
			features: ["javascript.builtins.Math.atanh"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.cbrt": {
			library: "core-js",
			relativePaths: ["modules/es.math.cbrt.js"],
			features: ["javascript.builtins.Math.cbrt"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.clz32": {
			library: "core-js",
			relativePaths: ["modules/es.math.clz32.js"],
			features: ["javascript.builtins.Math.clz32"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.cosh": {
			library: "core-js",
			relativePaths: ["modules/es.math.cosh.js"],
			features: ["javascript.builtins.Math.cosh"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.expm1": {
			library: "core-js",
			relativePaths: ["modules/es.math.expm1.js"],
			features: ["javascript.builtins.Math.expm1"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.fround": {
			library: "core-js",
			relativePaths: ["modules/es.math.fround.js"],
			features: ["javascript.builtins.Math.fround"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.hypot": {
			library: "core-js",
			relativePaths: ["modules/es.math.hypot.js"],
			features: ["javascript.builtins.Math.hypot"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.imul": {
			library: "core-js",
			relativePaths: ["modules/es.math.imul.js"],
			features: ["javascript.builtins.Math.imul"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.log1p": {
			library: "core-js",
			relativePaths: ["modules/es.math.log1p.js"],
			features: ["javascript.builtins.Math.log1p"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.log2": {
			library: "core-js",
			relativePaths: ["modules/es.math.log2.js"],
			features: ["javascript.builtins.Math.log2"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.log10": {
			library: "core-js",
			relativePaths: ["modules/es.math.log10.js"],
			features: ["javascript.builtins.Math.log10"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.sign": {
			library: "core-js",
			relativePaths: ["modules/es.math.sign.js"],
			features: ["javascript.builtins.Math.sign"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.sinh": {
			library: "core-js",
			relativePaths: ["modules/es.math.sinh.js"],
			features: ["javascript.builtins.Math.sinh"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.tanh": {
			library: "core-js",
			relativePaths: ["modules/es.math.tanh.js"],
			features: ["javascript.builtins.Math.tanh"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.trunc": {
			library: "core-js",
			relativePaths: ["modules/es.math.trunc.js"],
			features: ["javascript.builtins.Math.trunc"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.data-view": {
			library: "core-js",
			relativePaths: ["modules/es.data-view.js"],
			features: ["javascript.builtins.DataView"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.date": {
			polyfills: ["es.date.now", "es.date.to-iso-string", "es.date.to-json", "es.date.to-primitive", "es.date.to-string"]
		},
		"es.date.now": {
			library: "core-js",
			relativePaths: ["modules/es.date.now.js"],
			features: ["javascript.builtins.Date.now"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.date.to-iso-string": {
			library: "core-js",
			relativePaths: ["modules/es.date.to-iso-string.js"],
			features: ["javascript.builtins.Date.toISOString"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.date.to-json": {
			library: "core-js",
			relativePaths: ["modules/es.date.to-json.js"],
			features: ["javascript.builtins.Date.toJSON"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.date.to-primitive": {
			library: "core-js",
			relativePaths: ["modules/es.date.to-primitive.js"],
			features: ["javascript.builtins.Date.@@toPrimitive"],

			dependencies: ["es.symbol.to-primitive"],
			contexts: ALL_CONTEXTS
		},
		"es.date.to-string": {
			library: "core-js",
			relativePaths: ["modules/es.date.to-string.js"],
			features: ["javascript.builtins.Date.toString"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.symbol": {
			polyfills: [
				"es.symbol.async-iterator",
				"es.symbol.has-instance",
				"es.symbol.is-concat-spreadable",
				"es.symbol.iterator",
				"es.symbol.constructor",
				"es.symbol.match",
				"es.symbol.match-all",
				"es.symbol.replace",
				"es.symbol.search",
				"es.symbol.species",
				"es.symbol.split",
				"es.symbol.to-primitive",
				"es.symbol.to-string-tag",
				"es.symbol.unscopables",
				"es.symbol.description"
			]
		},
		"es.symbol.description": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.description.js"],
			features: ["javascript.builtins.Symbol.description"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.pattern-match": {
			library: "core-js",
			relativePaths: ["modules/esnext.symbol.pattern-match.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.constructor": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.js"],
			features: ["javascript.builtins.Symbol"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.async-iterator": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.async-iterator.js"],
			features: ["javascript.builtins.Symbol.asyncIterator"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.has-instance": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.has-instance.js", "modules/es.function.has-instance.js"],
			features: ["javascript.builtins.Symbol.hasInstance"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.is-concat-spreadable": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.is-concat-spreadable.js"],
			features: ["javascript.builtins.Symbol.isConcatSpreadable"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.iterator": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.iterator.js"],
			features: ["javascript.builtins.Symbol.iterator"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.match": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.match.js"],
			features: ["javascript.builtins.Symbol.match"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.match-all": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.match-all.js"],
			features: ["javascript.builtins.Symbol.matchAll"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.replace": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.replace.js"],
			features: ["javascript.builtins.Symbol.replace"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.search": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.search.js"],
			features: ["javascript.builtins.Symbol.search"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.species": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.species.js"],
			features: ["javascript.builtins.Symbol.species"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.split": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.split.js"],
			features: ["javascript.builtins.Symbol.split"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.to-primitive": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.to-primitive.js"],
			features: ["javascript.builtins.Symbol.toPrimitive"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.to-string-tag": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.to-string-tag.js", "modules/es.json.to-string-tag.js", "modules/es.math.to-string-tag.js"],
			features: ["javascript.builtins.Symbol.toStringTag"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.unscopables": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.unscopables.js"],
			features: ["javascript.builtins.Symbol.unscopables"],

			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.collections": {
			polyfills: ["es.map", "es.weak-map", "es.set", "es.weak-set"]
		},
		"es.map": {
			library: "core-js",
			relativePaths: ["modules/es.map.js"],
			features: ["javascript.builtins.Map", "javascript.builtins.Map.@@iterator"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.map.every": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.every.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.filter": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.filter.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.find": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.find.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.find-key": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.find-key.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.from": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.group-by": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.group-by.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.includes": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.includes.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.key-by": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.key-by.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.key-of": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.key-of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.map-keys": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.map-keys.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.map-values": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.map-values.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.merge": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.merge.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.of": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.reduce": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.reduce.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.some": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.some.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.update": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.update.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.emplace": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.emplace.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.weak-map": {
			library: "core-js",
			relativePaths: ["modules/es.weak-map.js"],
			features: ["javascript.builtins.WeakMap"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.weak-map.from": {
			library: "core-js",
			relativePaths: ["modules/esnext.weak-map.from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.weak-map"],
			contexts: ALL_CONTEXTS
		},
		"es.weak-map.of": {
			library: "core-js",
			relativePaths: ["modules/esnext.weak-map.of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.weak-map"],
			contexts: ALL_CONTEXTS
		},
		"es.set": {
			library: "core-js",
			relativePaths: ["modules/es.set.js"],
			features: ["javascript.builtins.Set", "javascript.builtins.Set.@@iterator"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.set.add-all": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.add-all.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.delete-all": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.delete-all.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.difference": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.difference.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.every": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.every.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.filter": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.filter.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.find": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.find.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.from": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.intersection": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.intersection.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.join": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.join.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.map": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.map.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.of": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.reduce": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.reduce.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.some": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.some.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.symmetric-difference": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.symmetric-difference.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.union": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.union.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.is-disjoint-from": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.is-disjoint-from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.is-subset-of": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.is-subset-of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.is-superset-of": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.is-superset-of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.weak-set": {
			library: "core-js",
			relativePaths: ["modules/es.weak-set.js"],
			features: ["javascript.builtins.WeakSet"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.weak-set.from": {
			library: "core-js",
			relativePaths: ["modules/esnext.weak-set.from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.weak-set"],
			contexts: ALL_CONTEXTS
		},
		"es.weak-set.of": {
			library: "core-js",
			relativePaths: ["modules/esnext.weak-set.of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: ["es.weak-set"],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array": {
			polyfills: [
				"es.typed-array.copy-within",
				"es.typed-array.every",
				"es.typed-array.fill",
				"es.typed-array.filter",
				"es.typed-array.find",
				"es.typed-array.find-index",
				"es.typed-array.float32-array",
				"es.typed-array.float64-array",
				"es.typed-array.for-each",
				"es.typed-array.from",
				"es.typed-array.includes",
				"es.typed-array.index-of",
				"es.typed-array.int8-array",
				"es.typed-array.int16-array",
				"es.typed-array.int32-array",
				"es.typed-array.iterator",
				"es.typed-array.join",
				"es.typed-array.last-index-of",
				"es.typed-array.map",
				"es.typed-array.of",
				"es.typed-array.reduce",
				"es.typed-array.reduce-right",
				"es.typed-array.reverse",
				"es.typed-array.set",
				"es.typed-array.slice",
				"es.typed-array.some",
				"es.typed-array.sort",
				"es.typed-array.subarray",
				"es.typed-array.to-locale-string",
				"es.typed-array.to-string",
				"es.typed-array.uint8-array",
				"es.typed-array.uint8-clamped-array",
				"es.typed-array.uint16-array",
				"es.typed-array.uint32-array"
			]
		},
		"es.typed-array.copy-within": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.copy-within.js"],
			features: ["javascript.builtins.TypedArray.copyWithin"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.every": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.every.js"],
			features: ["javascript.builtins.TypedArray.every"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.fill": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.fill.js"],
			features: ["javascript.builtins.TypedArray.fill"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.filter": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.filter.js"],
			features: ["javascript.builtins.TypedArray.filter"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.find": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.find.js"],
			features: ["javascript.builtins.TypedArray.find"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.find-index": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.find-index.js"],
			features: ["javascript.builtins.TypedArray.findIndex"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.float32-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.float32-array.js"],
			features: ["javascript.builtins.Float32Array"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.float64-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.float64-array.js"],
			features: ["javascript.builtins.Float64Array"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.for-each": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.for-each.js"],
			features: ["javascript.builtins.TypedArray.forEach"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.from": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.from.js"],
			features: ["javascript.builtins.TypedArray.from"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.includes": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.includes.js"],
			features: ["javascript.builtins.TypedArray.includes"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.index-of": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.index-of.js"],
			features: ["javascript.builtins.TypedArray.indexOf"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.int8-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.int8-array.js"],
			features: ["javascript.builtins.Int8Array"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.int16-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.int16-array.js"],
			features: ["javascript.builtins.Int16Array"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.int32-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.int32-array.js"],
			features: ["javascript.builtins.Int32Array"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.iterator": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.iterator.js"],
			features: ["javascript.builtins.TypedArray.@@iterator"],

			dependencies: ["es.symbol.iterator"],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.join": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.join.js"],
			features: ["javascript.builtins.TypedArray.join"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.last-index-of": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.last-index-of.js"],
			features: ["javascript.builtins.TypedArray.lastIndexOf"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.map": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.map.js"],
			features: ["javascript.builtins.TypedArray.map"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.of": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.of.js"],
			features: ["javascript.builtins.TypedArray.of"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.reduce": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.reduce.js"],
			features: ["javascript.builtins.TypedArray.reduce"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.reduce-right": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.reduce-right.js"],
			features: ["javascript.builtins.TypedArray.reduceRight"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.reverse": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.reverse.js"],
			features: ["javascript.builtins.TypedArray.reverse"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.set": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.set.js"],
			features: ["javascript.builtins.TypedArray.set"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.slice": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.slice.js"],
			features: ["javascript.builtins.TypedArray.slice"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.some": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.some.js"],
			features: ["javascript.builtins.TypedArray.some"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.sort": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.sort.js"],
			features: ["javascript.builtins.TypedArray.sort"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.subarray": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.subarray.js"],
			features: ["javascript.builtins.TypedArray.subarray"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.to-locale-string": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.to-locale-string.js"],
			features: ["javascript.builtins.TypedArray.toLocaleString"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.to-string": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.to-string.js"],
			features: ["javascript.builtins.TypedArray.toString"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.uint8-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.uint8-array.js"],
			features: ["javascript.builtins.Uint8Array"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.uint8-clamped-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.uint8-clamped-array.js"],
			features: ["javascript.builtins.Uint8ClampedArray"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.uint16-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.uint16-array.js"],
			features: ["javascript.builtins.Uint16Array"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.uint32-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.uint32-array.js"],
			features: ["javascript.builtins.Uint32Array"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect": {
			polyfills: [
				"es.reflect.apply",
				"es.reflect.construct",
				"es.reflect.define-property",
				"es.reflect.delete-property",
				"es.reflect.get",
				"es.reflect.get-own-property-descriptor",
				"es.reflect.get-prototype-of",
				"es.reflect.has",
				"es.reflect.is-extensible",
				"es.reflect.own-keys",
				"es.reflect.prevent-extensions",
				"es.reflect.set",
				"es.reflect.set-prototype-of"
			]
		},

		"es.reflect.define-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.define-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.delete-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.delete-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.get-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-metadata-keys": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.get-metadata-keys.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-own-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.get-own-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-own-metadata-keys": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.get-own-metadata-keys.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.has-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.has-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.has-own-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.has-own-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.apply": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.apply.js"],
			features: ["javascript.builtins.Reflect.apply"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.construct": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.construct.js"],
			features: ["javascript.builtins.Reflect.construct"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.define-property": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.define-property.js"],
			features: ["javascript.builtins.Reflect.defineProperty"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.delete-property": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.delete-property.js"],
			features: ["javascript.builtins.Reflect.deleteProperty"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.get.js"],
			features: ["javascript.builtins.Reflect.get"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-own-property-descriptor": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.get-own-property-descriptor.js"],
			features: ["javascript.builtins.Reflect.getOwnPropertyDescriptor"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-prototype-of": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.get-prototype-of.js"],
			features: ["javascript.builtins.Reflect.getPrototypeOf"],

			dependencies: ["proto"],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.has": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.has.js"],
			features: ["javascript.builtins.Reflect.has"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.is-extensible": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.is-extensible.js"],
			features: ["javascript.builtins.Reflect.isExtensible"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.own-keys": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.own-keys.js"],
			features: ["javascript.builtins.Reflect.ownKeys"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.prevent-extensions": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.prevent-extensions.js"],
			features: ["javascript.builtins.Reflect.preventExtensions"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.set": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.set.js"],
			features: ["javascript.builtins.Reflect.set"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.set-prototype-of": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.set-prototype-of.js"],
			features: ["javascript.builtins.Reflect.setPrototypeOf"],

			dependencies: ["proto"],
			contexts: ALL_CONTEXTS
		},
		esnext: {
			polyfills: ["esnext.array", "esnext.collections", "esnext.math", "esnext.number", "esnext.object", "esnext.promise", "esnext.reflect", "esnext.string", "esnext.symbol"]
		},
		// An alias for the alias 'esnext'
		"es2016+": {
			polyfills: ["esnext"]
		},
		"esnext.array": {
			polyfills: ["es.array.last-index", "es.array.last-item"]
		},
		"esnext.object": {
			polyfills: []
		},
		"esnext.collections": {
			polyfills: ["esnext.map", "esnext.weak-map", "esnext.set", "esnext.weak-set"]
		},
		"esnext.map": {
			polyfills: [
				"es.map.every",
				"es.map.filter",
				"es.map.find",
				"es.map.find-key",
				"es.map.from",
				"es.map.group-by",
				"es.map.includes",
				"es.map.key-by",
				"es.map.key-of",
				"es.map.map-keys",
				"es.map.map-values",
				"es.map.merge",
				"es.map.of",
				"es.map.reduce",
				"es.map.some",
				"es.map.update",
				"es.map.emplace"
			]
		},
		"esnext.weak-map": {
			polyfills: ["es.weak-map.from", "es.weak-map.of"]
		},
		"esnext.set": {
			polyfills: [
				"es.set.add-all",
				"es.set.delete-all",
				"es.set.difference",
				"es.set.every",
				"es.set.filter",
				"es.set.find",
				"es.set.from",
				"es.set.intersection",
				"es.set.join",
				"es.set.map",
				"es.set.of",
				"es.set.reduce",
				"es.set.some",
				"es.set.symmetric-difference",
				"es.set.union",
				"es.set.is-disjoint-from",
				"es.set.is-subset-of",
				"es.set.is-superset-of"
			]
		},
		"esnext.weak-set": {
			polyfills: ["es.weak-set.from", "es.weak-set.of"]
		},
		"esnext.math": {
			polyfills: [
				"es.math.clamp",
				"es.math.deg-per-rad",
				"es.math.degrees",
				"es.math.fscale",
				"es.math.iaddh",
				"es.math.imulh",
				"es.math.isubh",
				"es.math.rad-per-deg",
				"es.math.radians",
				"es.math.scale",
				"es.math.signbit",
				"es.math.umulh"
			]
		},
		"esnext.number": {
			polyfills: ["es.number.from-string"]
		},
		"esnext.promise": {
			polyfills: ["es.promise.try"]
		},
		"esnext.reflect": {
			polyfills: [
				"es.reflect.define-metadata",
				"es.reflect.delete-metadata",
				"es.reflect.get-metadata",
				"es.reflect.get-metadata-keys",
				"es.reflect.get-own-metadata",
				"es.reflect.get-own-metadata-keys",
				"es.reflect.has-metadata",
				"es.reflect.has-own-metadata",
				"es.reflect.metadata"
			]
		},
		"esnext.string": {
			polyfills: ["es.string.at", "es.string.code-points", "es.string.match-all"]
		},
		"esnext.symbol": {
			polyfills: ["es.symbol.pattern-match"]
		},
		"dom.collections.iterable": {
			polyfills: ["dom.collections.iterator", "dom.collections.for-each"]
		},
		"dom.collections.iterator": {
			library: "core-js",
			relativePaths: ["modules/web.dom-collections.iterator.js"],
			features: ["api.NodeList.forEach"],

			dependencies: ["es.symbol.iterator"],
			contexts: WINDOW_CONTEXT
		},
		"dom.collections.for-each": {
			library: "core-js",
			relativePaths: ["modules/web.dom-collections.for-each.js"],
			features: ["api.NodeList.forEach"],

			dependencies: ["es.symbol.iterator"],
			contexts: WINDOW_CONTEXT
		},

		"pointer-event": {
			library: "@wessberg/pointer-events",
			relativePaths: ["dist/index.js"],
			features: ["pointer"],

			dependencies: [
				// TODO: Also relies on "elementFromPoint" which there isn't a polyfill for yet. Add it to the dependencies when the polyfill is ready
				// TODO: Also relies on EventTarget and will throw in browsers where EventTarget is not defined
				"es.array.from",
				"es.array.some",
				"es.array.every",
				"es.string.includes",
				"es.set",
				"es.map",
				"es.object.define-properties",
				"es.object.define-property",
				"event",
				"custom-event",
				"get-computed-style"
			],
			contexts: WINDOW_CONTEXT
		},
		xhr: {
			library: "xhr-polyfill",
			relativePaths: ["dist/xhr-polyfill.js"],
			features: ["xhr2"],

			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		fetch: {
			localPaths: ["polyfill-lib/fetch/fetch.js"],
			features: ["fetch"],
			version: "1.0.0",
			dependencies: ["es.array.for-each", "es.object.get-own-property-names", "es.promise", "xhr"],
			contexts: WINDOW_CONTEXT
		},
		intl: {
			polyfills: [
				"intl.date-time-format",
				"intl.display-names",
				"intl.get-canonical-locales",
				"intl.list-format",
				"intl.locale",
				"intl.number-format",
				"intl.plural-rules",
				"intl.relative-time-format"
			]
		},
		"intl.date-time-format": {
			library: "@formatjs/intl-datetimeformat",
			relativePaths: ["lib/polyfill.js"],
			meta: {
				localeDir: "locale-data"
			},
			features: ["javascript.builtins.Intl.DateTimeFormat"],

			dependencies: [
				"intl.locale",
				"intl.number-format",
				"es.set",
				"es.weak-map",
				"es.object.is",
				"es.object.keys",
				"es.object.set-prototype-of",
				"es.object.define-property",
				"es.object.assign",
				"es.object.create",
				"es.array.is-array",
				"es.array.map",
				"es.array.reduce",
				"es.array.join",
				"es.array.filter",
				"es.array.index-of",
				"es.date.now",
				"es.string.replace"
			],
			contexts: ALL_CONTEXTS
		},
		"intl.display-names": {
			library: "@formatjs/intl-displaynames",
			relativePaths: ["lib/polyfill.js"],
			meta: {
				localeDir: "locale-data"
			},
			features: ["javascript.builtins.Intl.DisplayNames"],

			dependencies: [
				"intl.locale",
				"es.weak-map",
				"es.object.keys",
				"es.object.set-prototype-of",
				"es.object.define-property",
				"es.object.assign",
				"es.object.create",
				"es.array.is-array",
				"es.array.map",
				"es.array.reduce",
				"es.array.join",
				"es.array.filter"
			],
			contexts: ALL_CONTEXTS
		},
		"intl.get-canonical-locales": {
			library: "@formatjs/intl-getcanonicallocales",
			relativePaths: ["lib/polyfill.js"],
			meta: {},
			features: ["javascript.builtins.Intl.getCanonicalLocales"],

			dependencies: ["es.array.filter", "es.array.index-of", "es.array.join", "es.array.sort", "es.object.define-property", "es.object.keys", "es.string.split"],
			contexts: ALL_CONTEXTS
		},
		"intl.list-format": {
			library: "@formatjs/intl-listformat",
			relativePaths: ["lib/polyfill.js"],
			meta: {
				localeDir: "locale-data"
			},
			features: ["javascript.builtins.Intl.ListFormat"],

			dependencies: [
				"intl.locale",
				"es.array.filter",
				"es.array.is-array",
				"es.array.join",
				"es.array.map",
				"es.array.reduce",
				"es.object.assign",
				"es.object.create",
				"es.object.define-property",
				"es.object.keys",
				"es.object.set-prototype-of",
				"es.weak-map"
			],
			contexts: ALL_CONTEXTS
		},
		"intl.locale": {
			library: "@formatjs/intl-locale",
			relativePaths: ["lib/polyfill.js"],
			meta: {},
			features: ["javascript.builtins.Intl.Locale"],

			dependencies: [
				"intl.get-canonical-locales",
				"es.array.concat",
				"es.array.filter",
				"es.array.for-each",
				"es.array.index-of",
				"es.array.is-array",
				"es.array.join",
				"es.array.sort",
				"es.object.assign",
				"es.object.create",
				"es.object.define-property",
				"es.object.freeze",
				"es.object.get-own-property-descriptor",
				"es.object.is",
				"es.object.keys",
				"es.object.set-prototype-of",
				"es.string.split",
				"es.weak-map"
			],
			contexts: ALL_CONTEXTS
		},
		"intl.number-format": {
			library: "@formatjs/intl-numberformat",
			relativePaths: ["lib/polyfill.js"],
			meta: {
				localeDir: "locale-data"
			},
			features: ["javascript.builtins.Intl.NumberFormat", "javascript.builtins.Intl.NumberFormat.NumberFormat.options_unit_parameter"],

			dependencies: [
				"intl.plural-rules",
				"intl.locale",
				"es.array.filter",
				"es.array.index-of",
				"es.array.is-array",
				"es.array.join",
				"es.array.map",
				"es.array.reduce",
				"es.object.assign",
				"es.object.create",
				"es.object.define-property",
				"es.object.freeze",
				"es.object.freeze",
				"es.object.is",
				"es.object.keys",
				"es.object.set-prototype-of",
				"es.string.replace",
				"es.string.split",
				"es.weak-map"
			],
			contexts: ALL_CONTEXTS
		},
		"intl.plural-rules": {
			library: "@formatjs/intl-pluralrules",
			relativePaths: ["lib/polyfill.js"],
			meta: {
				localeDir: "locale-data"
			},
			features: ["javascript.builtins.Intl.PluralRules"],

			dependencies: [
				"intl.locale",
				"es.array.filter",
				"es.array.for-each",
				"es.array.is-array",
				"es.array.join",
				"es.array.map",
				"es.array.reduce",
				"es.object.assign",
				"es.object.create",
				"es.object.define-property",
				"es.object.is",
				"es.object.keys",
				"es.object.set-prototype-of",
				"es.string.replace",
				"es.string.split",
				"es.weak-map"
			],
			contexts: ALL_CONTEXTS
		},
		"intl.relative-time-format": {
			library: "@formatjs/intl-relativetimeformat",
			relativePaths: ["lib/polyfill.js"],
			meta: {
				localeDir: "locale-data"
			},
			features: ["javascript.builtins.Intl.RelativeTimeFormat"],

			dependencies: [
				"intl.plural-rules",
				"intl.number-format",
				"intl.locale",
				"es.array.filter",
				"es.array.is-array",
				"es.array.join",
				"es.array.map",
				"es.array.reduce",
				"es.object.assign",
				"es.object.create",
				"es.object.define-property",
				"es.object.is",
				"es.object.keys",
				"es.object.set-prototype-of",
				"es.weak-map"
			],
			contexts: ALL_CONTEXTS
		},
		animation: {
			polyfills: ["web-animations"]
		},
		"web-animations": {
			library: "web-animations-js",
			relativePaths: ["web-animations.min.js"],
			features: ["web-animation"],

			dependencies: ["element", "requestanimationframe"],
			contexts: WINDOW_CONTEXT
		},
		"regenerator-runtime": {
			library: "regenerator-runtime",
			relativePaths: ["runtime.js"],
			features: [],

			dependencies: ["es.promise"],
			contexts: ALL_CONTEXTS
		},
		template: {
			library: "@webcomponents/template",
			relativePaths: ["template.js"],
			features: ["template"],

			dependencies: ["es"],
			contexts: WINDOW_CONTEXT
		},
		"web-components": {
			polyfills: ["custom-elements", "shadow-dom", "template"]
		},
		"custom-elements": {
			library: "@webcomponents/custom-elements",
			relativePaths: ["src/custom-elements.js"],
			features: ["custom-elementsv1"],

			dependencies: ["es", "mutation-observer"],
			contexts: WINDOW_CONTEXT
		},
		"shadow-dom": {
			localPaths: [
				"node_modules/@webcomponents/shadydom/src/shadydom.js",
				"node_modules/@webcomponents/shadycss/entrypoints/scoping-shim.js",
				"node_modules/@webcomponents/shadycss/entrypoints/custom-style-interface.js"
			],
			meta: {
				// The experimental variant is based on https://github.com/webcomponents/shadycss/pull/242
				experimental: [
					"node_modules/@webcomponents/shadydom/src/shadydom.js",
					"polyfill-lib/shady-css/entrypoints/scoping-shim.js",
					"node_modules/@webcomponents/shadycss/entrypoints/custom-style-interface.js"
				]
			},
			features: ["shadowdomv1"],
			version: pkg.dependencies["@webcomponents/shadydom"],
			dependencies: ["es", "template", "mutation-observer", "event", "node.contains", "queryselector"],
			contexts: WINDOW_CONTEXT,
			mustComeAfter: ["pointer-event"]
		},
		queryselector: {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/document.querySelector/raw.js"],
			features: ["queryselector"],
			dependencies: ["element", "document", "document-fragment"],
			contexts: WINDOW_CONTEXT
		},
		"document-fragment": {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/DocumentFragment/raw.js"],
			features: ["queryselector"],
			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		"node.parentelement": {
			library: "node.parentelement",
			relativePaths: ["polyfill.js"],
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			features: ["addeventlistener"],

			dependencies: ["document"],
			contexts: WINDOW_CONTEXT
		},
		"scroll-behavior": {
			library: "scroll-behavior-polyfill",
			relativePaths: ["dist/index.js"],
			features: ["css-scroll-behavior", "scrollintoview"],

			dependencies: ["es.object.define-property", "es.object.get-own-property-descriptor", "requestanimationframe"],
			contexts: WINDOW_CONTEXT
		},
		"focus-visible": {
			library: "focus-visible",
			relativePaths: ["dist/focus-visible.js"],
			features: ["css-focus-visible"],
			dependencies: ["class-list"],
			contexts: WINDOW_CONTEXT
		},
		"node.contains": {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/Node.prototype.contains/raw.js"],
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			features: ["addeventlistener"],
			dependencies: ["element"],
			contexts: WINDOW_CONTEXT
		},
		window: {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/Window/raw.js"],
			features: ["addeventlistener"],
			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		document: {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/document/raw.js"],
			// If 'addEventListener' isn't found, the Document interface shouldn't exist on the window
			features: ["addeventlistener"],
			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		"class-list": {
			localPaths: ["polyfill-lib/class-list/class-list.js"],
			features: ["api.Element.classList"],
			version: "1.0.0",
			dependencies: ["dom-token-list"],
			contexts: WINDOW_CONTEXT
		},
		"dom-token-list": {
			localPaths: ["polyfill-lib/dom-token-list/dom-token-list.js"],
			features: ["api.DOMTokenList"],
			version: "1.0.0",
			dependencies: ["es.object.define-property"],
			contexts: WINDOW_CONTEXT
		},
		element: {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/Element/raw.js"],
			// If 'addEventListener' isn't found, the Element interface shouldn't exist on the window
			features: ["addeventlistener"],

			dependencies: ["document"],
			contexts: WINDOW_CONTEXT
		},
		event: {
			polyfills: ["event.constructor", "event.focusin", "event.hashchange"]
		},
		"event.constructor": {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/Event/raw.js"],
			features: ["api.Event.Event"],

			dependencies: ["window", "document", "element", "es.object.define-property"],
			contexts: WINDOW_CONTEXT
		},
		"event.focusin": {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/Event.focusin/raw.js"],
			features: ["focusin-focusout-events"],

			dependencies: ["event.constructor"],
			contexts: WINDOW_CONTEXT
		},
		"event.hashchange": {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/Event.hashchange/raw.js"],
			features: ["hashchange"],

			dependencies: ["event.constructor"],
			contexts: WINDOW_CONTEXT
		},
		"custom-event": {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/CustomEvent/raw.js"],
			features: ["customevent"],

			dependencies: ["event"],
			contexts: WINDOW_CONTEXT
		},
		"event-source": {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/EventSource/raw.js"],
			features: ["eventsource"],

			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		"get-computed-style": {
			library: "polyfill-library",
			relativePaths: ["polyfills/__dist/getComputedStyle/raw.js"],
			features: ["getcomputedstyle"],

			dependencies: ["window"],
			contexts: WINDOW_CONTEXT
		},
		"intersection-observer": {
			library: "intersection-observer",
			relativePaths: ["intersection-observer.js"],
			features: ["intersectionobserver"],

			dependencies: [
				"get-computed-style",
				"es.array.is-array",
				"es.array.filter",
				"es.array.for-each",
				"es.array.index-of",
				"es.array.map",
				"es.array.some",
				"event",
				"es.function",
				"performance.now"
			],
			contexts: WINDOW_CONTEXT
		},
		"mutation-observer": {
			library: "mutationobserver-shim",
			relativePaths: ["dist/mutationobserver.min.js"],
			features: ["mutationobserver"],

			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		"resize-observer": {
			localPaths: ["polyfill-lib/resize-observer/resize-observer.js"],
			features: ["resizeobserver"],
			version: "1.0.0",
			dependencies: ["es.weak-map", "es.object.create", "mutation-observer", "get-computed-style", "requestanimationframe"],
			contexts: WINDOW_CONTEXT
		},
		"broadcast-channel": {
			localPaths: ["polyfill-lib/broadcast-channel/broadcast-channel.js"],
			features: ["broadcastchannel"],
			version: "1.0.0",
			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		setimmediate: {
			polyfills: ["set-immediate"]
		},
		"set-immediate": {
			library: "setimmediate",
			relativePaths: ["setImmediate.js"],
			features: ["setimmediate"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		globalthis: {
			polyfills: ["global-this"]
		},
		"global-this": {
			library: "core-js",
			relativePaths: ["modules/es.global-this.js"],
			features: ["javascript.builtins.globalThis"],

			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"adopted-style-sheets": {
			polyfills: ["constructable-style-sheets"]
		},
		"constructable-style-sheets": {
			library: "construct-style-sheets-polyfill",
			relativePaths: ["dist/adoptedStyleSheets.js"],
			features: ["api.Document.adoptedStyleSheets", "api.ShadowRoot.adoptedStyleSheets"],

			dependencies: ["es.symbol.has-instance"],
			mustComeAfter: ["shadow-dom"],
			contexts: ALL_CONTEXTS
		},
		proto: {
			localPaths: ["polyfill-lib/proto/proto.js"],
			features: ["javascript.builtins.Object.proto"],
			version: "1.0.0",
			dependencies: [],
			contexts: ALL_CONTEXTS
		}
	}
};
