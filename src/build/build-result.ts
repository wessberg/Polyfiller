export interface BuildResult {
	brotli: Buffer;
	zlib: Buffer;

	// The code with no encoding applied
	raw: Buffer;
}
