import {PolyfillDealiasedName} from "./polyfill-name";

export interface IPolyfillFeatureMeta {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface IPolyfillFeature {
	name: PolyfillDealiasedName;
	meta: IPolyfillFeatureMeta;
}

export interface IPolyfillFeatureInput extends IPolyfillFeature {
	force: boolean;
}
