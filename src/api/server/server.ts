import express, {Express} from "express";
import morgan from "morgan";
import {ApiControllers, IServer, ServerOptions} from "./i-server";
import {IMetricsService} from "../../service/metrics/i-metrics-service";
import {createServer as createHttpServer, Server as HttpServer} from "http";
import {createServer as createHttpsServer, Server as HttpsServer} from "https";
import {ILoggerService} from "../../service/logger/i-logger-service";
import {errorMiddleware} from "../middleware/error-middleware";
import {setupControllers} from "../middleware/setup-controllers";
import {Config} from "../../config/config";

export class Server implements IServer {
	private app: Express | undefined;
	private server: HttpServer | HttpsServer | undefined;

	constructor(
		private readonly config: Config,
		private readonly metricsService: IMetricsService,
		private readonly loggerService: ILoggerService,
		private readonly controllers: ApiControllers
	) {}

	async initialize(): Promise<void> {
		const app = express();

		await this.metricsService.initialize(app);
		await this.metricsService.configureRequestHandlers(app);

		// Options
		app.enable("etag");

		// Add request logging
		app.use(
			morgan("combined", {
				skip: req => this.config.logLevel === "silent" || req.path === "/healthz"
			})
		);

		// Setup CORS.
		app.use((_, res, next) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
			res.header("Access-Control-Allow-Headers", "Content-Type,Device-Language,Accept,Authorization,Version,Pragma");
			next();
		});

		// Setup controller methods
		setupControllers({app, controllers: this.controllers});

		await this.metricsService.configureErrorHandlers(app);

		// Apply fall-through error middleware
		app.use(errorMiddleware({removeStackTrace: this.config.production}));
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
			this.loggerService.info(`${"https" in options && options.https ? "Https" : "Http"} server started on host ${host} and port ${port}`);
		});

		this.server = server;
	}

	async stop(): Promise<void> {
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
