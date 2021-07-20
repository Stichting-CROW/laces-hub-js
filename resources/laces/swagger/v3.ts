//@ts-nocheck
export interface Group {
  createdBy?: string;

  /** @format int64 */
  createdOn?: number;
  description?: string;
  id?: string;
  modifiedBy?: string;

  /** @format int64 */
  modifiedOn?: number;
  name: string;
  owner?: string;
  parentId?: string;
  pathSegment?: string;
  type: "PRIVATE" | "PUBLIC" | "USER";
}

export interface GroupView {
  createdBy?: string;

  /** @format int64 */
  createdOn?: number;
  description?: string;
  id?: string;
  modifiedBy?: string;

  /** @format int64 */
  modifiedOn?: number;
  name: string;
  owner?: string;
  parentId?: string;
  path?: string;

  /** @format int32 */
  repositoryCount?: number;
  role?: "VIEWER" | "PUBLISHER" | "MANAGER" | "OWNER";

  /** @format int32 */
  subgroupCount?: number;
  type: "PRIVATE" | "PUBLIC" | "USER";
}

export interface GroupViewPage {
  contents: GroupView[];

  /** @format int64 */
  total: number;
}

export interface GroupPartial {
  description?: string;
  name?: string;
  owner?: string;
  parentId?: string;
  type?: "PRIVATE" | "PUBLIC" | "USER";
}

export interface RepositoryPartial {
  description?: string;
  name?: string;
  visible?: boolean;
}

export interface RepositoryData {
  createdBy?: string;

  /** @format int64 */
  createdOn?: number;
  description?: string;
  id?: string;
  modifiedBy?: string;

  /** @format int64 */
  modifiedOn?: number;
  name: string;
  owner?: string;
  parentId: string;
  pathSegment: string;

  /** @format int32 */
  publicationCount?: number;
  visible: boolean;
}

export interface RepositoryPage {
  contents: RepositoryData[];

  /** @format int64 */
  total: number;
}

export interface Publication {
  description?: string;
  id?: string;
  name?: string;
  owner?: string;

  /** @format date-time */
  publicationDate?: string;
  publisher?: string;
  repository?: string;
  schemaURIs?: string[];
  useVersionedBaseUri?: boolean;
  versioningMode?: "UNDEFINED" | "NONE" | "TIMESTAMP" | "INCREMENTAL" | "DATE_TIME" | "CUSTOM";
  versions?: PublicationVersion[];
}

export interface PublicationVersion {
  description?: string;
  id?: string;

  /** @format date-time */
  publicationDate?: string;
  publisher?: string;
  schemaURIs?: string[];
  version?: string;
}

export interface PublicationView {
  description?: string;
  id?: string;
  name?: string;
  owner?: string;

  /** @format date-time */
  publicationDate?: string;
  publisher?: string;
  repository?: string;
  schemaURIs?: string[];
  useVersionedBaseUri?: boolean;
  versioningMode?: "UNDEFINED" | "NONE" | "TIMESTAMP" | "INCREMENTAL" | "DATE_TIME" | "CUSTOM";
  versions?: PublicationVersionView[];
}

export interface PublicationVersionView {
  description?: string;
  id?: string;

  /** @format date-time */
  publicationDate?: string;
  publisher?: string;
  schemaURIs?: string[];
  version?: string;
}

export interface Repository {
  createdBy?: string;

  /** @format int64 */
  createdOn?: number;

  /** description */
  description?: string;
  id?: string;
  modifiedBy?: string;

  /** @format int64 */
  modifiedOn?: number;

  /** name */
  name: string;
  parentId: string;
  pathSegment: string;
  publiclyVisible?: boolean;
}

export interface RepositoryView {
  accessRequestId?: string;

  /** Description */
  description?: string;
  fullPath?: string;

  /** ID */
  id: string;

  /** Name */
  name: string;

  /** Owner */
  owner: string;
  publicVisibility?: boolean;

  /** Status */
  status:
    | "PENDING_PUBLISHER"
    | "PENDING_MANAGER"
    | "DENIED"
    | "VIEWER"
    | "PUBLISHER"
    | "MANAGER"
    | "OWNER";
}

export interface FileInfo {
  createdBy?: string;

  /** @format int64 */
  createdOn?: number;
  id?: string;
  location?: string;
  mimeType?: string;
  modifiedBy?: string;

  /** @format int64 */
  modifiedOn?: number;
  name?: string;
  repositoryId?: string;
  versioningMode?: "UNDEFINED" | "NONE" | "TIMESTAMP" | "INCREMENTAL" | "DATE_TIME" | "CUSTOM";
}

export type FileContent = object;

export interface File {
  description?: string;
  file?: string;
  filename?: string;
  inputStream?: FileContent;
  open?: boolean;
  readable?: boolean;

  /** @format uri */
  uri?: string;

  /** @format url */
  url?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://hub.laces.tech";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
          ...(requestParams.headers || {}),
        },
        signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
        body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Laces Hub - REST API
 * @version v3
 * @baseUrl https://hub.laces.tech
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Returns a collection with all top-level groups.
     *
     * @tags Groups
     * @name GetTopGroups
     * @summary Return top-level groups
     * @request GET:/api/v3/groups
     */
    getTopGroups: (
      query?: {
        searchText?: string;
        sortBy?: "name" | "description" | "createdOn" | "modifiedOn";
        sortDirection?: "ASC" | "DESC";
        page?: number;
        pageSize?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<GroupViewPage, any>({
        path: `/api/v3/groups`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new top-level group.
     *
     * @tags Groups
     * @name CreateTopGroup
     * @summary Create top-level group
     * @request POST:/api/v3/groups
     */
    createTopGroup: (body: Group, params: RequestParams = {}) =>
      this.request<Group, any>({
        path: `/api/v3/groups`,
        method: "POST",
        body: body,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the group specified by the specfied id.
     *
     * @tags Groups
     * @name GetGroupDetails
     * @summary Return group
     * @request GET:/api/v3/groups/{id}
     */
    getGroupDetails: (id: string, params: RequestParams = {}) =>
      this.request<GroupView, any>({
        path: `/api/v3/groups/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes the group specified by the specfied id.
     *
     * @tags Groups
     * @name DeleteGroup
     * @summary Delete group
     * @request DELETE:/api/v3/groups/{id}
     */
    deleteGroup: (id: string, params: RequestParams = {}) =>
      this.request<Group, any>({
        path: `/api/v3/groups/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the groups only with the provided info, omits the rest.
     *
     * @tags Groups
     * @name UpdatePartialGroup
     * @summary Update group partially
     * @request PATCH:/api/v3/groups/{id}
     */
    updatePartialGroup: (id: string, body: GroupPartial, params: RequestParams = {}) =>
      this.request<Group, any>({
        path: `/api/v3/groups/${id}`,
        method: "PATCH",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Cretes a group within - or subgroup of - the group specified by the given id.
     *
     * @tags Groups
     * @name CreateSubGroup
     * @summary Create subgroup
     * @request POST:/api/v3/groups/{id}
     */
    createSubGroup: (id: string, body: Group, params: RequestParams = {}) =>
      this.request<Group, any>({
        path: `/api/v3/groups/${id}`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all (direct) subgroups of the group specified by the given id.
     *
     * @tags Groups
     * @name GetSubGroups
     * @summary Return subgroups
     * @request GET:/api/v3/groups/{id}/subgroups
     */
    getSubGroups: (
      id: string,
      query?: {
        searchText?: string;
        sortBy?: "name" | "description" | "createdOn" | "modifiedOn";
        sortDirection?: "ASC" | "DESC";
        page?: number;
        pageSize?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<GroupViewPage, any>({
        path: `/api/v3/groups/${id}/subgroups`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a collection of all repositories for which authenticated user has acces.
     *
     * @tags Repositories
     * @name GetRepositoriesWithAccessStatus
     * @summary Return repositories
     * @request GET:/api/v3/repositories
     */
    getRepositoriesWithAccessStatus: (params: RequestParams = {}) =>
      this.request<RepositoryView[], any>({
        path: `/api/v3/repositories`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new repository.
     *
     * @tags Repositories
     * @name CreateRepositoryInGroup
     * @summary Create repository
     * @request POST:/api/v3/repositories
     */
    createRepositoryInGroup: (body: RepositoryData, params: RequestParams = {}) =>
      this.request<Repository, any>({
        path: `/api/v3/repositories`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the repository only with the provided info, omits the rest.
     *
     * @tags Repositories
     * @name UpdateRepository
     * @summary Update repository partially
     * @request PATCH:/api/v3/repositories/{id}
     */
    updateRepository: (id: string, body: RepositoryPartial, params: RequestParams = {}) =>
      this.request<RepositoryData, any>({
        path: `/api/v3/repositories/${id}`,
        method: "PATCH",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the repository details specified by the given id.
     *
     * @tags Repositories
     * @name GetRepositoryMetadata
     * @summary Return repository
     * @request GET:/api/v3/repositories/{id}
     */
    getRepositoryMetadata: (id: string, params: RequestParams = {}) =>
      this.request<RepositoryData, any>({
        path: `/api/v3/repositories/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes the repository specified by the given id.
     *
     * @tags Repositories
     * @name DeleteRepository
     * @summary Delete repository
     * @request DELETE:/api/v3/repositories/{id}
     */
    deleteRepository: (id: string, params: RequestParams = {}) =>
      this.request<Repository, any>({
        path: `/api/v3/repositories/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Returns a collection of all repositories within the group identified by the given id.
     *
     * @tags Repositories
     * @name GetRepositories
     * @summary Return repositories within group
     * @request GET:/api/v3/groups/{groupId}/repositories
     */
    getRepositories: (
      groupId: string,
      query?: {
        searchText?: string;
        sortBy?: string;
        sortDirection?: "ASC" | "DESC";
        page?: number;
        pageSize?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<RepositoryPage, any>({
        path: `/api/v3/groups/${groupId}/repositories`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Returns the publications within the repository with the specified id
     *
     * @tags Publications
     * @name GetRepositoryPublications
     * @summary Return publications within repository
     * @request GET:/api/v3/repositories/{repositoryId}/publications
     */
    getRepositoryPublications: (repositoryId: string, params: RequestParams = {}) =>
      this.request<PublicationView[], any>({
        path: `/api/v3/repositories/${repositoryId}/publications`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new publication within repository specified by id, using the provided payload.
     *
     * @tags Publications
     * @name CreatePublication
     * @summary Create publication
     * @request POST:/api/v3/repositories/{repositoryId}/publications
     */
    createPublication: (
      repositoryId: string,
      data: { metadata: File; content: File },
      params: RequestParams = {}
    ) =>
      this.request<PublicationView, any>({
        path: `/api/v3/repositories/${repositoryId}/publications`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the publication using the given payload.
     *
     * @tags Publications
     * @name UpdatePublication
     * @summary Update publication
     * @request PUT:/api/v3/repositories/{repositoryId}/publications
     */
    updatePublication: (
      repositoryId: string,
      data: { "meta-data": string; Content: File },
      params: RequestParams = {}
    ) =>
      this.request<PublicationView, any>({
        path: `/api/v3/repositories/${repositoryId}/publications`,
        method: "PUT",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the meta-data of the publication specified by the given id.
     *
     * @tags Publications
     * @name GetPublicationMetaData
     * @summary Return publication's meta-data
     * @request GET:/api/v3/publications/{id}
     */
    getPublicationMetaData: (id: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v3/publications/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the publication only with the provided info.
     *
     * @tags Publications
     * @name UpdatePublicationMetadata
     * @summary Update publication's meta-data
     * @request PATCH:/api/v3/publications/{id}
     */
    updatePublicationMetadata: (
      id: string,
      query?: { publisher?: string; owner?: string; description?: string },
      params: RequestParams = {}
    ) =>
      this.request<Publication, any>({
        path: `/api/v3/publications/${id}`,
        method: "PATCH",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes the publication specified by the given id.
     *
     * @tags Publications
     * @name DeletePublication
     * @summary Delete publication
     * @request DELETE:/api/v3/publications/{id}
     */
    deletePublication: (id: string, params: RequestParams = {}) =>
      this.request<Publication, any>({
        path: `/api/v3/publications/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the delta between two publications as either TriG or N-Quads format. Using the publications A and B, the delta is calculated using B - A.
     *
     * @tags Publications
     * @name FindDeltaForPublicationVersions
     * @summary Return delta between publications
     * @request GET:/api/v3/publications.delta
     */
    findDeltaForPublicationVersions: (
      query: { version1: string; version2: string },
      params: RequestParams = {}
    ) =>
      this.request<string, any>({
        path: `/api/v3/publications.delta`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Returns the RDF content of the publication specified by the given id.
     *
     * @tags Publications
     * @name GetPublicationContent
     * @summary Get publication content
     * @request GET:/api/v3/publications/{id}/statements
     */
    getPublicationContent: (id: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v3/publications/${id}/statements`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Performs a SPARQL query using the query specified in the query parameter.
     *
     * @tags Publications
     * @name ExecuteSparqlQueryGet
     * @summary Execute SPARQL query using GET
     * @request GET:/api/v3/publications/{id}/sparql
     */
    executeSparqlQueryGet: (
      id: string,
      query: { query: string; "default-graph-uri"?: string[] },
      params: RequestParams = {}
    ) =>
      this.request<string, any>({
        path: `/api/v3/publications/${id}/sparql`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Performs a SPARQL query using the query specified in the body payload.
     *
     * @tags Publications
     * @name ExecuteSparqlQueryPost
     * @summary Execute SPARQL query using POST
     * @request POST:/api/v3/publications/{id}/sparql
     */
    executeSparqlQueryPost: (
      id: string,
      body: string,
      query?: { "default-graph-uri"?: string[] },
      params: RequestParams = {}
    ) =>
      this.request<string, any>({
        path: `/api/v3/publications/${id}/sparql`,
        method: "POST",
        query: query,
        body: body,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the meta-data of file specified by the given id.
     *
     * @tags Files
     * @name GetFile
     * @summary Return file's meta-data
     * @request GET:/api/v3/files/{id}
     */
    getFile: (id: string, params: RequestParams = {}) =>
      this.request<FileInfo, any>({
        path: `/api/v3/files/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the content of the file specified by the given id.
     *
     * @tags Files
     * @name UpdateNonVersionFile
     * @summary Update file content
     * @request PUT:/api/v3/files/{id}
     */
    updateNonVersionFile: (id: string, data: { content: File }, params: RequestParams = {}) =>
      this.request<FileInfo, any>({
        path: `/api/v3/files/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Delets the file specified by the given id.
     *
     * @tags Files
     * @name DeleteFile
     * @summary Delete file
     * @request DELETE:/api/v3/files/{id}
     */
    deleteFile: (id: string, params: RequestParams = {}) =>
      this.request<FileInfo, any>({
        path: `/api/v3/files/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the content of the file specified by the given id.
     *
     * @tags Files
     * @name DownloadFile
     * @summary Download file
     * @request GET:/api/v3/files/{id}/content
     */
    downloadFile: (id: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v3/files/${id}/content`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a collection of the files from the repository with the specified repository id.
     *
     * @tags Files
     * @name GetRepositoryFiles
     * @summary Return files within repository
     * @request GET:/api/v3/repositories/{repositoryId}/files
     */
    getRepositoryFiles: (repositoryId: string, params: RequestParams = {}) =>
      this.request<FileInfo[], any>({
        path: `/api/v3/repositories/${repositoryId}/files`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a file within the given repository using the specified id.
     *
     * @tags Files
     * @name AddFile
     * @summary Create file
     * @request POST:/api/v3/repositories/{repositoryId}/files
     */
    addFile: (
      repositoryId: string,
      data: { fileInfo: string; content: File },
      params: RequestParams = {}
    ) =>
      this.request<FileInfo, any>({
        path: `/api/v3/repositories/${repositoryId}/files`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the file specified by the given filename.
     *
     * @tags Files
     * @name GetFileContent
     * @summary Return file
     * @request GET:/api/v3/repositories/{repositoryId}/{filename}
     */
    getFileContent: (repositoryId: string, filename: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/v3/repositories/${repositoryId}/${filename}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Returns the specific version of the file based on filename and version given.
     *
     * @tags Files
     * @name GetVersionOfFileContent
     * @summary Return versioned file
     * @request GET:/api/v3/repositories/{repositoryId}/{filename}/versions/{version}
     */
    getVersionOfFileContent: (
      repositoryId: string,
      filename: string,
      version: string,
      params: RequestParams = {}
    ) =>
      this.request<File, any>({
        path: `/api/v3/repositories/${repositoryId}/${filename}/versions/${version}`,
        method: "GET",
        ...params,
      }),
  };
}
