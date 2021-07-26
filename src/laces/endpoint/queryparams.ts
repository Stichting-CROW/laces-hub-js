export type QueryParamsType = Record<string | number, any>;

export namespace QueryParams {
  function encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  function addQueryParam(query: QueryParamsType, key: string) {
    return encodeQueryParam(key, query[key]);
  }

  function addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => encodeQueryParam(key, v)).join("&");
  }

  /** Convert query paramaters to a query parameter string. */
  export function toQueryString(query: QueryParamsType) {
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) =>
        Array.isArray(query[key]) ? addArrayQueryParam(query, key) : addQueryParam(query, key)
      )
      .join("&");
  }
}
