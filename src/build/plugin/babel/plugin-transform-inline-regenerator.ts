/* eslint-disable @typescript-eslint/naming-convention */
import type {PluginItem, types, NodePath} from "@babel/core";
import template from "@babel/template";
import {REGENERATOR_SOURCE} from "../../../constant/regenerator-source.js";
const REGENERATOR_TEMPLATE = template(REGENERATOR_SOURCE)();

export default function (): PluginItem {
	let hasInlinedRegeneratorRuntime = false;
	let root: NodePath<types.Program>;

	return {
		name: "transform-inline-regenerator",
		visitor: {
			Program(path) {
				root = path;
			},
			MemberExpression(path) {
				if (hasInlinedRegeneratorRuntime || path.node.object.type !== "Identifier" || path.node.object.name !== "regeneratorRuntime") {
					return;
				}

				hasInlinedRegeneratorRuntime = true;
				root.unshiftContainer("body", REGENERATOR_TEMPLATE);
			}
		}
	};
}
