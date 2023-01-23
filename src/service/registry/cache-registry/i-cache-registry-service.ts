import type {IMemoryRegistryService} from "../polyfill-registry/i-memory-registry-service.js";
import type {PolyfillName} from "../../../polyfill/polyfill-name.js";

export interface ICacheRegistryService extends IMemoryRegistryService {
	initialize(): Promise<void>;
	needsUpdate(polyfillName: PolyfillName, currentVersion: string): Promise<boolean>;
	updatePackageVersionMap(options: IterableIterator<[PolyfillName, string]>): Promise<void>;
}
