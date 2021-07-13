import { default as fetch, Headers, Response, FetchError, RequestInit } from "node-fetch";

export class Endpoint {
  /** Checks if the required environment variables are present. */
  static envCheck() {
    if (!process.env.LACES_ENDPOINT_URI) {
      throw Error(`No endpoint URI for Laces defined.`);
    }
    if (!process.env.LACES_APP_ID || !process.env.LACES_APP_PWD) {
      throw Error(`No Laces application id or password defined in '.env'.`);
    }
  }

  static async fetch(path: string, ctx?: RequestInit): Promise<Response> {
    const endpoint = `${process.env.LACES_ENDPOINT_URI}${path}`;

    const headers: Headers = new Headers(ctx?.headers);
    headers.append(
      "Authorization",
      "Basic " +
        Buffer.from(process.env.LACES_APP_ID + ":" + process.env.LACES_APP_PWD).toString("base64")
    );
    headers.append("User-Agent", "crow-laces-client");

    const context = { ...ctx, headers: headers };
    let response;

    try {
      response = await fetch(endpoint, context);
    } catch (err) {
      // err: FetchError
      throw Error(
        `${(err as FetchError).code}: Could not fetch ${endpoint}: ${(err as FetchError).message}`
      );
    }
    return response;
  }
}

export default Endpoint;
