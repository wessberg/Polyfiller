import type {PolyfillDealiasedName} from "./polyfill-name.js";

export interface PolyfillFeatureMeta {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface PolyfillFeature {
	name: PolyfillDealiasedName;
	meta: PolyfillFeatureMeta;
}

export interface PolyfillFeatureInput extends PolyfillFeature {
	force: boolean;
}
