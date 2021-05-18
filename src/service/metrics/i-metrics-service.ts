import {Express} from "express";

export interface IMetricsService {
	initialize(app: Express): Promise<void>;
	configureRequestHandlers(app: Express): Promise<void>;
	configureErrorHandlers(app: Express): Promise<void>;
}
