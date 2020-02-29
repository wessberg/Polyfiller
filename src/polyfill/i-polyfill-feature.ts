import {PolyfillDealiasedName} from "./polyfill-name";
import {PolyfillContext} from "./polyfill-context";

export interface IPolyfillFeatureMeta {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
