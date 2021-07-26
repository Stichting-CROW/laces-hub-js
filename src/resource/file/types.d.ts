import { LacesResponse } from "../../laces/util/types";
import { CreatedModifiedResource } from "../types";

export type FileVersioningMode = "UNDEFINED" | "NONE" | "INCREMENTAL" | "DATE_TIME" | "CUSTOM";

export interface FileInfo extends CreatedModifiedResource, LacesResponse {
  id?: string;
  location?: string;
  mimeType?: string;
  name?: string;
  repositoryId?: string;
  versioningMode?: FileVersioningMode;
}

export interface NewFileMetadata {
  name: string;
  versioningMode: string;
  versionLabel: string;
}

/** @deprecated */
export type FileContent = object;

/** @deprecated */
export interface File {
  description?: string;
  file?: string;
  filename?: string;
  inputStream?: FileContent;
  open?: boolean;
  readable?: boolean;
  uri?: string;
  url?: string;
}
