import {ContentEncodingKind} from "../../../encoding/content-encoding-kind";
import {IPolyfillFeature} from "../../../polyfill/i-polyfill-feature";

export interface IMemoryRegistryService {
	get (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<Buffer|undefined>;
	set (name: IPolyfillFeature|Set<IPolyfillFeature>, contents: Buffer, encoding?: ContentEncodingKind): Promise<void>;
	has (name: IPolyfillFeature|Set<IPolyfillFeature>, encoding?: ContentEncodingKind): Promise<boolean>;
}