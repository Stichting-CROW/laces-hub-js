import { assert } from "ts-essentials";
import Laces from "..";
import { FromAPI, VersionedLacesResource } from "../util/types";
import { FileResource } from "./resource";
import { FileInfo, FileVersioningMode, NewFileMetadata } from "./types";

/** Represents all versions of a file. */
export class VersionedFileResource
  extends FileResource
  implements VersionedLacesResource<FileResource>
{
  readonly filename: string;
  readonly versions: FileResource[];
  readonly versioningMode: FileVersioningMode;
  readonly isVersioned: boolean;

  /** Construct a versioned container of all {@link FileInfo file descriptors}. */
  public constructor(filename: string, versions: FileInfo[]) {
    const orderedVersions = versions.sort((b, a) => a.modifiedOn! - b.modifiedOn!);
    // initialize super with the latest version.
    super(orderedVersions[0].id!, orderedVersions[0]);

    this.filename = filename;
    this.versioningMode = orderedVersions[0].versioningMode!;
    this.versions = [];
    this.isVersioned = true;

    for (const version of orderedVersions) {
      if (version.name! !== filename)
        throw new Error(`Inconsistent filenames: ensure all version are of the same file.`);
      this.versions.push(new FileResource(version.id!, version));
    }
  }

  async lastVersion(): Promise<FileResource> {
    return this.versions[0];
  }

  async firstVersion(): Promise<FileResource> {
    return this.versions.slice(-1)[0];
  }

  /** @throws Not implemented for arbitray files. */
  async compareVersions(
    _idA: FileResource,
    _idB: FileResource,
    _options?: { format: any }
  ): Promise<NodeJS.ReadableStream> {
    throw new Error("Method not implemented.");
  }

  public static requiresLabelForVersioningMode(mode: FileVersioningMode) {
    return mode == "CUSTOM";
  }

  public versionRequiresLabel(): boolean {
    return VersionedFileResource.requiresLabelForVersioningMode(this.versioningMode);
  }

  /** Uploads a new version of this file. */
  public override async update(
    metadata: Partial<NewFileMetadata>,
    payload: Buffer
  ): Promise<FromAPI<FileInfo>> {
    const info = await this.getInfo(); // = latest
    metadata.name = info.name;
    metadata.versioningMode = info.versioningMode;
    if (this.versionRequiresLabel()) {
      assert(
        metadata.versionLabel,
        `File "${info.name}" is versioned and a new version requires a version label`
      );
    }
    return Laces.API.File.AddFile(info.repositoryId, { fileInfo: metadata, content: payload });
  }
}
