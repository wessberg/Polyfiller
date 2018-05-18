import {PolyfillName} from "./polyfill-name";

export interface IPolyfillDictEntryBase {
	caniuseFeatures: string[];
	meta?: {[key: string]: string};
	version: string;
	dependencies: PolyfillName[];
}

export interface IPolyfillLibraryDictEntry extends IPolyfillDictEntryBase {
	library: string;
	relativePaths: string[];
}

export interface IPolyfillBuildDictEntry extends IPolyfillDictEntryBase {
	caniuseFeatures: string[];
	coreJsModules: string[];
}

export interface IPolyfillCustomDictEntry extends IPolyfillDictEntryBase {
	content: string;
}

export declare type PolyfillDictEntry = IPolyfillLibraryDictEntry|IPolyfillBuildDictEntry|IPolyfillCustomDictEntry;

export declare type PolyfillDict = {
	[Key in PolyfillName]: PolyfillDictEntry;
};