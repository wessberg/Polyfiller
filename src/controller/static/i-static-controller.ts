import {IController} from "../controller/i-controller";
import {ControllerMethod} from "../controller/controller-method";

export interface IStaticController extends IController {
	onIndexRequested: ControllerMethod;
}
