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
	constructor(readonly status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR, message?: string) {
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
		const status = "status" in data && typeof data.status === "number" ? data.status : StatusCodes.INTERNAL_SERVER_ERROR;
		const message = data.message || ("name" in data ? data.name : undefined) || "Unknown Error";
		const stack = data.stack;

		return ApiError.fromJSON({status, message, stack});
	}
}
