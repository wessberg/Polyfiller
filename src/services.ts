import {DIContainer} from "@wessberg/di";
import {FileLoader, IFileLoader} from "@wessberg/fileloader";
import {FileSaver, IFileSaver} from "@wessberg/filesaver";
import {ILoggerService} from "./service/logger/i-logger-service";
import {LoggerService} from "./service/logger/logger-service";
import {Config, config} from "./config/config";
import {IStaticBl} from "./bl/static/i-static-bl";
import {StaticBl} from "./bl/static/static-bl";
import {IPolyfillBl} from "./bl/polyfill/i-polyfill-bl";
import {PolyfillBl} from "./bl/polyfill/polyfill-bl";
import {IMemoryRegistryService} from "./service/registry/polyfill-registry/i-memory-registry-service";
import {MemoryRegistryService} from "./service/registry/polyfill-registry/memory-registry-service";
import {IPolyfillBuilderService} from "./service/polyfill-builder/i-polyfill-builder-service";
import {PolyfillBuilderService} from "./service/polyfill-builder/polyfill-builder-service";
import {ICacheRegistryService} from "./service/registry/cache-registry/i-cache-registry-service";
import {CacheRegistryService} from "./service/registry/cache-registry/cache-registry-service";
import {IApiService} from "./service/api/i-api-service";
import {ApiService} from "./service/api/api-service";
import {IMetricsService} from "./service/metrics/i-metrics-service";
import {SentryService} from "./service/metrics/sentry-service";
import {ApiControllers, IServer} from "./api/server/i-server";
import {Server} from "./api/server/server";
import {PolyfillApiController} from "./api/controller/polyfill-api-controller";
import {StaticApiController} from "./api/controller/static-api-controller";
import {NoopMetricsService} from "./service/metrics/noop-metrics-service";

export const container = new DIContainer();

// Utilities
container.registerSingleton<IFileLoader, FileLoader>();
container.registerSingleton<IFileSaver, FileSaver>();

// Services
container.registerSingleton<ILoggerService, LoggerService>();
container.registerSingleton<IMemoryRegistryService, MemoryRegistryService>();
container.registerSingleton<ICacheRegistryService, CacheRegistryService>();
container.registerSingleton<IPolyfillBuilderService, PolyfillBuilderService>();
container.registerSingleton<IApiService, ApiService>();

config.testing ? container.registerSingleton<IMetricsService, NoopMetricsService>() : container.registerSingleton<IMetricsService, SentryService>();

// Configuration
container.registerSingleton<Config>(() => config);

// Server
container.registerSingleton<IServer, Server>();

// Business Logic
container.registerSingleton<IStaticBl, StaticBl>();
container.registerSingleton<IPolyfillBl, PolyfillBl>();

// Controller
container.registerSingleton<StaticApiController>();
container.registerSingleton<PolyfillApiController>();
container.registerSingleton<ApiControllers>(() => [container.get<PolyfillApiController>(), container.get<StaticApiController>()]);
