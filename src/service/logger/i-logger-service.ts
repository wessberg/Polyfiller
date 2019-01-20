// tslint:disable:no-any

export interface ILoggerService {
	log(...messages: any[]): any[];
	debug(...messages: any[]): any[];
	verbose(...messages: any[]): any[];
	setDebug(debug: boolean): void;
	setVerbose(verbose: boolean): void;
}
