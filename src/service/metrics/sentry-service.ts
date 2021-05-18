import {IMetricsService} from "./i-metrics-service";
import {init, Handlers} from "@sentry/node";
import {environment} from "../../environment/environment";
import {Express} from "express";

export class SentryService implements IMetricsService {
	async initialize(): Promise<void> {
		init({
			dsn: environment.SENTRY_DSN,
			tracesSampleRate: environment.NODE_ENV === "development" ? 1.0 : 0.5
		});
	}

	async configureRequestHandlers(app: Express): Promise<void> {
		app.use(Handlers.requestHandler());
	}

	async configureErrorHandlers(app: Express): Promise<void> {
		app.use(Handlers.errorHandler());
	}
}
