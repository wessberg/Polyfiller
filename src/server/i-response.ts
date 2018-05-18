// tslint:disable:no-any

import {ContentEncodingKind} from "../encoding/content-encoding-kind";

export interface IResponse {
	contentType: string;
	statusCode: number;
	cacheControl?: string;
	contentEncoding?: ContentEncodingKind;
	body: any;
}

export declare type Response = IResponse;