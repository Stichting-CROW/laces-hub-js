import Laces from "../../laces";
import { VersionDeltaFormat } from "../repository/types";
import { FromAPI, VersionedLacesResource } from "../../laces/util/types";
import { RdfPublication } from ".";
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
  readonly versions: RdfPublication[];
  readonly versioningMode: PublicationVersioningMode;
  override readonly isVersioned: boolean;
  readonly filename: string;

  constructor(filename: string, versions: PublicationView[]) {
    const orderedVersions = versions.sort((b, a) => a.publicationDate! - b.publicationDate!);
    super(orderedVersions[0].id!, orderedVersions[0]);

    this.filename = filename;
    this.versioningMode = orderedVersions[0].versioningMode!;
    this.versions = [];
    this.isVersioned = true;

    for (const version of orderedVersions) {
      this.versions.push(new RdfPublication(version.id!, version));
    }
  }

  async lastVersion(): Promise<RdfPublication> {
    return this.versions[0];
  }

  async firstVersion(): Promise<RdfPublication> {
    return this.versions.slice(-1)[0];
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
