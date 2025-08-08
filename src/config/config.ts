import {readFileSync} from "fs";
import {Buffer} from "buffer";

import pkg from "../../package.json" assert {type: "json"};
import {booleanize} from "../api/util.js";
import {generateReleaseName, parseLogLevel} from "../api/util/util.js";
import {environment} from "../environment/environment.js";
import type {LogLevel} from "../service/logger/i-logger-service.js";

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
	// S3 storage
	enableS3Storage: boolean;
	s3Storage?: Record<"region"| "bucket" | "accessKeyId" | "secretAccessKey" | "endpoint", string> & {
		forcePathStyle?: boolean;
	};
}

export const config: Config = {
	version: generateReleaseName(pkg),
	sentryDsn: environment.SENTRY_DSN as string | undefined,
	environment: environment.NODE_ENV as string,
	production: environment.NODE_ENV != null && (environment.NODE_ENV as string).toLowerCase() === "production",
	testing: booleanize(environment.TESTING as string | undefined),
	volumes: (environment.VOLUMES as string).split(" ")
		.map((part: string) => part.trim())
		.filter((part: string) => part.length > 0),
	logLevel: parseLogLevel(environment.LOG_LEVEL as string) ?? "info",
	clearCache: booleanize(environment.CLEAR_CACHE as string | undefined),
	https: booleanize(environment.HTTPS as string | undefined),
	host: environment.HOST as string,
	port: parseInt(environment.PORT as string),
	key:
		environment.KEY == null || environment.KEY === ""
			? undefined
			: (environment.KEY as string).trim().startsWith("-----BEGIN RSA PRIVATE KEY-----")
			? Buffer.from((environment.KEY as string).replace(/\\n/g, "\n"))
			: readFileSync(environment.KEY as string),
	cert:
		environment.CERT == null || environment.CERT === ""
			? undefined
			: (environment.CERT as string).trim().startsWith("-----BEGIN CERTIFICATE-----")
			? Buffer.from((environment.CERT as string).replace(/\\n/g, "\n"))
			: readFileSync(environment.CERT as string),
	// S3 config
	enableS3Storage: booleanize(environment.ENABLE_S3_STORAGE as string | undefined),
	s3Storage: {
		region: environment.S3_REGION as string ?? "",
		bucket: environment.S3_BUCKET as string ?? "",
		accessKeyId: environment.S3_ACCESS_KEY_ID as string ?? "",
		secretAccessKey: environment.S3_SECRET_ACCESS_KEY as string ?? "",
		endpoint: environment.S3_ENDPOINT as string ?? "",
		forcePathStyle: booleanize(environment.S3_FORCE_PATH_STYLE as string | undefined)
	}
};
