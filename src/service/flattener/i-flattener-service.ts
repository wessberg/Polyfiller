import {IFlattenerOptions} from "./i-flattener-options";

export interface IFlattenerService {
	flatten (options: IFlattenerOptions): Promise<string>;
}