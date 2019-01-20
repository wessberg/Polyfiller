export interface IRepository {
	type: string;
	url: string;
}

export interface IBugs {
	url: string;
}

export interface IAuthor {
	name: string;
	email: string;
	url: string;
}

export interface IPackageJson {
	name: string;
	version: string;
	description: string;
	scripts?: {[key: string]: string};
	keywords?: string[];
	devDependencies?: {[key: string]: string};
	peerDependencies?: {[key: string]: string};
	dependencies?: {[key: string]: string};
	module?: string;
	main?: string;
	"jsnext:main"?: string;
	browser?: string;
	types?: string;
	typings?: string;
	es2015?: string;
	repository?: IRepository;
	bugs?: IBugs;
	author?: IAuthor;
	authors?: IAuthor[];
	engines?: {[key: string]: string};
	license?: string;
	private?: boolean;
}
