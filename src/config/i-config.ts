import {environment} from "../environment/environment";

export declare type IConfig = typeof environment & {
	production: boolean;
	development: boolean;
	staging: boolean;
	testing: boolean;
	debug: boolean;
	verbose: boolean;
	clearCache: boolean;
	http2: boolean;
	https: boolean;
	port: number;
	host: string;
	email: string | undefined;
	key: Buffer | undefined;
	cert: Buffer | undefined;
};
