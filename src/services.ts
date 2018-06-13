import {DIContainer} from "@wessberg/di";
import {IMarshaller, Marshaller} from "@wessberg/marshaller";
import {FileLoader, IFileLoader} from "@wessberg/fileloader";
import {FileSaver, IFileSaver} from "@wessberg/filesaver";
import {ILoggerService} from "./service/logger/i-logger-service";
import {LoggerService} from "./service/logger/logger-service";
import {ICompressorService} from "./service/compression/i-compressor-service";
import {CompressorService} from "./service/compression/compressor-service";
import {IMinifyService} from "./service/minify/i-minify-service";
import {MinifyService} from "./service/minify/minify-service";
import {IConfig} from "./config/i-config";
import {config} from "./config/config";
import {brotliCompressionOptions} from "./service/compression/brotli-compression-options";
import {BrotliEncodeParams} from "iltorb";
import {ZlibOptions} from "zlib";
import {zlibCompressionOptions} from "./service/compression/zlib-compression-options";
import {IServer} from "./server/i-server";
import {Server} from "./server/server";
import {IRequestHandler} from "./server/request-handler/i-request-handler";
import {RequestHandler} from "./server/request-handler/request-handler";
import {RegisteredControllers} from "./controller/controller/registered-controllers";
import {IStaticController} from "./controller/static/i-static-controller";
import {StaticController} from "./controller/static/static-controller";
import {IPolyfillController} from "./controller/polyfill/i-polyfill-controller";
import {PolyfillController} from "./controller/polyfill/polyfill-controller";
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

// Utilities
DIContainer.registerSingleton<IFileLoader, FileLoader>();
DIContainer.registerSingleton<IFileSaver, FileSaver>();
DIContainer.registerSingleton<IMarshaller, Marshaller>();

// Services
DIContainer.registerSingleton<ILoggerService, LoggerService>();
DIContainer.registerSingleton<ICompressorService, CompressorService>();
DIContainer.registerSingleton<IMinifyService, MinifyService>();
DIContainer.registerSingleton<IMemoryRegistryService, MemoryRegistryService>();
DIContainer.registerSingleton<ICacheRegistryService, CacheRegistryService>();
DIContainer.registerSingleton<IPolyfillBuilderService, PolyfillBuilderService>();
DIContainer.registerSingleton<IApiService, ApiService>();

// Configuration
DIContainer.registerSingleton<IConfig, IConfig>(() => config);
DIContainer.registerSingleton<BrotliEncodeParams, BrotliEncodeParams>(() => brotliCompressionOptions);
DIContainer.registerSingleton<ZlibOptions, ZlibOptions>(() => zlibCompressionOptions);

// Server
DIContainer.registerSingleton<IServer, Server>();
DIContainer.registerSingleton<IRequestHandler, RequestHandler>();

// Business Logic
DIContainer.registerSingleton<IStaticBl, StaticBl>();
DIContainer.registerSingleton<IPolyfillBl, PolyfillBl>();

// Controller
DIContainer.registerSingleton<IStaticController, StaticController>();
DIContainer.registerSingleton<IPolyfillController, PolyfillController>();
DIContainer.registerSingleton<RegisteredControllers, RegisteredControllers>(() => [
	DIContainer.get<IStaticController>(),
	DIContainer.get<IPolyfillController>()
]);