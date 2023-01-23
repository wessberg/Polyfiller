import {environment} from "../environment/environment.js";
import {readFileSync} from "fs";
import {Buffer} from "buffer";
import {booleanize} from "../api/util.js";
import type {LogLevel} from "../service/logger/i-logger-service.js";
import {generateReleaseName, parseLogLevel} from "../api/util/util.js";
import pkg from "../../package.json" assert {type: "json"};

export interface Config {
	volumes: string[];
	version: string;
	sentryDsn: string | undefined;
	environment: string;
	production: boolean;
	logLevel: LogLevel;
	testing: boolean;
	clearCache: boolean;
	https: boolean;
	port: number;
	host: string;
	key: Buffer | undefined;
	cert: Buffer | undefined;
}

export const config: Config = {
	version: generateReleaseName(pkg),
	sentryDsn: environment.SENTRY_DSN,
	environment: environment.NODE_ENV,
	production: environment.NODE_ENV != null && environment.NODE_ENV.toLowerCase() === "production",
	testing: booleanize(environment.TESTING),
	volumes: environment.VOLUMES.split(" ")
		.map(part => part.trim())
		.filter(part => part.length > 0),
	logLevel: parseLogLevel(environment.LOG_LEVEL) ?? "info",
	clearCache: booleanize(environment.CLEAR_CACHE),
	https: booleanize(environment.HTTPS),
	host: environment.HOST,
	port: parseInt(environment.PORT),
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
