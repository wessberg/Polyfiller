import {Path} from "../server/path";
import {PolyfillDict} from "../polyfill/polyfill-dict";

export interface IEndpointConstant {
	index: Path[]|Path;
	polyfill: Path;
}

export interface IMetaConstant {
	name: string;
	version: string;
	github: string;
}

export interface IPathConstant {
	cacheRoot: string;
	cachePackageVersionMap: string;
}

export interface IConstant {
	endpoint: IEndpointConstant;
	meta: IMetaConstant;
	polyfill: PolyfillDict;
	path: IPathConstant;
}