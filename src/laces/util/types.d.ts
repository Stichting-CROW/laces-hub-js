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

/** A versioned resource is in-place updateable. */
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

/** @deprecated */
export type CommonProperties<T, U, V> = Exclude<T | U | V, keyof T | keyof U | keyof V>;

/** @deprecated */
export type Spread2<T, U> = Required<CommonProperties<T, U, null>> & Partial<T> & Partial<U>;
/** @deprecated */
export type Spread3<T, U, V> = Required<CommonProperties<T, U, V>> &
  Partial<T> &
  Partial<U> &
  Partial<V>;

/** @deprecated */
export type AsyncFn<T> = () => Promise<T>;
