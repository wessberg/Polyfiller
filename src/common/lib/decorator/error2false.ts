import {S3FileSystem} from "../file-system/s3-file-system";

type HandleErrorMethod<R> = (this: Pick<S3FileSystem, "logger">, ...args: any[]) => R;

/**
 * decorator for method that returns boolean
 * if the method throws an error, return false
 * works with both sync and async methods
 */
export function error2false<T extends HandleErrorMethod<boolean | Promise<boolean>>>(target: T, context: ClassMethodDecoratorContext<any, T>): T {
	const methodName = context.name as string;

	return function (...args: any[]) {
		const handleError = (error: any) => {
			this.logger?.debug(`Method ${methodName} caught error:`, error);

			return false;
		};

		try {
			const result = target.apply(this, args);

			// check if result is a Promise (async method)
			if (result instanceof Promise) return result.catch(handleError);

			// sync method - return result directly
			return result;
		} catch (error) {
			// log the error for sync methods
			return handleError(error);
		}
	} as T;
}

/**
 * decorator for logging errors and re-throwing them
 * logs error using `this.logger.info()` if available
 */
export function logger<T extends HandleErrorMethod<Promise<any>>>(target: T, context: ClassMethodDecoratorContext<any, T>): T {
	const methodName = context.name as string;

	return async function (...args: any[]) {
		try {
			return await target.apply(this, args);
		} catch (error) {
			if (this.logger?.info) {
				const [path] = args; // assume first argument is path for file operations

				this.logger.info(`Failed to ${methodName} file to ${path}`, error);
			}
			throw error; // re-throw to maintain existing error handling behavior
		}
	} as T;
}
