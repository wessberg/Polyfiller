import {IController} from "../controller/i-controller";
import {ControllerMethod} from "../controller/controller-method";

export interface IPolyfillController extends IController {
	onPolyfillRequested: ControllerMethod;
}
