import {IMemoryRegistryService} from "../polyfill-registry/i-memory-registry-service";
import {PolyfillName} from "../../../polyfill/polyfill-name";

export interface ICacheRegistryService extends IMemoryRegistryService {
	initialize(): Promise<void>;
	needsUpdate(polyfillName: PolyfillName, currentVersion: string): Promise<boolean>;
	updatePackageVersionMap(options: IterableIterator<[PolyfillName, string]>): Promise<void>;
}
