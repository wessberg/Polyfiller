/* eslint-disable @typescript-eslint/consistent-type-imports */
import {DIContainer} from "@wessberg/di";
import type {ILoggerService} from "./service/logger/i-logger-service.js";
import {LoggerService} from "./service/logger/logger-service.js";
import type {Config} from "./config/config.js";
import {config} from "./config/config.js";
import type {IStaticBl} from "./bl/static/i-static-bl.js";
import {StaticBl} from "./bl/static/static-bl.js";
import type {IPolyfillBl} from "./bl/polyfill/i-polyfill-bl.js";
import {PolyfillBl} from "./bl/polyfill/polyfill-bl.js";
import type {IMemoryRegistryService} from "./service/registry/polyfill-registry/i-memory-registry-service.js";
import {MemoryRegistryService} from "./service/registry/polyfill-registry/memory-registry-service.js";
import type {IPolyfillBuilderService} from "./service/polyfill-builder/i-polyfill-builder-service.js";
import {PolyfillBuilderService} from "./service/polyfill-builder/polyfill-builder-service.js";
import type {ICacheRegistryService} from "./service/registry/cache-registry/i-cache-registry-service.js";
import {CacheRegistryService} from "./service/registry/cache-registry/cache-registry-service.js";
import type {IApiService} from "./service/api/i-api-service.js";
import {ApiService} from "./service/api/api-service.js";
import type {IMetricsService} from "./service/metrics/i-metrics-service.js";
import {SentryService} from "./service/metrics/sentry-service.js";
import type {ApiControllers, IServer} from "./api/server/i-server.js";
import {Server} from "./api/server/server.js";
import {PolyfillApiController} from "./api/controller/polyfill-api-controller.js";
import {StaticApiController} from "./api/controller/static-api-controller.js";
import {NoopMetricsService} from "./service/metrics/noop-metrics-service.js";
import type {FileSystem} from "./common/lib/file-system/file-system.js";
import {realFileSystem} from "./common/lib/file-system/real-file-system.js";

export const container = new DIContainer();

// Utilities
container.registerSingleton<FileSystem>(() => realFileSystem);

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
