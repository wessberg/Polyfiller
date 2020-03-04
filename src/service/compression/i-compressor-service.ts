import {ICompressorServiceCompressResult} from "./i-compressor-service-compress-result";

export interface ICompressorService {
	compress(content: Buffer): Promise<ICompressorServiceCompressResult>;
	brotli(code: Buffer): Promise<Buffer>;
	gzip(code: Buffer): Promise<Buffer>;
}
