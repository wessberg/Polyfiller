import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {IPolyfillFeature} from "../../../polyfill/i-polyfill-feature";
import {IRegistryGetResult} from "./i-registry-get-result";

export interface IMemoryRegistryService {
	get (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<IRegistryGetResult|undefined>;
	set (name: IPolyfillFeature|Set<IPolyfillFeature>, contents: Buffer, encoding?: ContentEncodingKind): Promise<IRegistryGetResult>;
	has (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<boolean>;
}