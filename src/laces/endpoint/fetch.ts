import { BodyInit, default as fetch, Headers, Response } from "node-fetch";
import { FileFormat, SelectQueryFormat } from "../publication/types";
import { VersionDeltaFormat } from "../repository/types";
import { FromAPI, Paginated } from "../util/types";
import { EndpointError } from "./errors";
import { QueryParams } from "./helpers";

export type QueryParamsType = Record<string | number, any>;

export interface RequestParams {
  method?: Uppercase<string>;
  /** Content-Type of the Request */
  type?:
    | "application/json"
    | "multipart/form-data"
    | "application/x-www-form-urlencoded"
    | "application/sparql-query";
  /** Content-Type of the Response */
  accept?: FileFormat | VersionDeltaFormat | SelectQueryFormat;
  query?: QueryParamsType;
  body?: BodyInit;
  baseUrl?: string;
  rawHeaders?: string[][];
}

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

  static endpoint() {
    return `${process.env.LACES_ENDPOINT_URI}`;
  }

  private static authToken() {
    Buffer.from(process.env.LACES_APP_ID + ":" + process.env.LACES_APP_PWD).toString("base64");
  }

  /** Fetch from server. */
  static async fetch(path: string, params?: RequestParams): Promise<Response> {
    const param = params || {};
    const queryString = param.query && QueryParams.toQueryString(param.query);

    const headers: Headers = new Headers(param.rawHeaders);
    headers.append("Authorization", `Basic ${Endpoint.authToken()}`);
    headers.append("User-Agent", `@stichting-crow/laces-hub-js`);
    headers.append("Accept", param.accept ?? "application/json");
    param.type && headers.append("Content-Type", param.type);

    const base = param.baseUrl ?? Endpoint.endpoint();
    const url = `${base}${path}${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url, { headers: headers, body: param.body });
    if (!response.ok) throw new EndpointError(response);
    return response;
  }

  /** Convert UNIX timestamp to a xsd:DateTime format. */
  static datetime(timestamp: number) {
    return new Date(timestamp).toISOString();
  }

  /** Fetches from Laces and returns JSON response as an object. */
  static async asJson<T>(path: string, param?: RequestParams): Promise<FromAPI<T>> {
    const response = await Endpoint.fetch(path, { ...param, accept: "application/json" });
    return (await response.json()) as FromAPI<T>;
  }

  static async asPaginatedJson<T>(
    path: string,
    param?: RequestParams
  ): Promise<Paginated<FromAPI<T>>> {
    const response = await Endpoint.fetch(path, param);
    return await response.json();
  }

  /** Fetches from Laces and returns response as a stream. */
  static async asStream(path: string, param?: RequestParams): Promise<NodeJS.ReadableStream> {
    const response = await Endpoint.fetch(path, param);
    return response.body;
  }
}

export default Endpoint;
