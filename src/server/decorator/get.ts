import {IRequestHandlerMatcher} from "./i-request-handler-matcher";
import {IController} from "../../controller/controller/i-controller";
import {ControllerMethod} from "../../controller/controller/controller-method";

// tslint:disable:no-any

/**
 * A decorator that registers a method as a GET handler
 * @param {RegExp} path
 * @returns {(target: Object) => any}
 * @constructor
 */
export function GET ({path}: IRequestHandlerMatcher) {
	return function <T extends IController> (target: T, name: keyof T): void {
		if (target.controllerMethods == null) (<any>target).controllerMethods = new Map();

		let baseMap = target.controllerMethods.get("GET");
		const hadBaseMap = baseMap != null;
		if (!hadBaseMap) {
			baseMap = new Map();
		}
		baseMap!.set(path, <ControllerMethod><any> target[name]);
		if (!hadBaseMap) {
			target.controllerMethods.set("GET", baseMap!);
		}
	};
}