/* eslint-disable @typescript-eslint/naming-convention */
import {ApiController} from "../../server/i-server";
import {ApiMethodDecoratorOptions, apiMethodDecorator} from "./api-method-decorator";

export interface GetDecoratorOptions extends ApiMethodDecoratorOptions {}

/**
 * A decorator that registers a method as a OPTIONS handler
 */
export function OPTIONS(options: GetDecoratorOptions) {
	return function <Implementation, T extends ApiController<Implementation>>(target: T, name: keyof Implementation & string): void {
		return apiMethodDecorator(target, name, "OPTIONS", options);
	};
}
