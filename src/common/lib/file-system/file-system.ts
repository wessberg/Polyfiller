export interface FileSystem {
	exists(path: string): Promise<boolean>;
	readFile(path: string): Promise<Buffer | undefined>;
	writeFile(path: string, content: string | Buffer): Promise<void>;
	delete(path: string): Promise<boolean>;
}
