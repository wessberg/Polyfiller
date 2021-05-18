import {IMetricsService} from "./i-metrics-service";
import {init, Handlers, Integrations} from "@sentry/node";
import {Integrations as TracingIntegrations} from "@sentry/tracing";
import {environment} from "../../environment/environment";
import {Express} from "express";

export class SentryService implements IMetricsService {
	async initialize(app: Express): Promise<void> {
		init({
			dsn: environment.SENTRY_DSN,
			integrations: [
				// enable HTTP calls tracing
				new Integrations.Http({tracing: true}),
				// enable Express.js middleware tracing
				new TracingIntegrations.Express({app})
			],
			tracesSampleRate: environment.NODE_ENV === "development" ? 1.0 : 0.5
		});
	}

	async configureRequestHandlers(app: Express): Promise<void> {
		app.use(Handlers.requestHandler());
		app.use(Handlers.tracingHandler());
	}

	async configureErrorHandlers(app: Express): Promise<void> {
		app.use(Handlers.errorHandler());
	}
}
