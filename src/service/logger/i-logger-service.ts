/* eslint-disable @typescript-eslint/no-explicit-any */

export type LogLevel = "silent" | "info" | "verbose" | "debug";

export const logLevelHierarchy = {
	silent: 0,
	info: 1,
	verbose: 2,
	debug: 3
};

export interface ILoggerService {
	info(...messages: any[]): any[];
	verbose(...messages: any[]): any[];
	debug(...messages: any[]): any[];
}
