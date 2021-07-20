import { Repository } from "../repository/types";

export type PublicationVersioningMode =
  | "UNDEFINED"
  | "NONE"
  | "TIMESTAMP"
  | "INCREMENTAL"
  | "DATE_TIME"
  | "CUSTOM";

export interface PublicationView {
  description?: string;
  id?: string;
  name?: string;
  owner?: string;
  publicationDate?: number;
  publisher?: string;
  repositoryId?: Repository["id"]; // was: repository
  schemaURIs?: string[];
  useVersionedBaseUri?: boolean;
  versioningMode?: PublicationVersioningMode;
  versions?: PublicationVersionView[];
  uri: string; // was: missing
}

export interface PublicationVersionView {
  description?: string;
  id?: string;
  publicationDate?: string;
  publisher?: string;
  schemaURIs?: string[];
  version?: string;
}

export interface PublicationUpdateable {
  publisher?: string;
  owner?: string;
  description?: string;
}

export interface NewPublicationMetadata {
  description: string;
  name: string;
  owner: string;
  publicationUri: string;
  publisher: string;
  schemaURIs: string[];
  useVersionedBaseUri: boolean;
  versioningMode: PublicationVersioningMode;
  versionLabel: string;
}

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
