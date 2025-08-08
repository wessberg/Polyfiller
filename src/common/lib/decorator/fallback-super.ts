/**
 * fallbackSuper decorator
 * If the method is not implemented in the current class, fallback to the parent class method
 * This is useful for file system implementation, where the method is implemented in the parent class
 * but the current class is a wrapper around the parent class
 * 
 * @param target - The method to decorate
 * @param context - The context of the method
 * @returns The decorated method
 */
export function fallbackSuper<T extends {isValidPath(path: string): boolean}>(target: (this: T, path: string, ...args: any[]) => any, context: ClassMethodDecoratorContext<T, any>) {
	const methodName = context.name as string;

	return function (this: T, path: string, ...args: any[]) {
		if (this.isValidPath(path)) {
			// Use the current class method (S3 implementation)
			return target.call(this, path, ...args);
		}
		// Use the parent class method (local file system implementation)
		const parent = Object.getPrototypeOf(Object.getPrototypeOf(this));
		const parentMethod = parent[methodName];

		if (typeof parentMethod !== "function") {
			throw new Error(`Parent method "${methodName}" not found or is not a function`);
		}

		return parentMethod.call(this, path, ...args);
	};
}
