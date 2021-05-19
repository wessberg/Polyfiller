import {IMetricsService} from "./i-metrics-service";
import {Express} from "express";

export class NoopMetricsService implements IMetricsService {
	#hasCapturedEvents = false;
	#hasCapturedMessages = false;
	#hasCapturedExceptions = false;

	get hasCapturedEvents() {
		return this.#hasCapturedEvents;
	}

	get hasCapturedMessages() {
		return this.#hasCapturedMessages;
	}

	get hasCapturedExceptions() {
		return this.#hasCapturedExceptions;
	}

	async initialize(_app: Express): Promise<void> {}

	async configureRequestHandlers(_app: Express): Promise<void> {}

	async configureErrorHandlers(_app: Express): Promise<void> {}

	async captureEvent(_event: unknown): Promise<void> {
		this.#hasCapturedEvents = true;
	}

	async captureException(_exception: Error): Promise<void> {
		this.#hasCapturedExceptions = true;
	}

	async captureMessage(_message: string): Promise<void> {
		this.#hasCapturedMessages = true;
	}
}
