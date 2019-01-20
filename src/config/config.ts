import {environment} from "../environment/environment";
import {IConfig} from "./i-config";
import {readFileSync} from "fs";
import {booleanize} from "../util/booleanize/booleanize";
import {Buffer} from "buffer";

export const config: IConfig = {
	...environment,
	development: environment.NODE_ENV == null || environment.NODE_ENV === "" || environment.NODE_ENV.toLowerCase() === "development",
	staging: environment.NODE_ENV != null && environment.NODE_ENV.toLowerCase() === "staging",
	production: environment.NODE_ENV != null && environment.NODE_ENV.toLowerCase() === "production",
	testing: booleanize(environment.TESTING),
	debug: booleanize(environment.DEBUG),
	verbose: booleanize(environment.VERBOSE),
	clearCache: booleanize(environment.CLEAR_CACHE),
	http2: booleanize(environment.HTTP2),
	host: environment.HOST,
	port: parseInt(environment.PORT),
	email: environment.EMAIL != null && environment.EMAIL !== "" ? environment.EMAIL : undefined,
	key:
		environment.KEY == null || environment.KEY === ""
			? undefined
			: environment.KEY.trim().startsWith("-----BEGIN RSA PRIVATE KEY-----")
			? Buffer.from(environment.KEY.replace(/\\n/g, "\n"))
			: readFileSync(environment.KEY),
	cert:
		environment.CERT == null || environment.CERT === ""
			? undefined
			: environment.CERT.trim().startsWith("-----BEGIN CERTIFICATE-----")
			? Buffer.from(environment.CERT.replace(/\\n/g, "\n"))
			: readFileSync(environment.CERT)
};
