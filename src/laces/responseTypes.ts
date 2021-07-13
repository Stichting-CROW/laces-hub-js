export type GroupAccessType = "PRIVATE" | "PUBLIC" | "USER";
export type GroupAccessRole = "VIEWER" | "PUBLISHER" | "MANAGER" | "OWNER";
export type RepositoryStatus = "PENDING_PUBLISHER" | "PENDING_MANAGER" | "DENIED" | GroupAccessRole;
export type PublicationVersioningMode =
  | "UNDEFINED"
  | "NONE"
  | "TIMESTAMP"
  | "INCREMENTAL"
  | "DATE_TIME"
  | "CUSTOM";

export type Paginated<T> = {
  total: number;
  contents: T[];
};

export type GroupView = {
  id: string;
  name: string;
  type: GroupAccessType;
  createdBy?: string;
  createdOn?: number;
  description?: string;
  modifiedBy?: string;
  modifiedOn?: number;
  owner?: string;
  parentId?: GroupView["id"];
  path?: string;
  /** Amount of repositories at this level */
  repositoryCount?: number;
  role?: GroupAccessRole;
  subgroupCount?: number;
};

export type HierarchicalGroup = GroupView & {
  children: GroupView[];
};

export type RepositoryInfo = {
  id: string;
  name: string;
  description?: string;
  status: RepositoryStatus;
  owner: string;
  publicVisibility?: boolean;
  fullPath?: string;
  accessRequestId?: string;
};

export type PublicationView = {
  id: string;
  publicationDate?: number;
  name?: string;
  owner?: string;
  publisher?: string;
  repository?: RepositoryInfo["id"];
  versioningMode?: PublicationVersioningMode;
  useVersionedBaseUri?: boolean;
  description?: string;
  versions?: PublicationVersion[];
  schemaURIs?: string[];
};

export type PublicationVersion = {
  id: string;
  description: string;
  publicationDate: number;
  publisher: string;
  schemaURIs: string[];
  version: string;
};

export type FileFormat =
  | "text/turtle"
  | "application/rdf+xml"
  | "application/n-triples"
  | "application/ld+json";

export type SelectQueryFormat =
  | "application/json"
  | "text/csv"
  | "application/sparql-results+json"
  | "application/sparql-results+xml"
  | "text/tab-separated-values";

export type ConstructQueryFormat = FileFormat;
export type DescribeQueryFormat = FileFormat;
export type AskQueryFormat = FileFormat;

export type QueryFormat = SelectQueryFormat | ConstructQueryFormat;
