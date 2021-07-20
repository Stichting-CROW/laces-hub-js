import { DeepRequired } from "ts-essentials";
import { UserView } from "../user/types";

export interface LacesResponse {}

/** Helper interface */
export interface Identifiable {
  id: string;
}

export interface ReadOnlyLacesResource<T> {
  readonly id: string;
  readonly cache: Partial<T>;

  /** Returns available metadata on the resource. */
  getInfo(refresh: boolean = false): Promise<FromAPI<T>>;
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

export interface VersionedLacesResource<V> extends LacesResource<T, U> {
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

/** Paginated API responses */
export interface Paginated<T> {
  contents: Readonly<T>[];
  total: number;
}

/** Explicitely confirm deletion. */
export interface ConfirmDeletion {
  /** Function returns void if false */
  confirm: boolean;
}

/** Optionally indicate which page of the paginated resources should be requested. */
export interface WhichPage {
  page: number;
}

/** Common interface for created/modified properties */
export interface CreatedModifiedResource {
  createdBy?: UserView["id"];
  createdOn?: number;
  modifiedBy?: UserView["id"];
  modifiedOn?: number;
}

export type CommonProperties<T, U, V> = Exclude<T | U | V, keyof T | keyof U | keyof V>;

export type Spread2<T, U> = Required<CommonProperties<T, U, null>> & Partial<T> & Partial<U>;
export type Spread3<T, U, V> = Required<CommonProperties<T, U, V>> &
  Partial<T> &
  Partial<U> &
  Partial<V>;

export type AsyncFn<T> = () => Promise<T>;
