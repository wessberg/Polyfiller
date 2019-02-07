import {PolyfillDealiasedName, PolyfillName} from "./polyfill-name";
import {PolyfillContext} from "./polyfill-context";

export interface IPolyfillDictAlias {
	polyfills: PolyfillName[];
}

export interface IPolyfillDictEntryBase {
	features: string[];
	meta?: {[key: string]: string};
	version: string;
	contexts: Set<PolyfillContext>;
	dependencies: PolyfillName[];
	mustComeAfter?: PolyfillName[] | "*";
	flatten?: boolean;
}

export interface IPolyfillLibraryDictEntry extends IPolyfillDictEntryBase {
	library: string | Record<PolyfillContext, string>;
	relativePaths: string[] | Record<PolyfillContext, string[]>;
}

export interface IPolyfillLocalDictEntry extends IPolyfillDictEntryBase {
	localPaths: string[] | Record<PolyfillContext, string[]>;
}

export declare type PolyfillDictNormalizedEntry = IPolyfillLibraryDictEntry | IPolyfillLocalDictEntry;
export declare type PolyfillDictEntry = IPolyfillDictAlias | PolyfillDictNormalizedEntry;

export declare type PolyfillDict = {[Key in PolyfillName]: Key extends PolyfillDealiasedName ? IPolyfillLibraryDictEntry | IPolyfillLocalDictEntry : PolyfillDictEntry};
