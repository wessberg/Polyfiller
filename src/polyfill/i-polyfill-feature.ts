import {PolyfillDealiasedName} from "./polyfill-name";
import {PolyfillContext} from "./polyfill-context";

// tslint:disable:no-any

export interface IPolyfillFeatureMeta {
	[key: string]: any;
}

export interface IPolyfillFeature {
	name: PolyfillDealiasedName;
	meta: IPolyfillFeatureMeta;
	context: PolyfillContext;
}

export interface IPolyfillFeatureInput extends IPolyfillFeature {
	force: boolean;
}
