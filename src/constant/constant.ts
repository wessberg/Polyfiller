import {IConstant} from "./i-constant";
import {environment} from "../environment/environment";
// @ts-ignore
import tempDir from "temp-dir";
import {join} from "path";
import {ALL_CONTEXTS, WINDOW_CONTEXT, WINDOW_NODE_CONTEXT} from "../polyfill/polyfill-context";

// tslint:disable:no-duplicate-string

export const constant: IConstant = {
	endpoint: {
		index: ["/api", "/api/"],
		polyfill: "/api/polyfill"
	},
	header: {
		polyfills: "x-applied-polyfills",
		maxChars: 600
	},
	meta: {
		name: environment.NPM_PACKAGE_NAME,
		version: environment.NPM_PACKAGE_VERSION,
		github: environment.NPM_PACKAGE_HOMEPAGE
	},

	path: {
		cacheRoot: join(tempDir, environment.NPM_PACKAGE_NAME),
		cachePackageVersionMap: join(tempDir, environment.NPM_PACKAGE_NAME, "cache_package_version_map.json")
	},

	polyfill: {
		systemjs: {
			library: "systemjs",
			relativePaths: ["dist/system.min.js"],
			meta: {
				system: "dist/system.min.js",
				s: "dist/s.min.js"
			},
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_SYSTEMJS,
			dependencies: ["es.promise", "fetch"],
			contexts: ALL_CONTEXTS
		},
		zone: {
			library: "zone.js",
			meta: {
				error: "dist/zone-error.min.js",
				shadydom: "dist/webapis-shadydom.min.js",
				mediaquery: "dist/webapis-media-query.min.js",
				rxjs: "dist/zone-patch-rxjs.min.js",
				fetch: "dist/zone-patch-fetch.min.js",
				resizeobserver: "dist/zone-patch-resize-observer.min.js"
			},
			relativePaths: {
				window: ["dist/zone.min.js"],
				worker: ["dist/zone.min.js"],
				node: ["dist/zone-node.js"]
			},
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_ZONE_JS,
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
				window: ["perfnow.min.js"],
				worker: ["perfnow.min.js"],
				node: ["lib/performance-now.js"]
			},
			features: ["high-resolution-time"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_PERFNOW,
			dependencies: ["es.date.now"],
			contexts: ALL_CONTEXTS
		},
		url: {
			library: "url-polyfill",
			relativePaths: ["url-polyfill.min.js"],
			features: ["url", "urlsearchparams"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_URL_POLYFILL,
			dependencies: ["es.object.define-properties", "es.array.for-each"],
			contexts: ALL_CONTEXTS
		},
		"object-fit": {
			localPaths: ["node_modules/object-fit-images/dist/ofi.min.js", "polyfill-lib/object-fit/object-fit-hook.js"],
			features: ["object-fit"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_OBJECT_FIT_IMAGES,
			dependencies: ["get-computed-style", "es.object.define-property"],
			contexts: WINDOW_CONTEXT
		},
		console: {
			library: "console-polyfill",
			relativePaths: ["index.js"],
			features: ["console-basic", "console-time"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CONSOLE_POLYFILL,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		base64: {
			library: "Base64",
			relativePaths: ["base64.js"],
			features: ["atob-btoa"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_BASE64,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		blob: {
			library: "blob-polyfill",
			relativePaths: ["Blob.js"],
			features: ["blobbuilder", "bloburls"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_BLOB_POLYFILL,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_REQUESTIDLECALLBACK,
			dependencies: ["requestanimationframe"],
			contexts: WINDOW_CONTEXT
		},
		"request-animation-frame": {
			library: "requestanimationframe",
			relativePaths: ["app/requestAnimationFrame.js"],
			features: ["requestanimationframe"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_REQUESTANIMATIONFRAME,
			dependencies: ["es.date.now", "performance.now"],
			contexts: WINDOW_CONTEXT
		},
		proxy: {
			library: "proxy-polyfill",
			relativePaths: ["proxy.min.js"],
			features: ["proxy"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_PROXY_POLYFILL,
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
			polyfills: ["es.promise.constructor", "es.promise.finally"]
		},
		"es.promise.constructor": {
			library: "core-js",
			relativePaths: ["modules/es.promise.js"],
			features: ["promises"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.promise.finally": {
			library: "core-js",
			relativePaths: ["modules/es.promise.finally.js"],
			features: ["javascript.builtins.Promise.finally"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.promise.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.promise.all-settled": {
			library: "core-js",
			relativePaths: ["modules/esnext.promise.all-settled.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.promise.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.promise.try": {
			library: "core-js",
			relativePaths: ["modules/esnext.promise.try.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.from-entries": {
			library: "core-js",
			relativePaths: ["modules/es.object.from-entries.js"],
			features: ["javascript.builtins.Object.fromEntries"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.lookup-setter": {
			library: "core-js",
			relativePaths: ["modules/es.object.lookup-setter.js"],
			features: ["javascript.builtins.Object.lookupSetter"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.define-getter": {
			library: "core-js",
			relativePaths: ["modules/es.object.define-getter.js"],
			features: ["javascript.builtins.Object.defineGetter"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.define-setter": {
			library: "core-js",
			relativePaths: ["modules/es.object.define-setter.js"],
			features: ["javascript.builtins.Object.defineSetter"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.entries": {
			library: "core-js",
			relativePaths: ["modules/es.object.entries.js"],
			features: ["javascript.builtins.Object.entries"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.values": {
			library: "core-js",
			relativePaths: ["modules/es.object.values.js"],
			features: ["object-values"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.get-own-property-descriptors": {
			library: "core-js",
			relativePaths: ["modules/es.object.get-own-property-descriptors.js"],
			features: ["javascript.builtins.Object.getOwnPropertyDescriptors"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.assign": {
			library: "core-js",
			relativePaths: ["modules/es.object.assign.js"],
			features: ["javascript.builtins.Object.assign"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.create": {
			library: "core-js",
			relativePaths: ["modules/es.object.create.js"],
			features: ["javascript.builtins.Object.create"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.define-properties": {
			library: "core-js",
			relativePaths: ["modules/es.object.define-properties.js"],
			features: ["javascript.builtins.Object.defineProperties"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.define-property": {
			library: "core-js",
			relativePaths: ["modules/es.object.define-property.js"],
			features: ["javascript.builtins.Object.defineProperty"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.freeze": {
			library: "core-js",
			relativePaths: ["modules/es.object.freeze.js"],
			features: ["javascript.builtins.Object.freeze"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.get-own-property-descriptor": {
			library: "core-js",
			relativePaths: ["modules/es.object.get-own-property-descriptor.js"],
			features: ["javascript.builtins.Object.getOwnPropertyDescriptor"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.get-own-property-names": {
			library: "core-js",
			relativePaths: ["modules/es.object.get-own-property-names.js"],
			features: ["javascript.builtins.Object.getOwnPropertyNames"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.get-prototype-of": {
			library: "core-js",
			relativePaths: ["modules/es.object.get-prototype-of.js"],
			features: ["javascript.builtins.Object.getPrototypeOf"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.is-extensible": {
			library: "core-js",
			relativePaths: ["modules/es.object.is-extensible.js"],
			features: ["javascript.builtins.Object.isExtensible"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.is-frozen": {
			library: "core-js",
			relativePaths: ["modules/es.object.is-frozen.js"],
			features: ["javascript.builtins.Object.isFrozen"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.is-sealed": {
			library: "core-js",
			relativePaths: ["modules/es.object.is-sealed.js"],
			features: ["javascript.builtins.Object.isSealed"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.is": {
			library: "core-js",
			relativePaths: ["modules/es.object.is.js"],
			features: ["javascript.builtins.Object.is"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.keys": {
			library: "core-js",
			relativePaths: ["modules/es.object.keys.js"],
			features: ["javascript.builtins.Object.keys"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.prevent-extensions": {
			library: "core-js",
			relativePaths: ["modules/es.object.prevent-extensions.js"],
			features: ["javascript.builtins.Object.preventExtensions"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.seal": {
			library: "core-js",
			relativePaths: ["modules/es.object.seal.js"],
			features: ["javascript.builtins.Object.seal"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.set-prototype-of": {
			library: "core-js",
			relativePaths: ["modules/es.object.set-prototype-of.js"],
			features: ["javascript.builtins.Object.setPrototypeOf"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.object.to-string": {
			library: "core-js",
			relativePaths: ["modules/es.object.to-string.js"],
			features: ["javascript.builtins.Object.toString"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.function.name": {
			library: "core-js",
			relativePaths: ["modules/es.function.name.js"],
			features: ["javascript.builtins.Function.name"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.flat": {
			library: "core-js",
			relativePaths: ["modules/es.array.flat.js"],
			features: ["javascript.builtins.Array.flat"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.flat-map": {
			library: "core-js",
			relativePaths: ["modules/es.array.flat-map.js"],
			features: ["javascript.builtins.Array.flatMap"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.last-index": {
			library: "core-js",
			relativePaths: ["modules/esnext.array.last-index.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.last-item": {
			library: "core-js",
			relativePaths: ["modules/esnext.array.last-item.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.copy-within": {
			library: "core-js",
			relativePaths: ["modules/es.array.copy-within.js"],
			features: ["javascript.builtins.Array.copyWithin"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.every": {
			library: "core-js",
			relativePaths: ["modules/es.array.every.js"],
			features: ["javascript.builtins.Array.every"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.fill": {
			library: "core-js",
			relativePaths: ["modules/es.array.fill.js"],
			features: ["javascript.builtins.Array.fill"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.filter": {
			library: "core-js",
			relativePaths: ["modules/es.array.filter.js"],
			features: ["javascript.builtins.Array.filter"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.find-index": {
			library: "core-js",
			relativePaths: ["modules/es.array.find-index.js"],
			features: ["javascript.builtins.Array.findIndex"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.find": {
			library: "core-js",
			relativePaths: ["modules/es.array.find.js"],
			features: ["javascript.builtins.Array.find"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.for-each": {
			library: "core-js",
			relativePaths: ["modules/es.array.for-each.js"],
			features: ["javascript.builtins.Array.forEach"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.from": {
			library: "core-js",
			relativePaths: ["modules/es.array.from.js"],
			features: ["javascript.builtins.Array.from"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.includes": {
			library: "core-js",
			relativePaths: ["modules/es.array.includes.js"],
			features: ["javascript.builtins.Array.includes"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.index-of": {
			library: "core-js",
			relativePaths: ["modules/es.array.index-of.js"],
			features: ["javascript.builtins.Array.indexOf"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.is-array": {
			library: "core-js",
			relativePaths: ["modules/es.array.is-array.js"],
			features: ["javascript.builtins.Array.isArray"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.iterator": {
			library: "core-js",
			relativePaths: ["modules/es.array.iterator.js"],
			features: ["javascript.builtins.Array.@@iterator"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.iterator"],
			contexts: ALL_CONTEXTS
		},
		"es.array.join": {
			library: "core-js",
			relativePaths: ["modules/es.array.join.js"],
			features: ["javascript.builtins.Array.join"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.last-index-of": {
			library: "core-js",
			relativePaths: ["modules/es.array.last-index-of.js"],
			features: ["javascript.builtins.Array.lastIndexOf"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.map": {
			library: "core-js",
			relativePaths: ["modules/es.array.map.js"],
			features: ["javascript.builtins.Array.map"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.of": {
			library: "core-js",
			relativePaths: ["modules/es.array.of.js"],
			features: ["javascript.builtins.Array.of"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.reduce-right": {
			library: "core-js",
			relativePaths: ["modules/es.array.reduce-right.js"],
			features: ["javascript.builtins.Array.reduceRight"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.reduce": {
			library: "core-js",
			relativePaths: ["modules/es.array.reduce.js"],
			features: ["javascript.builtins.Array.reduce"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.slice": {
			library: "core-js",
			relativePaths: ["modules/es.array.slice.js"],
			features: ["javascript.builtins.Array.slice"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.some": {
			library: "core-js",
			relativePaths: ["modules/es.array.some.js"],
			features: ["javascript.builtins.Array.some"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.sort": {
			library: "core-js",
			relativePaths: ["modules/es.array.sort.js"],
			features: ["javascript.builtins.Array.sort"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array.species": {
			library: "core-js",
			relativePaths: ["modules/es.array.species.js"],
			features: ["javascript.builtins.Array.@@species"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.species"],
			contexts: ALL_CONTEXTS
		},
		"es.array.splice": {
			library: "core-js",
			relativePaths: ["modules/es.array.splice.js"],
			features: ["javascript.builtins.Array.splice"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.array-buffer.is-view": {
			library: "core-js",
			relativePaths: ["modules/es.array-buffer.is-view.js"],
			features: ["javascript.builtins.ArrayBuffer.isView"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.array-buffer.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.array-buffer.slice": {
			library: "core-js",
			relativePaths: ["modules/es.array-buffer.slice.js"],
			features: ["javascript.builtins.ArrayBuffer.slice"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
				"es.string.trim-end"
			]
		},
		"es.string.at": {
			library: "core-js",
			relativePaths: ["modules/esnext.string.at.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.code-points": {
			library: "core-js",
			relativePaths: ["modules/esnext.string.code-points.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.match-all": {
			library: "core-js",
			relativePaths: ["modules/esnext.string.match-all.js"],
			features: ["javascript.builtins.String.matchAll"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.replace-all": {
			library: "core-js",
			relativePaths: ["modules/esnext.string.replace-all.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.trim-start": {
			library: "core-js",
			relativePaths: ["modules/es.string.trim-start.js"],
			features: ["javascript.builtins.String.trimStart"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.trim-end": {
			library: "core-js",
			relativePaths: ["modules/es.string.trim-end.js"],
			features: ["javascript.builtins.String.trimEnd"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.anchor": {
			library: "core-js",
			relativePaths: ["modules/es.string.anchor.js"],
			features: ["javascript.builtins.String.anchor"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.big": {
			library: "core-js",
			relativePaths: ["modules/es.string.big.js"],
			features: ["javascript.builtins.String.big"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.blink": {
			library: "core-js",
			relativePaths: ["modules/es.string.blink.js"],
			features: ["javascript.builtins.String.blink"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.bold": {
			library: "core-js",
			relativePaths: ["modules/es.string.bold.js"],
			features: ["javascript.builtins.String.bold"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.code-point-at": {
			library: "core-js",
			relativePaths: ["modules/es.string.code-point-at.js"],
			features: ["javascript.builtins.String.codePointAt"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.ends-with": {
			library: "core-js",
			relativePaths: ["modules/es.string.ends-with.js"],
			features: ["javascript.builtins.String.endsWith"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.fixed": {
			library: "core-js",
			relativePaths: ["modules/es.string.fixed.js"],
			features: ["javascript.builtins.String.fixed"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.fontcolor": {
			library: "core-js",
			relativePaths: ["modules/es.string.fontcolor.js"],
			features: ["javascript.builtins.String.fontcolor"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.fontsize": {
			library: "core-js",
			relativePaths: ["modules/es.string.fontsize.js"],
			features: ["javascript.builtins.String.fontsize"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.from-code-point": {
			library: "core-js",
			relativePaths: ["modules/es.string.from-code-point.js"],
			features: ["javascript.builtins.String.fromCodePoint"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.includes": {
			library: "core-js",
			relativePaths: ["modules/es.string.includes.js"],
			features: ["javascript.builtins.String.includes"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.italics": {
			library: "core-js",
			relativePaths: ["modules/es.string.italics.js"],
			features: ["javascript.builtins.String.italics"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.iterator": {
			library: "core-js",
			relativePaths: ["modules/es.string.iterator.js"],
			features: ["javascript.builtins.String.@@iterator"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.iterator"],
			contexts: ALL_CONTEXTS
		},
		"es.string.link": {
			library: "core-js",
			relativePaths: ["modules/es.string.link.js"],
			features: ["javascript.builtins.String.link"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.match": {
			library: "core-js",
			relativePaths: ["modules/es.string.match.js"],
			features: ["javascript.builtins.String.match"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.pad-end": {
			library: "core-js",
			relativePaths: ["modules/es.string.pad-end.js"],
			features: ["javascript.builtins.String.padEnd"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.pad-start": {
			library: "core-js",
			relativePaths: ["modules/es.string.pad-start.js"],
			features: ["javascript.builtins.String.padStart"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.raw": {
			library: "core-js",
			relativePaths: ["modules/es.string.raw.js"],
			features: ["javascript.builtins.String.raw"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.repeat": {
			library: "core-js",
			relativePaths: ["modules/es.string.repeat.js"],
			features: ["javascript.builtins.String.repeat"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.replace": {
			library: "core-js",
			relativePaths: ["modules/es.string.replace.js"],
			features: ["javascript.builtins.String.replace"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.search": {
			library: "core-js",
			relativePaths: ["modules/es.string.search.js"],
			features: ["javascript.builtins.String.search"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.small": {
			library: "core-js",
			relativePaths: ["modules/es.string.small.js"],
			features: ["javascript.builtins.String.small"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.split": {
			library: "core-js",
			relativePaths: ["modules/es.string.split.js"],
			features: ["javascript.builtins.String.split"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.starts-with": {
			library: "core-js",
			relativePaths: ["modules/es.string.starts-with.js"],
			features: ["javascript.builtins.String.startsWith"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.strike": {
			library: "core-js",
			relativePaths: ["modules/es.string.strike.js"],
			features: ["javascript.builtins.String.strike"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.sub": {
			library: "core-js",
			relativePaths: ["modules/es.string.sub.js"],
			features: ["javascript.builtins.String.sub"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.sup": {
			library: "core-js",
			relativePaths: ["modules/es.string.sup.js"],
			features: ["javascript.builtins.String.sup"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.string.trim": {
			library: "core-js",
			relativePaths: ["modules/es.string.trim.js"],
			features: ["javascript.builtins.String.trim"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.regexp.flags": {
			library: "core-js",
			relativePaths: ["modules/es.regexp.flags.js"],
			features: ["javascript.builtins.RegExp.flags"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.regexp.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.regexp.to-string": {
			library: "core-js",
			relativePaths: ["modules/es.regexp.to-string.js"],
			features: ["javascript.builtins.RegExp.toString"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.constructor": {
			library: "core-js",
			relativePaths: ["modules/es.number.constructor.js"],
			features: ["javascript.builtins.Number.prototype"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.epsilon": {
			library: "core-js",
			relativePaths: ["modules/es.number.epsilon.js"],
			features: ["javascript.builtins.Number.EPSILON"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.is-finite": {
			library: "core-js",
			relativePaths: ["modules/es.number.is-finite.js"],
			features: ["javascript.builtins.Number.isFinite"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.is-integer": {
			library: "core-js",
			relativePaths: ["modules/es.number.is-integer.js"],
			features: ["javascript.builtins.Number.isInteger"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.is-nan": {
			library: "core-js",
			relativePaths: ["modules/es.number.is-nan.js"],
			features: ["javascript.builtins.Number.isNaN"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.is-safe-integer": {
			library: "core-js",
			relativePaths: ["modules/es.number.is-safe-integer.js"],
			features: ["javascript.builtins.Number.isSafeInteger"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.max-safe-integer": {
			library: "core-js",
			relativePaths: ["modules/es.number.max-safe-integer.js"],
			features: ["javascript.builtins.Number.MAX_SAFE_INTEGER"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.min-safe-integer": {
			library: "core-js",
			relativePaths: ["modules/es.number.min-safe-integer.js"],
			features: ["javascript.builtins.Number.MIN_SAFE_INTEGER"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.parse-float": {
			library: "core-js",
			relativePaths: ["modules/es.number.parse-float.js"],
			features: ["javascript.builtins.Number.parseFloat"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.parse-int": {
			library: "core-js",
			relativePaths: ["modules/es.number.parse-int.js"],
			features: ["javascript.builtins.Number.parseInt"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.to-fixed": {
			library: "core-js",
			relativePaths: ["modules/es.number.to-fixed.js"],
			features: ["javascript.builtins.Number.toFixed"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.number.to-precision": {
			library: "core-js",
			relativePaths: ["modules/es.number.to-precision.js"],
			features: ["javascript.builtins.Number.toPrecision"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.deg-per-rad": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.deg-per-rad.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.degrees": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.degrees.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.fscale": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.fscale.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.iaddh": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.iaddh.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.imulh": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.imulh.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.isubh": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.isubh.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.rad-per-deg": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.rad-per-deg.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.radians": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.radians.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.scale": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.scale.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.signbit": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.signbit.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.umulh": {
			library: "core-js",
			relativePaths: ["modules/esnext.math.umulh.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.acosh": {
			library: "core-js",
			relativePaths: ["modules/es.math.acosh.js"],
			features: ["javascript.builtins.Math.acosh"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.asinh": {
			library: "core-js",
			relativePaths: ["modules/es.math.asinh.js"],
			features: ["javascript.builtins.Math.asinh"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.atanh": {
			library: "core-js",
			relativePaths: ["modules/es.math.atanh.js"],
			features: ["javascript.builtins.Math.atanh"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.cbrt": {
			library: "core-js",
			relativePaths: ["modules/es.math.cbrt.js"],
			features: ["javascript.builtins.Math.cbrt"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.clz32": {
			library: "core-js",
			relativePaths: ["modules/es.math.clz32.js"],
			features: ["javascript.builtins.Math.clz32"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.cosh": {
			library: "core-js",
			relativePaths: ["modules/es.math.cosh.js"],
			features: ["javascript.builtins.Math.cosh"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.expm1": {
			library: "core-js",
			relativePaths: ["modules/es.math.expm1.js"],
			features: ["javascript.builtins.Math.expm1"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.fround": {
			library: "core-js",
			relativePaths: ["modules/es.math.fround.js"],
			features: ["javascript.builtins.Math.fround"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.hypot": {
			library: "core-js",
			relativePaths: ["modules/es.math.hypot.js"],
			features: ["javascript.builtins.Math.hypot"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.imul": {
			library: "core-js",
			relativePaths: ["modules/es.math.imul.js"],
			features: ["javascript.builtins.Math.imul"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.log1p": {
			library: "core-js",
			relativePaths: ["modules/es.math.log1p.js"],
			features: ["javascript.builtins.Math.log1p"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.log2": {
			library: "core-js",
			relativePaths: ["modules/es.math.log2.js"],
			features: ["javascript.builtins.Math.log2"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.log10": {
			library: "core-js",
			relativePaths: ["modules/es.math.log10.js"],
			features: ["javascript.builtins.Math.log10"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.sign": {
			library: "core-js",
			relativePaths: ["modules/es.math.sign.js"],
			features: ["javascript.builtins.Math.sign"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.sinh": {
			library: "core-js",
			relativePaths: ["modules/es.math.sinh.js"],
			features: ["javascript.builtins.Math.sinh"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.tanh": {
			library: "core-js",
			relativePaths: ["modules/es.math.tanh.js"],
			features: ["javascript.builtins.Math.tanh"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.math.trunc": {
			library: "core-js",
			relativePaths: ["modules/es.math.trunc.js"],
			features: ["javascript.builtins.Math.trunc"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.data-view": {
			library: "core-js",
			relativePaths: ["modules/es.data-view.js"],
			features: ["javascript.builtins.DataView"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.date.to-iso-string": {
			library: "core-js",
			relativePaths: ["modules/es.date.to-iso-string.js"],
			features: ["javascript.builtins.Date.toISOString"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.date.to-json": {
			library: "core-js",
			relativePaths: ["modules/es.date.to-json.js"],
			features: ["javascript.builtins.Date.toJSON"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.date.to-primitive": {
			library: "core-js",
			relativePaths: ["modules/es.date.to-primitive.js"],
			features: ["javascript.builtins.Date.@@toPrimitive"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.to-primitive"],
			contexts: ALL_CONTEXTS
		},
		"es.date.to-string": {
			library: "core-js",
			relativePaths: ["modules/es.date.to-string.js"],
			features: ["javascript.builtins.Date.toString"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
				"es.symbol.replace",
				"es.symbol.search",
				"es.symbol.species",
				"es.symbol.split",
				"es.symbol.to-primitive",
				"es.symbol.to-string-tag",
				"es.symbol.unscopables"
			]
		},
		"es.symbol.description": {
			library: "core-js",
			relativePaths: ["modules/esnext.symbol.description.js"],
			features: ["javascript.builtins.Symbol.description"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.pattern-match": {
			library: "core-js",
			relativePaths: ["modules/esnext.symbol.pattern-match.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.constructor": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.js"],
			features: ["javascript.builtins.Symbol"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.async-iterator": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.async-iterator.js"],
			features: ["javascript.builtins.Symbol.asyncIterator"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.has-instance": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.has-instance.js", "modules/es.function.has-instance.js"],
			features: ["javascript.builtins.Symbol.hasInstance"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.is-concat-spreadable": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.is-concat-spreadable.js"],
			features: ["javascript.builtins.Symbol.isConcatSpreadable"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.iterator": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.iterator.js"],
			features: ["javascript.builtins.Symbol.iterator"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.match": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.match.js"],
			features: ["javascript.builtins.Symbol.match"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.replace": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.replace.js"],
			features: ["javascript.builtins.Symbol.replace"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.search": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.search.js"],
			features: ["javascript.builtins.Symbol.search"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.species": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.species.js"],
			features: ["javascript.builtins.Symbol.species"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.split": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.split.js"],
			features: ["javascript.builtins.Symbol.split"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.to-primitive": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.to-primitive.js"],
			features: ["javascript.builtins.Symbol.toPrimitive"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.to-string-tag": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.to-string-tag.js", "modules/es.json.to-string-tag.js", "modules/es.math.to-string-tag.js"],
			features: ["javascript.builtins.Symbol.toStringTag"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.constructor"],
			contexts: ALL_CONTEXTS
		},
		"es.symbol.unscopables": {
			library: "core-js",
			relativePaths: ["modules/es.symbol.unscopables.js"],
			features: ["javascript.builtins.Symbol.unscopables"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.map.every": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.every.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.filter": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.filter.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.find": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.find.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.find-key": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.find-key.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.from": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.group-by": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.group-by.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.includes": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.includes.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.key-by": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.key-by.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.key-of": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.key-of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.map-keys": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.map-keys.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.map-values": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.map-values.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.merge": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.merge.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.of": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.reduce": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.reduce.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.some": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.some.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.map.update": {
			library: "core-js",
			relativePaths: ["modules/esnext.map.update.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.map"],
			contexts: ALL_CONTEXTS
		},
		"es.weak-map": {
			library: "core-js",
			relativePaths: ["modules/es.weak-map.js"],
			features: ["javascript.builtins.WeakMap"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.weak-map.from": {
			library: "core-js",
			relativePaths: ["modules/esnext.weak-map.from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.weak-map"],
			contexts: ALL_CONTEXTS
		},
		"es.weak-map.of": {
			library: "core-js",
			relativePaths: ["modules/esnext.weak-map.of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.weak-map"],
			contexts: ALL_CONTEXTS
		},
		"es.set": {
			library: "core-js",
			relativePaths: ["modules/es.set.js"],
			features: ["javascript.builtins.Set", "javascript.builtins.Set.@@iterator"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.set.add-all": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.addTime-all.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.delete-all": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.delete-all.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.difference": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.difference.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.every": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.every.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.filter": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.filter.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.find": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.find.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.from": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.intersection": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.intersection.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.join": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.join.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.map": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.map.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.of": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.reduce": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.reduce.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.some": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.some.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.symmetric-difference": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.symmetric-difference.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.union": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.union.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.is-disjoint-from": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.is-disjoint-from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.is-subset-of": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.is-subset-of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.set.is-superset-of": {
			library: "core-js",
			relativePaths: ["modules/esnext.set.is-superset-of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.set"],
			contexts: ALL_CONTEXTS
		},
		"es.weak-set": {
			library: "core-js",
			relativePaths: ["modules/es.weak-set.js"],
			features: ["javascript.builtins.WeakSet"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.weak-set.from": {
			library: "core-js",
			relativePaths: ["modules/esnext.weak-set.from.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.weak-set"],
			contexts: ALL_CONTEXTS
		},
		"es.weak-set.of": {
			library: "core-js",
			relativePaths: ["modules/esnext.weak-set.of.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.every": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.every.js"],
			features: ["javascript.builtins.TypedArray.every"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.fill": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.fill.js"],
			features: ["javascript.builtins.TypedArray.fill"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.filter": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.filter.js"],
			features: ["javascript.builtins.TypedArray.filter"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.find": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.find.js"],
			features: ["javascript.builtins.TypedArray.find"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.find-index": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.find-index.js"],
			features: ["javascript.builtins.TypedArray.findIndex"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.float32-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.float32-array.js"],
			features: ["javascript.builtins.Float32Array"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.float64-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.float64-array.js"],
			features: ["javascript.builtins.Float64Array"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.for-each": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.for-each.js"],
			features: ["javascript.builtins.TypedArray.forEach"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.from": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.from.js"],
			features: ["javascript.builtins.TypedArray.from"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.includes": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.includes.js"],
			features: ["javascript.builtins.TypedArray.includes"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.index-of": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.index-of.js"],
			features: ["javascript.builtins.TypedArray.indexOf"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.int8-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.int8-array.js"],
			features: ["javascript.builtins.Int8Array"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.int16-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.int16-array.js"],
			features: ["javascript.builtins.Int16Array"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.int32-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.int32-array.js"],
			features: ["javascript.builtins.Int32Array"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.iterator": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.iterator.js"],
			features: ["javascript.builtins.TypedArray.@@iterator"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.iterator"],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.join": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.join.js"],
			features: ["javascript.builtins.TypedArray.join"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.last-index-of": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.last-index-of.js"],
			features: ["javascript.builtins.TypedArray.lastIndexOf"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.map": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.map.js"],
			features: ["javascript.builtins.TypedArray.map"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.of": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.of.js"],
			features: ["javascript.builtins.TypedArray.of"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.reduce": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.reduce.js"],
			features: ["javascript.builtins.TypedArray.reduce"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.reduce-right": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.reduce-right.js"],
			features: ["javascript.builtins.TypedArray.reduceRight"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.reverse": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.reverse.js"],
			features: ["javascript.builtins.TypedArray.reverse"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.set": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.set.js"],
			features: ["javascript.builtins.TypedArray.set"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.slice": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.slice.js"],
			features: ["javascript.builtins.TypedArray.slice"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.some": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.some.js"],
			features: ["javascript.builtins.TypedArray.some"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.sort": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.sort.js"],
			features: ["javascript.builtins.TypedArray.sort"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.subarray": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.subarray.js"],
			features: ["javascript.builtins.TypedArray.subarray"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.to-locale-string": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.to-locale-string.js"],
			features: ["javascript.builtins.TypedArray.toLocaleString"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.to-string": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.to-string.js"],
			features: ["javascript.builtins.TypedArray.toString"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.uint8-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.uint8-array.js"],
			features: ["javascript.builtins.Uint8Array"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.uint8-clamped-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.uint8-clamped-array.js"],
			features: ["javascript.builtins.Uint8ClampedArray"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.uint16-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.uint16-array.js"],
			features: ["javascript.builtins.Uint16Array"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.typed-array.uint32-array": {
			library: "core-js",
			relativePaths: ["modules/es.typed-array.uint32-array.js"],
			features: ["javascript.builtins.Uint32Array"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.delete-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.delete-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.get-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-metadata-keys": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.get-metadata-keys.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-own-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.get-own-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-own-metadata-keys": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.get-own-metadata-keys.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.has-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.has-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.has-own-metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.has-own-metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.metadata": {
			library: "core-js",
			relativePaths: ["modules/esnext.reflect.metadata.js"],
			// TODO: Update when MDN or Caniuse Compatibility is added
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.apply": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.apply.js"],
			features: ["javascript.builtins.Reflect.apply"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.construct": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.construct.js"],
			features: ["javascript.builtins.Reflect.construct"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.define-property": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.define-property.js"],
			features: ["javascript.builtins.Reflect.defineProperty"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.delete-property": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.delete-property.js"],
			features: ["javascript.builtins.Reflect.deleteProperty"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.get.js"],
			features: ["javascript.builtins.Reflect.get"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-own-property-descriptor": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.get-own-property-descriptor.js"],
			features: ["javascript.builtins.Reflect.getOwnPropertyDescriptor"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.get-prototype-of": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.get-prototype-of.js"],
			features: ["javascript.builtins.Reflect.getPrototypeOf"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.has": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.has.js"],
			features: ["javascript.builtins.Reflect.has"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.is-extensible": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.is-extensible.js"],
			features: ["javascript.builtins.Reflect.isExtensible"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.own-keys": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.own-keys.js"],
			features: ["javascript.builtins.Reflect.ownKeys"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.prevent-extensions": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.prevent-extensions.js"],
			features: ["javascript.builtins.Reflect.preventExtensions"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.set": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.set.js"],
			features: ["javascript.builtins.Reflect.set"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"es.reflect.set-prototype-of": {
			library: "core-js",
			relativePaths: ["modules/es.reflect.set-prototype-of.js"],
			features: ["javascript.builtins.Reflect.setPrototypeOf"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
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
				"es.map.update"
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
			polyfills: ["es.promise.all-settled", "es.promise.try"]
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
			polyfills: ["es.string.at", "es.string.code-points", "es.string.match-all", "es.string.replace-all"]
		},
		"esnext.symbol": {
			polyfills: ["es.symbol.description", "es.symbol.pattern-match"]
		},
		"dom.collections.iterable": {
			polyfills: ["dom.collections.iterator", "dom.collections.for-each"]
		},
		"dom.collections.iterator": {
			library: "core-js",
			relativePaths: ["modules/web.dom-collections.iterator.js"],
			features: ["api.NodeList.forEach"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.iterator"],
			contexts: WINDOW_CONTEXT
		},
		"dom.collections.for-each": {
			library: "core-js",
			relativePaths: ["modules/web.dom-collections.for-each.js"],
			features: ["api.NodeList.forEach"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es.symbol.iterator"],
			contexts: WINDOW_CONTEXT
		},

		"pointer-event": {
			library: "@wessberg/pointer-events",
			relativePaths: ["dist/index.js"],
			features: ["pointer"],
			version: environment.NPM_PACKAGE_DEPENDENCIES__WESSBERG_POINTER_EVENTS,
			dependencies: [
				// TODO: Also relies on "elementFromPoint" which there isn't a polyfill for yet. Add it to the dependencies when the polyfill is ready
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_XHR_POLYFILL,
			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		fetch: {
			localPaths: ["polyfill-lib/fetch/fetch.js"],
			features: ["fetch"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_WHATWG_FETCH,
			dependencies: ["es.array.for-each", "es.object.get-own-property-names", "es.promise", "xhr"],
			contexts: WINDOW_CONTEXT
		},
		intl: {
			polyfills: ["intl.core", "intl.list-format", "intl.relative-time-format"]
		},
		"intl.core": {
			localPaths: ["polyfill-lib/intl/intl.js"],
			meta: {
				localeDir: "node_modules/intl/locale-data/jsonp"
			},
			features: ["internationalization", "javascript.builtins.Intl.PluralRules", "javascript.builtins.Intl.NumberFormat"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_INTL,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"intl.relative-time-format": {
			library: "intl-relative-time-format",
			relativePaths: ["dist/index.js"],
			meta: {
				localeDir: "locale-data"
			},
			features: ["javascript.builtins.Intl.RelativeTimeFormat"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_INTL_RELATIVE_TIME_FORMAT,
			dependencies: ["intl.core", "es.array.includes", "es.object.create", "es.object.is", "es.string.includes", "es.string.replace", "es.symbol.to-string-tag", "es.weak-map"],
			contexts: ALL_CONTEXTS
		},
		"intl.list-format": {
			library: "intl-list-format",
			relativePaths: ["dist/index.js"],
			meta: {
				localeDir: "locale-data"
			},
			features: ["javascript.builtins.Intl.ListFormat"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_INTL_LIST_FORMAT,
			dependencies: ["intl.core", "es.array.includes", "es.object.create", "es.string.replace", "es.symbol.to-string-tag", "es.weak-map"],
			contexts: ALL_CONTEXTS
		},
		animation: {
			polyfills: ["web-animations"]
		},
		"web-animations": {
			library: "web-animations-js",
			relativePaths: ["web-animations.min.js"],
			features: ["web-animation"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_WEB_ANIMATIONS_JS,
			dependencies: ["element", "requestanimationframe"],
			contexts: WINDOW_CONTEXT
		},
		"regenerator-runtime": {
			library: "regenerator-runtime",
			relativePaths: ["runtime.js"],
			features: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_REGENERATOR_RUNTIME,
			dependencies: ["es.promise"],
			contexts: ALL_CONTEXTS
		},
		template: {
			library: "@webcomponents/template",
			relativePaths: ["template.js"],
			features: ["template"],
			version: environment.NPM_PACKAGE_DEPENDENCIES__WEBCOMPONENTS_TEMPLATE,
			dependencies: ["es"],
			contexts: WINDOW_CONTEXT
		},
		"web-components": {
			polyfills: ["custom-elements", "shadow-dom", "template"]
		},
		"custom-elements": {
			library: "@webcomponents/custom-elements",
			relativePaths: ["custom-elements.min.js"],
			features: ["custom-elementsv1"],
			version: environment.NPM_PACKAGE_DEPENDENCIES__WEBCOMPONENTS_CUSTOM_ELEMENTS,
			dependencies: ["es", "mutation-observer"],
			contexts: WINDOW_CONTEXT
		},
		"shadow-dom": {
			localPaths: [
				"node_modules/@webcomponents/shadydom/shadydom.min.js",
				"node_modules/@webcomponents/shadycss/scoping-shim.min.js",
				"node_modules/@webcomponents/shadycss/custom-style-interface.min.js"
			],
			features: ["shadowdomv1"],
			version: environment.NPM_PACKAGE_DEPENDENCIES__WEBCOMPONENTS_SHADYDOM,
			dependencies: ["es", "template", "mutation-observer", "event", "node.contains", "queryselector"],
			contexts: WINDOW_CONTEXT
		},
		queryselector: {
			library: "polyfill-service",
			relativePaths: ["polyfills/document.querySelector/polyfill.js"],
			features: ["queryselector"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["element", "document", "document-fragment"],
			contexts: WINDOW_CONTEXT
		},
		"document-fragment": {
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			library: "polyfill-service",
			relativePaths: ["polyfills/DocumentFragment/polyfill.js"],
			features: ["queryselector"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		"node.parentelement": {
			library: "node.parentelement",
			relativePaths: ["polyfill.min.js"],
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			features: ["addeventlistener"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_NODE_PARENTELEMENT,
			dependencies: ["document"],
			contexts: WINDOW_CONTEXT
		},
		"scroll-behavior": {
			library: "scroll-behavior-polyfill",
			relativePaths: ["dist/index.js"],
			features: ["css-scroll-behavior", "scrollintoview"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_SCROLL_BEHAVIOR_POLYFILL,
			dependencies: ["es.object.define-property", "es.object.get-own-property-descriptor", "requestanimationframe"],
			contexts: WINDOW_CONTEXT
		},
		"node.contains": {
			library: "polyfill-service",
			relativePaths: ["polyfills/Node/prototype/contains/polyfill.js"],
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			features: ["addeventlistener"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["element"],
			contexts: WINDOW_CONTEXT
		},
		window: {
			library: "polyfill-service",
			relativePaths: ["polyfills/Window/polyfill.js"],
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			features: ["addeventlistener"],
			version: "1.0.0",
			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		document: {
			library: "polyfill-service",
			relativePaths: ["polyfills/Document/polyfill.js"],
			// If 'addEventListener' isn't found, the Document interface shouldn't exist on the window
			features: ["addeventlistener"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		"class-list": {
			library: "polyfill-service",
			relativePaths: ["polyfills/Element/prototype/classList/polyfill.js"],
			features: ["classlist"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["dom-token-list"],
			contexts: WINDOW_CONTEXT
		},
		"dom-token-list": {
			library: "polyfill-service",
			relativePaths: ["polyfills/_DOMTokenList/polyfill.js", "polyfills/DOMTokenList/polyfill.js"],
			features: ["rellist"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["es.object.define-property"],
			contexts: WINDOW_CONTEXT
		},
		element: {
			library: "polyfill-service",
			relativePaths: ["polyfills/Element/polyfill.js"],
			// If 'addEventListener' isn't found, the Element interface shouldn't exist on the window
			features: ["addeventlistener"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["document"],
			contexts: WINDOW_CONTEXT
		},
		event: {
			polyfills: ["event.constructor", "event.focusin", "event.hashchange"]
		},
		"event.constructor": {
			library: "polyfill-service",
			relativePaths: ["polyfills/Event/polyfill.js"],
			features: ["api.Event.Event"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["window", "document", "element", "es.object.define-property"],
			contexts: WINDOW_CONTEXT
		},
		"event.focusin": {
			library: "polyfill-service",
			relativePaths: ["polyfills/Event/focusin/polyfill.js"],
			features: ["focusin-focusout-events"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["event.constructor"],
			contexts: WINDOW_CONTEXT
		},
		"event.hashchange": {
			library: "polyfill-service",
			relativePaths: ["polyfills/Event/hashchange/polyfill.js"],
			features: ["hashchange"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["event.constructor"],
			contexts: WINDOW_CONTEXT
		},
		"custom-event": {
			library: "polyfill-service",
			relativePaths: ["polyfills/CustomEvent/polyfill.js"],
			features: ["customevent"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["event"],
			contexts: WINDOW_CONTEXT
		},
		"event-source": {
			library: "polyfill-service",
			relativePaths: ["polyfills/EventSource/polyfill.js"],
			features: ["eventsource"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: [],
			contexts: WINDOW_CONTEXT
		},
		"get-computed-style": {
			library: "polyfill-service",
			relativePaths: ["polyfills/getComputedStyle/polyfill.js"],
			features: ["getcomputedstyle"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["window"],
			contexts: WINDOW_CONTEXT
		},
		"intersection-observer": {
			library: "intersection-observer",
			relativePaths: ["intersection-observer.js"],
			features: ["intersectionobserver"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_INTERSECTION_OBSERVER,
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
			version: environment.NPM_PACKAGE_DEPENDENCIES_MUTATIONOBSERVER_SHIM,
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
		setimmediate: {
			polyfills: ["set-immediate"]
		},
		"set-immediate": {
			library: "setimmediate",
			relativePaths: ["setImmediate.js"],
			features: ["setimmediate"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_SETIMMEDIATE,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		globalthis: {
			polyfills: ["global-this"]
		},
		"global-this": {
			library: "core-js",
			relativePaths: ["modules/esnext.global-this.js"],
			features: ["javascript.builtins.globals.globalThis"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: [],
			contexts: ALL_CONTEXTS
		},
		"adopted-style-sheets": {
			polyfills: ["constructable-style-sheets"]
		},
		"constructable-style-sheets": {
			library: "construct-style-sheets-polyfill",
			relativePaths: ["adoptedStyleSheets.min.js"],
			features: ["api.DocumentOrShadowRoot.adoptedStyleSheets"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CONSTRUCT_STYLE_SHEETS_POLYFILL,
			dependencies: ["shadow-dom"],
			contexts: ALL_CONTEXTS
		}
	}
};
