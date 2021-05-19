import {ApiMethod, ContentType} from "../server/i-server";
import {ContentEncodingKind} from "../../encoding/content-encoding-kind";
import {LogLevel} from "../../service/logger/i-logger-service";

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

export function parseLogLevel(level: string | undefined): LogLevel | undefined {
	if (level == null) return undefined;
	const lowercased = level.toUpperCase();
	switch (lowercased) {
		case "silent":
		case "info":
		case "verbose":
		case "debug":
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

export function pickAccept(accept: string | undefined): ContentType {
	if (accept == null) return "text/html";
	const lowercased = accept.toLowerCase();

	if (lowercased.startsWith("text/html")) {
		return "text/html";
	}

	if (lowercased.startsWith("application/json")) {
		return "application/json";
	}

	return "text/html";
}
