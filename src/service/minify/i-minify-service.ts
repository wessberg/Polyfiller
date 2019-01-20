import {IMinifyServiceOptions} from "./i-minify-service-options";

export interface IMinifyService {
	minify(options: IMinifyServiceOptions): Promise<string>;
}
