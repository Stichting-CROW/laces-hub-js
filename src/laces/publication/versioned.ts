import { MarkRequired } from "ts-essentials";
import Laces from "..";
import { VersionDeltaFormat } from "../repository/types";
import { FromAPI, VersionedLacesResource } from "../util/types";
import { RdfPublication } from "./resource";
import {
  NewPublicationMetadata,
  PublicationUpdateable,
  PublicationVersioningMode,
  PublicationVersionView,
  PublicationView,
} from "./types";

export class VersionedRdfPublication
  extends RdfPublication
  implements VersionedLacesResource<PublicationVersionView>
{
  override cache: MarkRequired<Partial<PublicationView>, "versions">;
  readonly versions: PublicationVersionView[];
  readonly versioningMode: PublicationVersioningMode;
  override readonly isVersioned: boolean;

  constructor(id: string, info?: Partial<PublicationView>) {
    super(id, info);
    this.cache = { ...info } as typeof VersionedRdfPublication.prototype.cache;
    this.isVersioned = true;
    this.versions = [...(info?.versions ?? [])];
    this.versioningMode = info?.versioningMode ?? "UNDEFINED";
  }

  async lastVersion(): Promise<FromAPI<PublicationVersionView>> {
    if (!this.cache) {
      this.cache = await this.getInfo();
    }
    return this.cache.versions[0] as FromAPI<PublicationVersionView>;
  }

  async firstVersion(): Promise<FromAPI<PublicationVersionView>> {
    if (!this.cache) {
      this.cache = await this.getInfo();
    }
    return this.cache.versions[this.cache.versions.length - 1] as FromAPI<PublicationVersionView>;
  }

  /**
   * Returns the delta between two publications as either TriG or N-Quads format.
   * Using the publications A and B, the delta is calculated using B - A.
   */
  async compareVersions(
    left: PublicationVersionView,
    right: PublicationVersionView,
    options?: { format: VersionDeltaFormat }
  ): Promise<NodeJS.ReadableStream> {
    return await Laces.API.Publication.FindDeltaForPublicationVersions(
      {
        version1: left.id as string,
        version2: right.id as string,
      },
      options?.format ?? "application/trig"
    );
  }

  override async update(info: PublicationUpdateable): Promise<FromAPI<PublicationView>>;
  override async update(
    info: NewPublicationMetadata,
    payload: Buffer
  ): Promise<FromAPI<PublicationView>>;
  override async update(info: any, payload?: Buffer): Promise<FromAPI<PublicationView>> {
    await this.getInfo();
    if (this.cache.versioningMode == "CUSTOM" && !(info as NewPublicationMetadata).versionLabel) {
      throw new Error(
        `Publication "${this.cache.name}" is versioned and requires a version update label.`
      );
    }
    if (payload) return super.update(info, payload);
    else return super.update(info);
  }
}
