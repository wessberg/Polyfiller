import {IRequestHandlerMatcher} from "./i-request-handler-matcher";
import {IController} from "../../controller/controller/i-controller";
import {ControllerMethod} from "../../controller/controller/controller-method";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A decorator that registers a method as a GET handler
 */
export function GET({path}: IRequestHandlerMatcher) {
	return function<T extends IController>(target: T, name: keyof T): void {
		if (target.controllerMethods == null) (target as any).controllerMethods = new Map();

		let baseMap = target.controllerMethods.get("GET");
		const hadBaseMap = baseMap != null;
		if (!hadBaseMap) {
			baseMap = new Map();
		}
		baseMap!.set(path, (target[name] as any) as ControllerMethod);
		if (!hadBaseMap) {
			target.controllerMethods.set("GET", baseMap!);
		}
	};
}
