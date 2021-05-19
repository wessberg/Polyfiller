import {IMetricsService} from "./i-metrics-service";
import {Handlers, init, Integrations} from "@sentry/node";
import {Integrations as TracingIntegrations} from "@sentry/tracing";
import {Express} from "express";
import {Config} from "../../config/config";

export class SentryService implements IMetricsService {
	private initialized = false;

	constructor(private config: Config) {}

	async initialize(app: Express): Promise<void> {
		if (this.config.sentryDsn == null) return;

		init({
			dsn: this.config.sentryDsn,
			integrations: [
				// enable HTTP calls tracing
				new Integrations.Http({tracing: true}),
				// enable Express.js middleware tracing
				new TracingIntegrations.Express({app})
			],
			tracesSampleRate: this.config.production ? 0.5 : 1.0
		});
		this.initialized = true;
	}

	async configureRequestHandlers(app: Express): Promise<void> {
		if (!this.initialized) return;

		app.use(Handlers.requestHandler());
		app.use(Handlers.tracingHandler());
	}

	async configureErrorHandlers(app: Express): Promise<void> {
		if (!this.initialized) return;

		app.use(Handlers.errorHandler());
	}
}
