import type fs from "fs";
export type RawFileSystem = Pick<typeof fs, "statSync" | "readFileSync" | "writeFileSync" | "unlinkSync"> & {
	promises: Pick<typeof fs.promises, "stat" | "readFile" | "writeFile" | "unlink">;
};

export interface FileSystem {
	isFile(p: string): Promise<boolean>;
	isFileSync(p: string): boolean;
	isDirectory(p: string): Promise<boolean>;
	isDirectorySync(p: string): boolean;
	readFile(p: string): Promise<Buffer | undefined>;
	readFile(p: string, encoding: "utf8"): Promise<string | undefined>;
	readFile(p: string, encoding?: "utf8"): Promise<string | Buffer | undefined>;
	readFileSync(p: string): Buffer | undefined;
	readFileSync(p: string, encoding: "utf8"): string | undefined;
	readFileSync(p: string, encoding?: "utf8"): string | Buffer | undefined;
	writeFile(p: string, content: Buffer | string): Promise<void>;
	writeFileSync(p: string, content: Buffer | string): void;
	unlink(p: string): Promise<void>;
	unlinkSync(p: string): void;
}

export function getFileSystem(fs: RawFileSystem): FileSystem {
	const {promises} = fs;

	async function readFile(p: string): Promise<Buffer | undefined>;
	async function readFile(p: string, encoding: "utf8"): Promise<string | undefined>;
	async function readFile(p: string, encoding?: "utf8"): Promise<Buffer | string | undefined> {
		try {
			return promises.readFile(p, encoding);
		} catch {
			return undefined;
		}
	}

	function readFileSync(p: string): Buffer | undefined;
	function readFileSync(p: string, encoding: "utf8"): string | undefined;
	function readFileSync(p: string, encoding?: "utf8"): string | Buffer | undefined {
		try {
			return fs.readFileSync(p, encoding);
		} catch {
			return undefined;
		}
	}

	return {
		async isFile(p: string): Promise<boolean> {
			try {
				return (await promises.stat(p)).isFile();
			} catch {
				return false;
			}
		},
		isFileSync(p: string): boolean {
			try {
				return fs.statSync(p).isFile();
			} catch {
				return false;
			}
		},
		async isDirectory(p: string): Promise<boolean> {
			try {
				return (await promises.stat(p)).isDirectory();
			} catch {
				return false;
			}
		},
		isDirectorySync(p: string): boolean {
			try {
				return fs.statSync(p).isDirectory();
			} catch {
				return false;
			}
		},
		readFile,
		readFileSync,
		async writeFile(p: string, content: Buffer | string): Promise<void> {
			try {
				return promises.writeFile(p, content);
			} catch {}
		},
		writeFileSync(p: string, content: Buffer | string): void {
			try {
				return fs.writeFileSync(p, content);
			} catch {
				return;
			}
		},
		async unlink(p: string): Promise<void> {
			try {
				return promises.unlink(p);
			} catch {}
		},
		unlinkSync(p: string): void {
			try {
				return fs.unlinkSync(p);
			} catch {
				return;
			}
		}
	};
}
