import {IServeOptions} from "./i-serve-options";

export interface IServer {
	initializing: boolean;
	hasInitialized: boolean;
	serve(options: IServeOptions): Promise<void>;
	stop(): Promise<void>;
	onInitialized(): Promise<void>;
}
