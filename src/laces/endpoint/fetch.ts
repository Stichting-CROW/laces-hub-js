import { BodyInit, default as fetch, Headers, Response } from "node-fetch";
import { FileFormat, SelectQueryFormat } from "../../resource/publication/types";
import { VersionDeltaFormat } from "../../resource/repository/types";
import { FromAPI } from "../util/types";
import { Paginated } from "../util/paginated";
import { EndpointError } from "./errors";
import { QueryParams, QueryParamsType } from "./queryparams";

export interface RequestParams {
  /** Request HTTP method */
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  /** Content-Type of the Request */
  type?:
    | "application/json"
    | "multipart/form-data"
    | "application/x-www-form-urlencoded"
    | "application/sparql-query";
  /** Content-Type of the Response */
  accept?: FileFormat | VersionDeltaFormat | SelectQueryFormat;
  /** Query parameters */
  query?: QueryParamsType;
  /** Request body */
  body?: BodyInit;
  /** Base URL for the request path */
  baseUrl?: string;
  /** Extra raw headers */
  rawHeaders?: string[][];
}

/** Groups specialized versions of a platform-authenticated fetch. */
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

  /** Get endpoint from environment variables. */
  static endpoint() {
    return `${process.env.LACES_ENDPOINT_URI}`;
  }

  /** Get authentication token from environment variables. */
  private static authToken() {
    return Buffer.from(process.env.LACES_APP_ID + ":" + process.env.LACES_APP_PWD).toString(
      "base64"
    );
  }

  /** Get User Agent header from environment variables. */
  private static userAgent() {
    const name = process.env.npm_package_name ?? `@stichting-crow/laces-hub-js`;
    const version = process.env.npm_package_version ? `/${process.env.npm_package_version}` : "";
    const credit = `https://github.com/stichting-crow/laces-hub-js`;
    const source = process.env.npm_package_homepage ?? "crow.nl";
    return `${name}${version} (using +${credit}; +${source};)`;
  }

  /** Fetch from server. */
  static async fetch(path: string, params?: RequestParams): Promise<Response> {
    const param = params || {};
    const queryString = param.query && QueryParams.toQueryString(param.query);

    const headers: Headers = new Headers(param.rawHeaders);
    headers.append("Authorization", `Basic ${Endpoint.authToken()}`);
    headers.append("User-Agent", Endpoint.userAgent());
    headers.append("Accept", param.accept ?? "application/json");
    param.type && headers.append("Content-Type", param.type);

    const base = param.baseUrl ?? Endpoint.endpoint();
    const url = `${base}${path}${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url, { ...param, headers: headers, body: param.body });
    if (!response.ok) throw new EndpointError(response);
    return response;
  }

  /** Fetches from Laces and returns JSON response as an object. */
  static async asJson<T>(path: string, param?: RequestParams): Promise<FromAPI<T>> {
    const response = await Endpoint.fetch(path, { ...param, accept: "application/json" });
    return (await response.json()) as FromAPI<T>;
  }

  /** Fetches from Laces as Paginated<T>. */
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
