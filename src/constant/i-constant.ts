import type {PolyfillDict} from "../polyfill/polyfill-dict.js";

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
	cacheRoots: string[];
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
