import {Request} from "../../server/i-request";
import {ControllerMethod} from "./controller-method";
import {Method} from "../../server/method";
import {Path} from "../../server/path";

export interface IController {
	readonly controllerMethods: Map<Method, Map<Path[] | Path, ControllerMethod>>;
	match(request: Request): ControllerMethod | undefined;
}
