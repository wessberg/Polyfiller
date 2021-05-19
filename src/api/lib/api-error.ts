import {StatusCodes} from "http-status-codes";

export interface ApiErrorRecord {
	status: StatusCodes;
	message: string;
	stack?: string;
}

/**
 * An Error object representing erroneous responses from the API.
 */
export class ApiError extends Error {
	constructor(public readonly status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR, message?: string) {
		super(message);
	}

	/**
	 * Make NetworkErrors play nice with JSON serialization
	 */
	toJSON(): ApiErrorRecord {
		const {status, message, stack} = this;
		return {
			status,
			message,
			stack
		};
	}

	/**
	 * Constructs a new ApiError from the given record
	 */
	static fromJSON(data: ApiErrorRecord): ApiError {
		return new ApiError(data.status, data.message);
	}

	static ensureApiError(data: Error | ApiError | ApiErrorRecord): ApiError {
		if (data instanceof ApiError) return data;
		if ("status" in data) return ApiError.fromJSON(data);

		if ("status" in data && typeof status === "number") {
			const castData = data as Error & {status: number};
			return ApiError.fromJSON(castData);
		} else {
			return ApiError.fromJSON({
				status: StatusCodes.INTERNAL_SERVER_ERROR,
				...data
			});
		}
	}
}
