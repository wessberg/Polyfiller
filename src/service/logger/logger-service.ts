import {ILoggerService} from "./i-logger-service";
import chalk from "chalk";
import {IConfig} from "../../config/i-config";

// tslint:disable:no-any

/**
 * A class that helps with printing relevant information
 */
export class LoggerService implements ILoggerService {
	/**
	 * The prefix to attach to debugging messages
	 * @type {string}
	 */
	private readonly DEBUG_PREFIX: string = chalk.yellow(this.padPrefix("[DEBUG]"));

	/**
	 * The prefix to attach to verbose messages
	 * @type {string}
	 */
	private readonly VERBOSE_PREFIX: string = chalk.green(this.padPrefix("[VERBOSE]"));

	/**
	 * The prefix to attach to log messages
	 * @type {string}
	 */
	private readonly LOG_PREFIX: string = chalk.magenta(this.padPrefix("[INFO]"));
	/**
	 * Whether or not debugging is currently active
	 * @type {boolean}
	 */
	private _debug: boolean = false;
	/**
	 * Whether or not verbose output is currently active
	 * @type {boolean}
	 */
	private _verbose: boolean = false;

	constructor (config: IConfig) {
		this.setDebug(config.debug);
		this.setVerbose(config.verbose);
	}

	/**
	 * Sets whether or not debugging is active
	 * @param {boolean} debug
	 */
	public setDebug (debug: boolean): void {
		this._debug = debug;
	}

	/**
	 * Sets whether or not verbose output is active
	 * @param {boolean} verbose
	 */
	public setVerbose (verbose: boolean): void {
		this._verbose = verbose;
	}

	/**
	 * Logs the given message if debugging is activate
	 * @param {T[]} messages
	 * @returns {T}
	 */
	public debug (...messages: any[]): any[] {
		// Print the message if 'debug' is true
		if (this._debug) {
			console.log(this.DEBUG_PREFIX, ...messages);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given messages
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public log (...messages: any[]): any[] {
		// Print the message
		console.log(this.LOG_PREFIX, ...messages);

		// Return the messages
		return messages;
	}

	/**
	 * Logs the given messages, if verbose output is active
	 * @param {T} messages
	 * @returns {T[]}
	 */
	public verbose (...messages: any[]): any[] {
		// Print the message if 'verbose' is true
		if (this._verbose) {
			console.log(this.VERBOSE_PREFIX, ...messages);
		}

		// Return the messages
		return messages;
	}

	/**
	 * Pads a prefix to nicely align text inside the console
	 * @param {string} prefix
	 * @returns {string}
	 */
	private padPrefix (prefix: string): string {
		return prefix.padEnd(10, " ");
	}

}