import {CacheWorker, CachedWorkerOptions} from "./cache-worker";
import {FileSystem} from "../file-system/file-system";

export interface CachedFileSystemOptions extends CachedWorkerOptions {
	fileSystem: FileSystem;
}

export class CachedFileSystem extends CacheWorker<CachedFileSystemOptions> implements FileSystem {
	readFile(p: string): Promise<Buffer | undefined>;
	readFile(p: string, encoding: "utf8"): Promise<string | undefined>;
	readFile(p: string, encoding?: "utf8"): Promise<Buffer | string | undefined> {
		return this.work(p, () => this.options.fileSystem.readFile(p, encoding));
	}

	readFileSync(p: string): Buffer | undefined;
	readFileSync(p: string, encoding: "utf8"): string | undefined;
	readFileSync(p: string, encoding?: "utf8"): Buffer | string | undefined {
		return this.work(p, () => this.options.fileSystem.readFileSync(p, encoding));
	}

	isDirectory(p: string): Promise<boolean> {
		return this.work(p, () => this.options.fileSystem.isDirectory(p));
	}

	isDirectorySync(p: string): boolean {
		return this.work(p, () => this.options.fileSystem.isDirectorySync(p));
	}

	isFile(p: string): Promise<boolean> {
		return this.work(p, () => this.options.fileSystem.isFile(p));
	}

	isFileSync(p: string): boolean {
		return this.work(p, () => this.options.fileSystem.isFileSync(p));
	}

	unlink(p: string): Promise<void> {
		return this.work(p, () => this.options.fileSystem.unlink(p));
	}

	unlinkSync(p: string): void {
		return this.work(p, () => this.options.fileSystem.unlinkSync(p));
	}

	writeFile(p: string, content: Buffer | string): Promise<void> {
		return this.work(p, () => this.options.fileSystem.writeFile(p, content));
	}

	writeFileSync(p: string, content: Buffer | string): void {
		return this.work(p, () => this.options.fileSystem.writeFileSync(p, content));
	}
}
