import type {Config} from "../../../config/config";
import type {ILoggerService} from "../../../service/logger/i-logger-service";
import {realFileSystem} from "./real-file-system";
import {S3FileSystem} from "./s3-file-system";

export const createFileSystem = (config: Config, logger: ILoggerService) => (config.enableS3Storage ? new S3FileSystem(config, logger) : realFileSystem);
