import type {ApiController, ApiMethod, ApiPaths} from "../../server/i-server.js";
import {ensureArray} from "../../util.js";

export interface ApiMethodDecoratorOptions {
	path: ApiPaths;
}

export function apiMethodDecorator<T>(target: ApiController<T>, name: keyof T & string, method: ApiMethod, options: ApiMethodDecoratorOptions): void {
	(target.__apiMethods ??= {})[method] ??= new Map();

	for (const element of ensureArray(options.path)) {
		target.__apiMethods[method]!.set(element, name);
	}
}
