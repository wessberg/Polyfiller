/* eslint-disable @typescript-eslint/naming-convention */
import type {ApiController} from "../../server/i-server.js";
import type {ApiMethodDecoratorOptions} from "./api-method-decorator.js";
import {apiMethodDecorator} from "./api-method-decorator.js";

export interface GetDecoratorOptions extends ApiMethodDecoratorOptions {}

/**
 * A decorator that registers a method as a OPTIONS handler
 */
export function OPTIONS(options: GetDecoratorOptions) {
	return function <Implementation, T extends ApiController<Implementation>>(target: T, name: keyof Implementation & string): void {
		return apiMethodDecorator(target, name, "OPTIONS", options);
	};
}
