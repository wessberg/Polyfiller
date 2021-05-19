import {environment} from "../environment/environment";
import {readFileSync} from "fs";
import {Buffer} from "buffer";
import {booleanize} from "../api/util";
import {LogLevel} from "../service/logger/i-logger-service";
import {parseLogLevel} from "../api/util/util";

export interface Config {
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
	sentryDsn: environment.SENTRY_DSN,
	environment: environment.NODE_ENV,
	production: environment.NODE_ENV != null && environment.NODE_ENV.toLowerCase() === "production",
	testing: booleanize(environment.TESTING),
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
