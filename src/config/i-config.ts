import {environment} from "../environment/environment";

export declare type IConfig = typeof environment & {
	production: boolean;
	development: boolean;
	staging: boolean;
	testing: boolean;
	debug: boolean;
	verbose: boolean;
	clearCache: boolean;
	https: boolean;
	port: number;
	host: string;
	key: Buffer | undefined;
	cert: Buffer | undefined;
};
