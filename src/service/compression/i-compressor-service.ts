import {ICompressorServiceCompressResult} from "./i-compressor-service-compress-result";

export interface ICompressorService {
	compress(content: Buffer): Promise<ICompressorServiceCompressResult>;
	compressWithBrotli(code: Buffer): Promise<Buffer>;
	compressWithZlib(code: Buffer): Promise<Buffer>;
}
