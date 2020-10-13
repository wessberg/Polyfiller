import {IGetCertificateOptions} from "./i-get-certificate-options";

/**
 * Gets certificates that can be used with a HTTP2 server
 *
 * @param options
 * @returns
 */
export async function getCertificates({key, cert}: IGetCertificateOptions): Promise<{key: Buffer | undefined; cert: Buffer | undefined}> {
	// If a key and certificate was already given, use those two
	if (key != null && cert != null) return {key, cert};

	// Return nothing
	return {key: undefined, cert: undefined};
}
