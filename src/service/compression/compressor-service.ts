import {ICompressorService} from "./i-compressor-service";
import {gzip, ZlibOptions} from "zlib";
import {BrotliEncodeParams, compress as brotliCompress} from "iltorb";
import {ICompressorServiceCompressResult} from "./i-compressor-service-compress-result";

/**
 * A class that helps with compressing files with Brotli and Zlib
 */
export class CompressorService implements ICompressorService {
	constructor(private readonly zlibCompressionOptions: ZlibOptions, private readonly brotliCompressionOptions: BrotliEncodeParams) {}

	/**
	 * Compresses the given code based on the given options
	 *
	 * @param content
	 * @returns
	 */
	async compress(content: Buffer): Promise<ICompressorServiceCompressResult> {
		return {
			brotli: await this.compressWithBrotli(content),
			zlib: await this.compressWithZlib(content)
		};
	}

	/**
	 * Compresses the given code with Brotli based on the given options
	 *
	 * @param code
	 * @returns
	 */
	async compressWithBrotli(code: Buffer): Promise<Buffer> {
		return new Promise<Buffer>((resolve, reject) => {
			brotliCompress(code, this.brotliCompressionOptions, (err, output) => {
				if (err != null) return reject(err);
				return resolve(output);
			});
		});
	}

	/**
	 * Compresses the given code with Zlib based on the given options
	 *
	 * @param code
	 * @returns
	 */
	async compressWithZlib(code: Buffer): Promise<Buffer> {
		return new Promise<Buffer>((resolve, reject) => {
			gzip(code, this.zlibCompressionOptions, (err, output) => {
				if (err != null) return reject(err);
				return resolve(output);
			});
		});
	}
}
