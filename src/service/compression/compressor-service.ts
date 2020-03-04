import {ICompressorService} from "./i-compressor-service";
import {gzip, brotliCompress, ZlibOptions, BrotliOptions} from "zlib";
import {ICompressorServiceCompressResult} from "./i-compressor-service-compress-result";

/**
 * A class that helps with compressing files with Brotli and Zlib
 */
export class CompressorService implements ICompressorService {
	constructor(private readonly zlibCompressionOptions: ZlibOptions, private readonly brotliCompressionOptions: BrotliOptions) {}

	/**
	 * Compresses the given code based on the given options
	 *
	 * @param content
	 * @returns
	 */
	async compress(content: Buffer): Promise<ICompressorServiceCompressResult> {
		return {
			brotli: await this.brotli(content),
			zlib: await this.gzip(content)
		};
	}

	/**
	 * Compresses the given code with Brotli based on the given options
	 */
	async brotli(code: Buffer): Promise<Buffer> {
		return new Promise<Buffer>((resolve, reject) => {
			brotliCompress(code, this.brotliCompressionOptions, (err, output) => {
				if (err != null) return reject(err);
				return resolve(output);
			});
		});
	}

	/**
	 * Compresses the given code with Zlib based on the given options
	 */
	async gzip(code: Buffer): Promise<Buffer> {
		return new Promise<Buffer>((resolve, reject) => {
			gzip(code, this.zlibCompressionOptions, (err, output) => {
				if (err != null) return reject(err);
				return resolve(output);
			});
		});
	}
}
