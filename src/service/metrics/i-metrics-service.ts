import {Express} from "express";

export interface IMetricsService {
	initialize(): Promise<void>;
	configureRequestHandlers(app: Express): Promise<void>;
	configureErrorHandlers(app: Express): Promise<void>;
}
