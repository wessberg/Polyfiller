import type {Express} from "express";

export interface IMetricsService {
	readonly hasCapturedEvents: boolean;
	readonly hasCapturedMessages: boolean;
	readonly hasCapturedExceptions: boolean;
	initialize(app: Express): Promise<void>;
	configureRequestHandlers(app: Express): Promise<void>;
	configureErrorHandlers(app: Express): Promise<void>;
	captureEvent(event: unknown): Promise<void>;
	captureMessage(message: string): Promise<void>;
	captureException(exception: Error): Promise<void>;
}
