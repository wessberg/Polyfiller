import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {IPolyfillFeature, IPolyfillFeatureInput} from "../../../polyfill/i-polyfill-feature";
import {IRegistryGetResult} from "./i-registry-get-result";
import {PolyfillContext} from "../../../polyfill/polyfill-context";

export interface IMemoryRegistryService {
	get(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillContext, encoding?: ContentEncodingKind): Promise<IRegistryGetResult | undefined>;
	getPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, userAgent: string, context: PolyfillContext): Promise<Set<IPolyfillFeature> | undefined>;
	set(name: IPolyfillFeature | Set<IPolyfillFeature>, contents: Buffer, context: PolyfillContext, encoding?: ContentEncodingKind): Promise<IRegistryGetResult>;
	setPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, polyfillSet: Set<IPolyfillFeature>, userAgent: string, context: PolyfillContext): Promise<Set<IPolyfillFeature>>;
	has(name: IPolyfillFeature | Set<IPolyfillFeature>, context: PolyfillContext, encoding?: ContentEncodingKind): Promise<boolean>;
	hasPolyfillFeatureSet(input: Set<IPolyfillFeatureInput>, userAgent: string, context: PolyfillContext): Promise<boolean>;
}
