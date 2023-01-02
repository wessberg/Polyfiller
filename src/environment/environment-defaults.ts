/* eslint-disable @typescript-eslint/naming-convention */
export const environmentDefaults = {
	SENTRY_DSN: undefined as string | undefined,
	KEY: undefined as string | undefined,
	CERT: undefined as string | undefined,
	LOG_LEVEL: "info",
	NODE_ENV: "development",
	TESTING: "false",
	HTTPS: "false",
	CLEAR_CACHE: "false",
	HOST: "0.0.0.0",
	PORT: "3000",
	VOLUMES: ""
};
