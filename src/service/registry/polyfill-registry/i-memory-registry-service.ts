import {IPolyfillFeature, IPolyfillFeatureInput} from "../../../polyfill/i-polyfill-feature";
import {IRegistryGetResult} from "./i-registry-get-result";
import {IPolyfillRequest} from "../../../polyfill/i-polyfill-request";

export interface PolyfillCachingContext extends Omit<IPolyfillRequest, "features"> {}

export interface IMemoryRegistryService {
	get(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillCachingContext): Promise<IRegistryGetResult | undefined>;
	getPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, context: PolyfillCachingContext): Promise<Set<IPolyfillFeature> | undefined>;
	set(name: IPolyfillFeature | Set<IPolyfillFeature>, contents: Buffer, context: PolyfillCachingContext): Promise<IRegistryGetResult>;
	setPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, polyfillSet: Set<IPolyfillFeature>, context: PolyfillCachingContext): Promise<Set<IPolyfillFeature>>;
	has(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillCachingContext): Promise<boolean>;
	hasPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, context: PolyfillCachingContext): Promise<boolean>;
}
