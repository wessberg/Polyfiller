import {FileSystem} from "./file-system";
import {promises} from "fs";
import {dirname} from "path";

export const realFileSystem: FileSystem = {
	async exists(path: string): Promise<boolean> {
		try {
			await promises.stat(path);
			return true;
		} catch {
			return false;
		}
	},
	async readFile(path: string): Promise<Buffer | undefined> {
		if (!(await this.exists(path))) return undefined;
		try {
			return promises.readFile(path);
		} catch {
			return undefined;
		}
	},

	async delete(path: string): Promise<boolean> {
		try {
			await promises.rm(path, {force: true, recursive: true});
			return true;
		} catch {
			return false;
		}
	},

	async writeFile(path: string, content: string | Buffer): Promise<void> {
		try {
			await promises.mkdir(dirname(path), {recursive: true});
			return promises.writeFile(path, content);
		} catch {
			// The FileSystem might not allow mutations at the given path.
			// in any case, the operation failed
		}
	}
};
