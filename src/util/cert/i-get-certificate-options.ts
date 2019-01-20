export interface IGetCertificateOptions {
	key?: Buffer;
	cert?: Buffer;
	host: string;
	production: boolean;
}
