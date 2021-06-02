import {PolyfillName} from "./polyfill-name";

const base = {
	force: false
};

export const POLYFILL_META = {
	"web-components": {
		...base,
		experimental: false
	},
	systemjs: {
		...base,
		variant: "system" as "system" | "s"
	},
	intl: {
		...base,
		locale: [] as string[]
	},
	zone: {
		error: false,
		shadydom: false,
		mediaquery: false,
		rxjs: false,
		fetch: false,
		resizeobserver: false
	}
};

export type PolyfillMeta = typeof POLYFILL_META;
export type PolyfillMetaKey = keyof PolyfillMeta;

// This type is used to add type assertions about the keys of 'polyfillMeta' while
// still leveraging the inference engine of TypeScript
export type AssertsValidMetaKeys<T extends keyof {[Key in PolyfillName]?: unknown} = keyof PolyfillMeta> = T;
