import {ApiMethod} from "../server/i-server";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";

export function parseApiMethod(method: string): ApiMethod | undefined {
	const uppercased = method.toUpperCase();
	switch (uppercased) {
		case "GET":
		case "PUT":
		case "POST":
		case "DELETE":
		case "OPTIONS":
			return uppercased;
		default:
			return undefined;
	}
}

export function parseContentEncodingKind(encoding: string | undefined): ContentEncodingKind | undefined {
	if (encoding == null) return undefined;
	const lowercased = encoding.toLowerCase();
	switch (lowercased) {
		case "gzip":
		case "br":
			return lowercased;
		default:
			return undefined;
	}
}

/**
 * Picks the most favorable encoding to use from the given Set of encodings
 */
export function pickEncoding(encodings: Set<string> | undefined): ContentEncodingKind | undefined {
	if (encodings == null) return undefined;
	if (encodings.has("br")) return "br";
	if (encodings.has("gzip")) return "gzip";
	return undefined;
}
