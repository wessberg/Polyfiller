import {PolyfillName} from "./polyfill-name";

// tslint:disable:no-any

export interface IPolyfillFeatureMeta {
	[key: string]: any;
}

export interface IPolyfillFeatureInput extends IPolyfillFeature {
	force: boolean;
}

export interface IPolyfillFeature {
	name: PolyfillName;
	meta: IPolyfillFeatureMeta;
}