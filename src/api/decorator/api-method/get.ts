import {ApiController} from "../../server/i-server";
import {ApiMethodDecoratorOptions, apiMethodDecorator} from "./api-method-decorator";

export interface GetDecoratorOptions extends ApiMethodDecoratorOptions {}

/**
 * A decorator that registers a method as a GET handler
 */
export function GET(options: GetDecoratorOptions) {
	return function <Implementation, T extends ApiController<Implementation>>(target: T, name: keyof Implementation & string): void {
		return apiMethodDecorator(target, name, "GET", options);
	};
}
