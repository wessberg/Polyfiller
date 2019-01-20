import {IGetCertificateOptions} from "./i-get-certificate-options";
import {certificateFor} from "devcert";

/**
 * Gets certificates that can be used with a HTTP2 server
 * @param {IGetCertificateOptions} options
 * @returns {Promise<{key: Buffer|undefined, cert: Buffer|undefined}>}
 */
export async function getCertificates({key, cert, production, host}: IGetCertificateOptions): Promise<{key: Buffer | undefined; cert: Buffer | undefined}> {
	// If a key and certificate was already given, use those two
	if (key != null && cert != null) return {key, cert};

	// Otherwise, if not in production, use devcert to generate a new certificate
	if (!production) {
		return await certificateFor(host);
	}

	// Return nothing
	return {key: undefined, cert: undefined};
}
