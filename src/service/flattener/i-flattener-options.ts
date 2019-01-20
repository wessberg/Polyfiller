import {TransformSourceDescription} from "rollup";

export interface IFlattenerOptions {
	path: string[] | string;
	transform?(code: string, id: string): TransformSourceDescription["ast"] | void;
}
