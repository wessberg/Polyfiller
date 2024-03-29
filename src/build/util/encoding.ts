import type {BrotliOptions, ZlibOptions} from "zlib";
import {brotliCompress, gzip} from "zlib";

/**
 * Brotli-Encodes the given Buffer based on the given options
 */
export async function brotliEncode(buffer: Buffer, options: BrotliOptions): Promise<Buffer> {
	return new Promise<Buffer>((resolve, reject) => {
		brotliCompress(buffer, options, (err, output) => {
			if (err != null) return reject(err);
			return resolve(output);
		});
	});
}

/**
 * Gzip-Encodes the given buffer based on the given options
 */
export async function gzipEncode(buffer: Buffer, options: ZlibOptions): Promise<Buffer> {
	return new Promise<Buffer>((resolve, reject) => {
		gzip(buffer, options, (err, output) => {
			if (err != null) return reject(err);
			return resolve(output);
		});
	});
}
