export interface IServeOptions {
  http2: boolean;
  host: string;
  port: number;
  root: string;
  key?: Buffer;
  cert?: Buffer;
}