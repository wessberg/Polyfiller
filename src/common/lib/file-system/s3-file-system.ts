import {S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, type S3ClientConfig} from "@aws-sdk/client-s3";

import type {Config} from "../../../config/config";
import type {ILoggerService} from "../../../service/logger/i-logger-service";
import {error2false, logger} from "../decorator/error2false.js";
import {fallbackSuper} from "../decorator/fallback-super.js";
import {RealFileSystem} from "./real-file-system.js";

export class S3FileSystem extends RealFileSystem {
	private s3Client: S3Client;
	private bucket: string;

	constructor(private readonly config: Config, public readonly logger: ILoggerService) {
		super();

		if (!config.s3Storage?.bucket) throw new Error("S3_BUCKET must be configured when using S3 storage");

		this.bucket = config.s3Storage.bucket;

		const s3Config: S3ClientConfig = {
			region: config.s3Storage.region || "us-east-1"
		};
		// If access key is provided, use it
		if (config.s3Storage.accessKeyId && config.s3Storage.secretAccessKey)
			s3Config.credentials = {
				accessKeyId: config.s3Storage.accessKeyId,
				secretAccessKey: config.s3Storage.secretAccessKey
			};
		// If a custom endpoint is provided (e.g. MinIO, R2, etc.)
		if (config.s3Storage.endpoint) {
			s3Config.endpoint = config.s3Storage.endpoint;
			s3Config.forcePathStyle = config.s3Storage.forcePathStyle;
		}
		this.s3Client = new S3Client(s3Config);
	}

	private getS3Key(path: string) {
		// Remove the leading / and s3:// prefix
		return path.replace(/^(s3:\/\/|\/?)/, "").replace(/^\/+/, "");
	}

	public isValidPath(path: string) {
		return path.startsWith("s3://");
	}

	@error2false
	@fallbackSuper
	async exists(path: string) {
		await this.s3Client.send(
			new HeadObjectCommand({
				Bucket: this.bucket,
				Key: this.getS3Key(path)
			})
		);
		return true;
	}

	@fallbackSuper
	async readFile(path: string) {
		try {
			const response = await this.s3Client.send(
				new GetObjectCommand({
					Bucket: this.bucket,
					Key: this.getS3Key(path)
				})
			);
			if (!response.Body) return;

			// Convert Readable stream to Buffer
			const chunks = await Array.fromAsync(response.Body as NodeJS.ReadableStream);
			const buffers = chunks.map(chunk => new Uint8Array(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));

			return Buffer.concat(buffers);
		} catch (error: any) {
			// Handle 404 (NoSuchKey) error - file doesn't exist
			if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) return;

			throw error; // Re-throw other errors
		}
	}

	@fallbackSuper
	@logger
	async writeFile(path: string, content: string | Buffer) {
		await this.s3Client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: this.getS3Key(path),
				Body: content instanceof Buffer ? content : Buffer.from(content)
			})
		);
	}

	@error2false
	@fallbackSuper
	async delete(path: string) {
		await this.s3Client.send(
			new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: this.getS3Key(path)
			})
		);
		return true;
	}
}
