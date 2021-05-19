import {ILoggerService, LogLevel, logLevelHierarchy} from "./i-logger-service";
import chalk from "chalk";
import {Config} from "../../config/config";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A class that helps with printing relevant information
 */
export class LoggerService implements ILoggerService {
	/**
	 * The prefix to attach to debugging messages
	 */
	private readonly DEBUG_PREFIX: string = chalk.yellow(this.padPrefix("[DEBUG]"));

	/**
	 * The prefix to attach to verbose messages
	 */
	private readonly VERBOSE_PREFIX: string = chalk.green(this.padPrefix("[VERBOSE]"));

	/**
	 * The prefix to attach to log messages
	 */
	private readonly INFO_PREFIX: string = this.padPrefix("");

	constructor(private config: Config) {}

	private allowLogging(messageLevel: LogLevel): boolean {
		return logLevelHierarchy[this.config.logLevel] >= logLevelHierarchy[messageLevel];
	}

	/**
	 * Logs the given message if debugging is activate
	 */
	debug(...messages: any[]): any[] {
		if (this.allowLogging("debug")) {
			// Print the message if 'debug' is true
			console.log(this.DEBUG_PREFIX, ...messages);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given messages
	 */
	info(...messages: any[]): any[] {
		if (this.allowLogging("info")) {
			// Print the message
			console.log(this.INFO_PREFIX, ...messages);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given messages, if verbose output is active
	 */
	verbose(...messages: any[]): any[] {
		// Print the message if 'verbose' is true
		if (this.allowLogging("verbose")) {
			console.log(this.VERBOSE_PREFIX, ...messages);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Pads a prefix to nicely align text inside the console
	 */
	private padPrefix(prefix: string): string {
		return prefix.padEnd(10, " ");
	}
}
