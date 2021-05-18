import express, {Express} from "express";
import {ApiControllers, IServer, ServerOptions} from "./i-server";
import {IMetricsService} from "../../service/metrics/i-metrics-service";
import {createServer as createHttpServer, Server as HttpServer} from "http";
import {createServer as createHttpsServer, Server as HttpsServer} from "https";
import {ILoggerService} from "../../service/logger/i-logger-service";
import {controllerMiddleware} from "../middleware/controller-middleware";
import {errorMiddleware} from "../middleware/error-middleware";

export class Server implements IServer {
	private app: Express | undefined;
	private server: HttpServer | HttpsServer | undefined;

	constructor(private metricsService: IMetricsService, private loggerService: ILoggerService, private controllers: ApiControllers) {}

	async initialize(): Promise<void> {
		const app = express();

		await this.metricsService.initialize();
		await this.metricsService.configureRequestHandlers(app);

		// Options
		app.enable("etag");

		// Setup CORS.
		app.use((_, res, next) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
			res.header("Access-Control-Allow-Headers", "Content-Type,Device-Language,Accept,Authorization,Version,Pragma");
			next();
		});

		// Apply API controllers
		app.use(controllerMiddleware({controllers: this.controllers}));

		await this.metricsService.configureErrorHandlers(app);

		// Apply fall-through error middleware
		app.use(errorMiddleware);
		this.app = app;
	}

	async start({host, port, ...options}: ServerOptions): Promise<void> {
		const server =
			"https" in options && options.https
				? createHttpsServer(
						{
							...options,
							requestCert: false,
							rejectUnauthorized: false
						},
						this.app
				  )
				: createHttpServer(this.app);

		server.listen(port, host, () => {
			this.loggerService.log(`${"https" in options && options.https ? "Https" : "Http"} server started on host ${host} and port ${port}`);
		});

		this.server = server;
	}

	stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (this.server == null) {
				resolve();
			} else if (!this.server.listening) {
				this.server = undefined;
				resolve();
			} else {
				this.server.close(err => {
					this.server = undefined;
					if (err != null) {
						reject(err);
					} else {
						resolve();
					}
				});
			}
		});
	}
}
