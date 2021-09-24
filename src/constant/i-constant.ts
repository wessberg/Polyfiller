import {PolyfillDict} from "../polyfill/polyfill-dict";

export interface IEndpointConstant {
	index: string;
	polyfill: string;
}

export interface IMetaConstant {
	name: string;
	version: string;
	github: string;
}

export interface IPathConstant {
	cacheRoot: string;
	cachePackageVersionMap: string;
	configChecksum: string;
}

export interface IHeaderConstant {
	polyfills: string;
	cache: {
		immutable: string;
	};
	maxChars: number;
}

export interface IConstant {
	cacheVersion: number;
	endpoint: IEndpointConstant;
	meta: IMetaConstant;
	polyfill: PolyfillDict;
	path: IPathConstant;
	header: IHeaderConstant;
}
