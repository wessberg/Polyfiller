import {ILoaderServiceOptions} from "./i-loader-service-options";
import {ILoaderServiceResult} from "./i-loader-service-result";

export interface ILoaderService {
	load (options: ILoaderServiceOptions): Promise<ILoaderServiceResult>;
}