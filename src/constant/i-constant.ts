import {PolyfillDict} from "../polyfill/polyfill-dict";
import {ApiPath, ApiPaths} from "../api/server/i-server";

export interface IEndpointConstant {
	index: ApiPaths;
	polyfill: ApiPath;
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
	endpoint: IEndpointConstant;
	meta: IMetaConstant;
	polyfill: PolyfillDict;
	path: IPathConstant;
	header: IHeaderConstant;
}
