import {PolyfillDealiasedName, PolyfillName} from "./polyfill-name";

export interface IPolyfillDictAlias {
	polyfills: PolyfillName[];
}

export interface IPolyfillDictEntryBase {
	features: string[];
	meta?: {[key: string]: string};
	version: string;
	dependencies: PolyfillName[];
	mustComeAfter?: PolyfillName[] | "*";
	flatten?: boolean;
}

export interface IPolyfillLibraryDictEntry extends IPolyfillDictEntryBase {
	library: string;
	relativePaths: string[];
}

export interface IPolyfillLocalDictEntry extends IPolyfillDictEntryBase {
	localPaths: string[];
}

export declare type PolyfillDictNormalizedEntry = IPolyfillLibraryDictEntry | IPolyfillLocalDictEntry;
export declare type PolyfillDictEntry = IPolyfillDictAlias | PolyfillDictNormalizedEntry;

export declare type PolyfillDict = {[Key in PolyfillName]: Key extends PolyfillDealiasedName ? IPolyfillLibraryDictEntry | IPolyfillLocalDictEntry : PolyfillDictEntry};
