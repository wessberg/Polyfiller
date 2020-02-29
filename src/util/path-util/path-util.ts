import {sync} from "find-up";

/**
 * Finds the
 *
 * @param cwd
 * @param moduleName
 * @return
 */
export function findModuleRoot(cwd: string, moduleName: string): string | undefined {
	const result = sync(`node_modules/${moduleName}`, {cwd});
	return result == null ? undefined : result;
}
