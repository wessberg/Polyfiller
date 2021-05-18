import {IMetricsService} from "./i-metrics-service";
import {Express} from "express";

export class NoopMetricsService implements IMetricsService {
	async initialize(_app: Express): Promise<void> {}

	async configureRequestHandlers(_app: Express): Promise<void> {}

	async configureErrorHandlers(_app: Express): Promise<void> {}
}
