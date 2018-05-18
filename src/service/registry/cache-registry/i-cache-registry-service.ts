import {IMemoryRegistryService} from "../polyfill-registry/i-memory-registry-service";
import {PolyfillName} from "../../../polyfill/polyfill-name";
import {ICacheRegistryServiceUpdatePackageVersionMapOptions} from "./i-cache-registry-service-update-package-version-map-options";

export interface ICacheRegistryService extends IMemoryRegistryService {
	needsUpdate (polyfillName: PolyfillName, currentVersion: string): Promise<boolean>;
	updatePackageVersionMap (...options: ICacheRegistryServiceUpdatePackageVersionMapOptions[]): Promise<void>;
}