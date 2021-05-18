import {PolyfillDealiasedName, PolyfillName} from "./polyfill-name";
import {PolyfillContext} from "./polyfill-context";
import pkg from "../../package.json";

export type PkgDependency = keyof typeof pkg.dependencies;

export interface IPolyfillDictAlias {
	polyfills: PolyfillName[];
}

export interface IPolyfillDictEntryBase {
	features: string[];
	meta?: Record<string, string[] | string | Record<PolyfillContext, string[]>>;
	contexts: Set<PolyfillContext>;
	dependencies: PolyfillName[];
	mustComeAfter?: PolyfillName[] | "*";
	flatten?: boolean;
}

export interface IPolyfillLibraryDictEntry extends IPolyfillDictEntryBase {
	library: PkgDependency | Record<PolyfillContext, PkgDependency>;
	relativePaths: string[] | Record<PolyfillContext, string[]>;
	version?: string;
}

export interface IPolyfillLocalDictEntry extends IPolyfillDictEntryBase {
	localPaths: string[] | Record<PolyfillContext, string[]>;
	version: string;
}

export declare type PolyfillDictNormalizedEntry = IPolyfillLibraryDictEntry | IPolyfillLocalDictEntry;
export declare type PolyfillDictEntry = IPolyfillDictAlias | PolyfillDictNormalizedEntry;

export declare type PolyfillDict = {
	[Key in PolyfillName]: Key extends PolyfillDealiasedName ? IPolyfillLibraryDictEntry | IPolyfillLocalDictEntry : PolyfillDictEntry;
};
