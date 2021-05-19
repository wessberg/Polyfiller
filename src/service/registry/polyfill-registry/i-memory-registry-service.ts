import {PolyfillFeature, PolyfillFeatureInput} from "../../../polyfill/polyfill-feature";
import {IRegistryGetResult} from "./i-registry-get-result";
import {PolyfillRequest} from "../../../polyfill/polyfill-request";

export interface PolyfillCachingContext extends Omit<PolyfillRequest, "features"> {}

export interface IMemoryRegistryService {
	get(name: PolyfillFeature | Set<PolyfillFeature>, context: PolyfillCachingContext): Promise<IRegistryGetResult | undefined>;
	getPolyfillFeatureSet(input: Set<PolyfillFeatureInput>, context: PolyfillCachingContext): Promise<Set<PolyfillFeature> | undefined>;
	set(name: PolyfillFeature | Set<PolyfillFeature>, contents: Buffer, context: PolyfillCachingContext): Promise<IRegistryGetResult>;
	setPolyfillFeatureSet(input: Set<PolyfillFeatureInput>, polyfillSet: Set<PolyfillFeature>, context: PolyfillCachingContext): Promise<Set<PolyfillFeature>>;
	has(name: PolyfillFeature | Set<PolyfillFeature>, context: PolyfillCachingContext): Promise<boolean>;
	hasPolyfillFeatureSet(input: Set<PolyfillFeatureInput>, context: PolyfillCachingContext): Promise<boolean>;
}
