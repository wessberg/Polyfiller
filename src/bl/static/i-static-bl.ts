export interface IStaticBl {
	getWelcomeMessage(contentType: "text/html" | "application/json"): Promise<string>;
}
