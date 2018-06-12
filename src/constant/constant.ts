import {IConstant} from "./i-constant";
import {environment} from "../environment/environment";
import {DOM_ITERABLE_CANIUSE_FEATURE_NAMES, ES2015_CANIUSE_FEATURE_NAMES, ES2016_PLUS_CANIUSE_FEATURE_NAMES} from "../util/caniuse-util";
// @ts-ignore
import * as tempDir from "temp-dir";
import {join} from "path";
import {OBJECT_FIT_HOOK} from "../polyfill/lib/object-fit/object-fit-hook";

export const constant: IConstant = {
	endpoint: {
		index: ["/api", "/api/"],
		polyfill: "/api/polyfill"
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
			relativePaths: ["dist/system-production.js"],
			caniuseFeatures: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_SYSTEMJS,
			dependencies: []
		},
		zone: {
			library: "zone.js",
			relativePaths: ["dist/zone.min.js"],
			caniuseFeatures: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_ZONE_JS,
			dependencies: ["performance.now", "requestanimationframe", "mutation-observer", "es2015.promise", "xhr"]
		},
		"performance.now": {
			library: "perfnow",
			relativePaths: ["perfnow.min.js"],
			caniuseFeatures: ["high-resolution-time"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_PERFNOW,
			dependencies: ["es2015.date.now"]
		},
		url: {
			library: "url-polyfill",
			relativePaths: ["url-polyfill.min.js"],
			caniuseFeatures: ["url", "urlsearchparams"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_URL_POLYFILL,
			dependencies: ["es2015.object.define-properties", "es2015.array.for-each"]
		},
		"object-fit": {
			library: "object-fit-images",
			relativePaths: ["dist/ofi.min.js"],
			extraContent: OBJECT_FIT_HOOK,
			caniuseFeatures: ["object-fit"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_OBJECT_FIT_IMAGES,
			dependencies: ["get-computed-style", "es2015.object.define-property"]
		},
		console: {
			library: "console-polyfill",
			relativePaths: ["index.js"],
			caniuseFeatures: ["console-basic", "console-time"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CONSOLE_POLYFILL,
			dependencies: []
		},
		base64: {
			library: "Base64",
			relativePaths: ["base64.js"],
			caniuseFeatures: ["atob-btoa"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_BASE64,
			dependencies: []
		},
		blob: {
			library: "blob-polyfill",
			relativePaths: ["Blob.js"],
			caniuseFeatures: ["blobbuilder", "bloburls"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_BLOB_POLYFILL,
			dependencies: ["base64", "url"]
		},
		requestanimationframe: {
			library: "requestanimationframe",
			relativePaths: ["app/requestAnimationFrame.js"],
			caniuseFeatures: ["requestanimationframe"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_REQUESTANIMATIONFRAME,
			dependencies: ["es2015.date.now", "performance.now"]
		},
		proxy: {
			library: "proxy-polyfill",
			relativePaths: ["proxy.min.js"],
			caniuseFeatures: ["proxy"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_PROXY_POLYFILL,
			dependencies: ["es2015"]
		},
		es2015: {
			coreJsModules: ["es6"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.promise": {
			coreJsModules: ["es6.promise"],
			caniuseFeatures: ["promises"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object": {
			coreJsModules: ["es6.object"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.assign": {
			coreJsModules: ["es6.object.assign"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.create": {
			coreJsModules: ["es6.object.assign"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.define-properties": {
			coreJsModules: ["es6.object.define-properties"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.define-property": {
			coreJsModules: ["es6.object.define-property"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.freeze": {
			coreJsModules: ["es6.object.freeze"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.get-own-property-descriptor": {
			coreJsModules: ["es6.object.get-own-property-descriptor"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.get-own-property-names": {
			coreJsModules: ["es6.object.get-own-property-names"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.get-prototype-of": {
			coreJsModules: ["es6.object.get-prototype-of"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.is-extensible": {
			coreJsModules: ["es6.object.is-extensible"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.is-frozen": {
			coreJsModules: ["es6.object.is-frozen"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.is-sealed": {
			coreJsModules: ["es6.object.is-sealed"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.is": {
			coreJsModules: ["es6.object.is"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.keys": {
			coreJsModules: ["es6.object.keys"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.prevent-extensions": {
			coreJsModules: ["es6.object.prevent-extensions"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.seal": {
			coreJsModules: ["es6.object.seal"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.set-prototype-of": {
			coreJsModules: ["es6.object.set-prototype-of"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.object.to-string": {
			coreJsModules: ["es6.object.to-string"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.function": {
			coreJsModules: ["es6.function"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array": {
			coreJsModules: ["es6.array"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.copy-within": {
			coreJsModules: ["es6.array.copy-within"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.every": {
			coreJsModules: ["es6.array.every"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.fill": {
			coreJsModules: ["es6.array.fill"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.filter": {
			coreJsModules: ["es6.array.filter"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.find-index": {
			coreJsModules: ["es6.array.find-index"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.find": {
			coreJsModules: ["es6.array.find"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.for-each": {
			coreJsModules: ["es6.array.for-each"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.from": {
			coreJsModules: ["es6.array.from"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.index-of": {
			coreJsModules: ["es6.array.index-of"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.is-array": {
			coreJsModules: ["es6.array.is-array"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.iterator": {
			coreJsModules: ["es6.array.iterator"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.join": {
			coreJsModules: ["es6.array.join"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.last-index-of": {
			coreJsModules: ["es6.array.last-index-of"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.map": {
			coreJsModules: ["es6.array.map"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.of": {
			coreJsModules: ["es6.array.of"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.reduce-right": {
			coreJsModules: ["es6.array.reduce-right"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.reduce": {
			coreJsModules: ["es6.array.reduce"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.slice": {
			coreJsModules: ["es6.array.slice"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.some": {
			coreJsModules: ["es6.array.some"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.sort": {
			coreJsModules: ["es6.array.sort"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.array.species": {
			coreJsModules: ["es6.array.species"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.string": {
			coreJsModules: ["es6.string"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.regexp": {
			coreJsModules: ["es6.regexp"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.number": {
			coreJsModules: ["es6.number"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.math": {
			coreJsModules: ["es6.math"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.date": {
			coreJsModules: ["es6.date"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.date.now": {
			coreJsModules: ["es6.date.now"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.date.to-iso-string": {
			coreJsModules: ["es6.date.to-iso-string"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.date.to-json": {
			coreJsModules: ["es6.date.to-json"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.date.to-primitive": {
			coreJsModules: ["es6.date.to-primitive"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.date.to-string": {
			coreJsModules: ["es6.date.to-string"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.symbol": {
			coreJsModules: ["es6.symbol"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.collections": {
			coreJsModules: ["es6.map", "es6.set", "es6.weak-map", "es6.weak-set"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.typedarrays": {
			coreJsModules: ["es6.typed"],
			caniuseFeatures: ["typedarrays"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2015.reflect": {
			coreJsModules: ["es6.reflect"],
			caniuseFeatures: ES2015_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: []
		},
		"es2016+": {
			coreJsModules: ["es7"],
			caniuseFeatures: ES2016_PLUS_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015"]
		},
		"es2016+.array": {
			coreJsModules: ["es7.array"],
			caniuseFeatures: ES2016_PLUS_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.array"]
		},
		"es2016+.array.includes": {
			coreJsModules: ["es7.array.includes"],
			caniuseFeatures: ES2016_PLUS_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.array"]
		},
		"es2016+.collections": {
			coreJsModules: ["es7.map", "es7.weak-map", "es7.set", "es7.weak-set"],
			caniuseFeatures: ES2016_PLUS_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.collections"]
		},
		"es2016+.math": {
			coreJsModules: ["es7.math"],
			caniuseFeatures: ES2016_PLUS_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.math"]
		},
		"es2016+.object": {
			coreJsModules: ["es7.object"],
			caniuseFeatures: ["object-values"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.object"]
		},
		"es2016+.object.define-getter": {
			coreJsModules: ["es7.object.define-getter"],
			caniuseFeatures: ["object-values"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.object"]
		},
		"es2016+.object.define-setter": {
			coreJsModules: ["es7.object.define-setter"],
			caniuseFeatures: ["object-values"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.object"]
		},
		"es2016+.object.entries": {
			coreJsModules: ["es7.object.entries"],
			caniuseFeatures: ["object-values"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.object"]
		},
		"es2016+.object.get-own-property-descriptors": {
			coreJsModules: ["es7.object.get-own-property-descriptors"],
			caniuseFeatures: ["object-values"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.object"]
		},
		"es2016+.object.lookup-getter": {
			coreJsModules: ["es7.object.lookup-getter"],
			caniuseFeatures: ["object-values"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.object"]
		},
		"es2016+.object.lookup-setter": {
			coreJsModules: ["es7.object.lookup-setter"],
			caniuseFeatures: ["object-values"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.object"]
		},
		"es2016+.object.values": {
			coreJsModules: ["es7.object.values"],
			caniuseFeatures: ["object-values"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.object"]
		},
		"es2016+.promise": {
			coreJsModules: ["es7.promise"],
			caniuseFeatures: ES2016_PLUS_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.promise"]
		},
		"es2016+.reflect": {
			coreJsModules: ["es7.reflect"],
			caniuseFeatures: ES2016_PLUS_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.reflect"]
		},
		"es2016+.string": {
			coreJsModules: ["es7.string"],
			caniuseFeatures: ES2016_PLUS_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.string"]
		},
		"es2016+.symbol": {
			coreJsModules: ["es7.symbol"],
			caniuseFeatures: ES2016_PLUS_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015.symbol"]
		},
		"dom.iterable": {
			coreJsModules: ["web.dom.iterable"],
			caniuseFeatures: DOM_ITERABLE_CANIUSE_FEATURE_NAMES,
			version: environment.NPM_PACKAGE_DEPENDENCIES_CORE_JS,
			dependencies: ["es2015"]
		},
		"pointer-event": {
			library: "pepjs",
			relativePaths: ["dist/pep.min.js"],
			caniuseFeatures: ["pointer"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_PEPJS,
			dependencies: ["event"]
		},
		xhr: {
			library: "xhr-polyfill",
			relativePaths: ["dist/xhr-polyfill.js"],
			caniuseFeatures: ["xhr2"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_XHR_POLYFILL,
			dependencies: ["event"]
		},
		fetch: {
			library: "whatwg-fetch",
			relativePaths: ["fetch.js"],
			caniuseFeatures: ["fetch"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_WHATWG_FETCH,
			dependencies: ["es2015.array.for-each", "es2015.object.get-own-property-names", "es2015.promise", "xhr"]
		},
		intl: {
			library: "intl",
			relativePaths: ["dist/Intl.min.js"],
			meta: {
				localeDir: "locale-data/jsonp"
			},
			caniuseFeatures: ["internationalization"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_INTL,
			dependencies: []
		},
		animation: {
			library: "web-animations-js",
			relativePaths: ["web-animations.min.js"],
			caniuseFeatures: ["web-animation"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_WEB_ANIMATIONS_JS,
			dependencies: ["element", "requestanimationframe"]
		},
		"regenerator-runtime": {
			library: "regenerator-runtime",
			relativePaths: ["runtime.js"],
			caniuseFeatures: [],
			version: environment.NPM_PACKAGE_DEPENDENCIES_REGENERATOR_RUNTIME,
			dependencies: ["es2015.promise"]
		},
		template: {
			library: "@webcomponents/template",
			relativePaths: ["template.js"],
			caniuseFeatures: ["template"],
			version: environment.NPM_PACKAGE_DEPENDENCIES__WEBCOMPONENTS_TEMPLATE,
			dependencies: ["es2015"]
		},
		"custom-elements": {
			library: "@webcomponents/custom-elements",
			relativePaths: ["custom-elements.min.js"],
			caniuseFeatures: ["custom-elementsv1"],
			version: environment.NPM_PACKAGE_DEPENDENCIES__WEBCOMPONENTS_CUSTOM_ELEMENTS,
			dependencies: ["es2015"]
		},
		"shadow-dom": {
			library: "@webcomponents/shadydom",
			relativePaths: ["shadydom.min.js"],
			caniuseFeatures: ["shadowdomv1"],
			version: environment.NPM_PACKAGE_DEPENDENCIES__WEBCOMPONENTS_SHADYDOM,
			dependencies: ["es2015", "mutation-observer", "event", "node.contains", "queryselector"]
		},
		queryselector: {
			library: "polyfill-service",
			relativePaths: ["polyfills/document.querySelector/polyfill.js"],
			caniuseFeatures: ["queryselector"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["element", "document", "document-fragment"]
		},
		"document-fragment": {
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			library: "polyfill-service",
			relativePaths: ["polyfills/DocumentFragment/polyfill.js"],
			caniuseFeatures: ["queryselector"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: []
		},
		"node.parentelement": {
			library: "node.parentelement",
			relativePaths: ["polyfill.min.js"],
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			caniuseFeatures: ["addeventlistener"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_NODE_PARENTELEMENT,
			dependencies: ["document"]
		},
		"node.contains": {
			library: "polyfill-service",
			relativePaths: ["polyfills/Node/prototype/contains/polyfill.js"],
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			caniuseFeatures: ["addeventlistener"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["element"]
		},
		window: {
			library: "polyfill-service",
			relativePaths: ["polyfills/Window/polyfill.js"],
			// If 'addEventListener' isn't found, the Window interface shouldn't exist on the window
			caniuseFeatures: ["addeventlistener"],
			version: "1.0.0",
			dependencies: []
		},
		document: {
			library: "polyfill-service",
			relativePaths: ["polyfills/Document/polyfill.js"],
			// If 'addEventListener' isn't found, the Document interface shouldn't exist on the window
			caniuseFeatures: ["addeventlistener"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: []
		},
		"class-list": {
			library: "polyfill-service",
			relativePaths: ["polyfills/Element/prototype/classList/polyfill.js"],
			caniuseFeatures: ["classlist"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["dom-token-list"]
		},
		"dom-token-list": {
			library: "polyfill-service",
			relativePaths: ["polyfills/DOMTokenList/polyfill.js"],
			caniuseFeatures: ["rellist"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: []
		},
		element: {
			library: "polyfill-service",
			relativePaths: ["polyfills/Element/polyfill.js"],
			// If 'addEventListener' isn't found, the Document interface shouldn't exist on the window
			caniuseFeatures: ["addeventlistener"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["document"]
		},
		event: {
			library: "events-polyfill",
			relativePaths: ["event-constructor-polyfill.min.js", "event-listener-polyfill.min.js"],
			caniuseFeatures: ["customevent", "dispatchevent", "passive-event-listener", "once-event-listener"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_EVENTS_POLYFILL,
			dependencies: ["window", "document", "element", "es2015"]
		},
		"get-computed-style": {
			library: "polyfill-service",
			relativePaths: ["polyfills/getComputedStyle/polyfill.js"],
			caniuseFeatures: ["getcomputedstyle"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_POLYFILL_SERVICE,
			dependencies: ["window"]
		},
		"intersection-observer": {
			library: "intersection-observer",
			relativePaths: ["intersection-observer.js"],
			caniuseFeatures: ["intersectionobserver"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_INTERSECTION_OBSERVER,
			dependencies: ["get-computed-style", "es2015.array.is-array", "es2015.array.filter", "es2015.array.for-each", "es2015.array.index-of", "es2015.array.map", "es2015.array.some", "event", "es2015.function", "performance.now"]
		},
		"mutation-observer": {
			library: "mutationobserver-shim",
			relativePaths: ["dist/mutationobserver.min.js"],
			caniuseFeatures: ["mutationobserver"],
			version: environment.NPM_PACKAGE_DEPENDENCIES_MUTATIONOBSERVER_SHIM,
			dependencies: []
		}
	}
};