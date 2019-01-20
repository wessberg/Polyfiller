import {PolyfillDealiasedName} from "./polyfill-name";

// tslint:disable:no-any

export interface IPolyfillFeatureMeta {
	[key: string]: any;
}

export interface IPolyfillFeature {
	name: PolyfillDealiasedName;
	meta: IPolyfillFeatureMeta;
}

export interface IPolyfillFeatureInput extends IPolyfillFeature {
	force: boolean;
}
