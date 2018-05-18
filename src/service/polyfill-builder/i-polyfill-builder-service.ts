export interface IPolyfillBuilderService {
	building: boolean;
	hasBuilt: boolean;
	build (): Promise<void>;
	onBuilt (): Promise<void>;
}