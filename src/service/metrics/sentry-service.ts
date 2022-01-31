import {IMetricsService} from "./i-metrics-service";
import {Handlers, init, Event, Integrations, captureException, captureEvent, captureMessage} from "@sentry/node";
import {Integrations as TracingIntegrations} from "@sentry/tracing";
import {Express} from "express";
import {Config} from "../../config/config";

export class SentryService implements IMetricsService {
	#initialized = false;
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

	constructor(private readonly config: Config) {}

	async initialize(app: Express): Promise<void> {
		if (this.config.sentryDsn == null) return;

		init({
			dsn: this.config.sentryDsn,
			environment: this.config.environment,
			release: this.config.version,
			integrations: [
				// enable HTTP calls tracing
				new Integrations.Http({tracing: true}),
				// enable Express.js middleware tracing
				new TracingIntegrations.Express({app})
			],
			tracesSampleRate: this.config.production ? 0.5 : 1.0
		});
		this.#initialized = true;
	}

	async configureRequestHandlers(app: Express): Promise<void> {
		if (!this.#initialized) return;

		app.use(Handlers.requestHandler());
		app.use(Handlers.tracingHandler());
	}

	async configureErrorHandlers(app: Express): Promise<void> {
		if (!this.#initialized) return;

		app.use(Handlers.errorHandler());
	}

	async captureEvent(event: Event): Promise<void> {
		if (!this.#initialized) return;

		this.#hasCapturedEvents = true;
		captureEvent(event);
	}
	async captureMessage(message: string): Promise<void> {
		if (!this.#initialized) return;

		this.#hasCapturedMessages = true;
		captureMessage(message);
	}
	async captureException(exception: Error): Promise<void> {
		if (!this.#initialized) return;

		this.#hasCapturedExceptions = true;
		captureException(exception);
	}
}
