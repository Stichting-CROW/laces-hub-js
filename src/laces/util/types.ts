import { DeepRequired } from "ts-essentials";
import { PublicationVersioningMode } from "../../resource/publication/types";
import { VersionDeltaFormat } from "../../resource/repository/types";
import { ConfirmDeletion } from "../../resource/types";

export interface LacesResponse {}

/** Helper interface */
export interface Identifiable {
  id: string;
}

export interface ReadOnlyLacesResource<T> {
  readonly id: string;
  readonly cache: Partial<T>;

  /** Returns available metadata on the resource. */
  getInfo(refresh: boolean): Promise<FromAPI<T>>;
}

/** A resource corresponds with a conceptual group of REST resources. */
export interface LacesResource<T, U> extends ReadOnlyLacesResource<T> {
  /** Delete resource. */
  delete(confirm: ConfirmDeletion): Promise<T | U | void>;
  /** Update the resource with metadata and payload. */
  update(metadata: U, payload: any): Promise<FromAPI<any>>;
  /** Return resource contents. */
  contents(): Promise<any>;
}

/** A versioned resource is in-place updateable. */
export interface VersionedLacesResource<V> {
  versions: V[];
  versioningMode: PublicationVersioningMode;
  isVersioned: boolean;

  lastVersion(): Promise<V>;
  firstVersion(): Promise<V>;
  compareVersions(
    idA: V,
    idB: V,
    options?: { format: VersionDeltaFormat }
  ): Promise<NodeJS.ReadableStream>;
}

/** API responses have their ID filled out. */
export declare type FromAPI<T> = DeepRequired<Readonly<T>>;
