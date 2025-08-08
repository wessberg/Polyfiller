import {promises} from "fs";
import {dirname} from "crosspath";

import {error2false} from "../decorator/error2false.js";
import type {FileSystem} from "./file-system.js";

export class RealFileSystem implements FileSystem {
	@error2false
	async exists(path: string) {
		await promises.stat(path);
		return true;
	}

	async readFile(path: string) {
		if (await this.exists(path))
			try {
				return await promises.readFile(path);
			} catch {}

		return undefined;
	}

	@error2false
	async delete(path: string) {
		await promises.rm(path, {force: true, recursive: true});
		return true;
	}

	async writeFile(path: string, content: string | Buffer) {
		await promises.mkdir(dirname(path), {recursive: true});

		const data = Buffer.isBuffer(content) ? new Uint8Array(content) : content;

		return promises.writeFile(path, data);
	}
}
// for backward compatibility
export const realFileSystem = new RealFileSystem();
