import { Blob } from "buffer";
import { assert } from "ts-essentials";
import { Repository } from "../repository/repository";
import { FromAPI } from "../util/types";
import LacesFiles, { Files } from "./api";
import { FileResource } from "./resource";
import { FileInfo, FileVersioningMode, NewFileMetadata } from "./types";

/** Represents all versions of a file. */
export class VersionedFile extends FileResource {
  readonly filename: string;
  readonly versions: FileResource[];
  readonly versioningMode: FileVersioningMode;

  /** Construct a versioned container of all {@link FileInfo file descriptors}. */
  public constructor(filename: string, versions: FileInfo[]) {
    const orderedVersions = versions.sort((b, a) => a.modifiedOn! - b.modifiedOn!);
    // initialize super with the latest version.
    super(orderedVersions[0].id!, orderedVersions[0]);

    this.filename = filename;
    this.versioningMode = orderedVersions[0].versioningMode!;
    this.versions = [];

    for (const version of orderedVersions) {
      if (version.name! !== filename)
        throw new Error(`Inconsistent filenames: ensure all version are of the same file.`);
      this.versions.push(new FileResource(version.id!, version));
    }
  }

  public static requiresLabelForVersioningMode(mode: FileVersioningMode) {
    return mode == "CUSTOM";
  }

  public versionRequiresLabel(): boolean {
    return VersionedFile.requiresLabelForVersioningMode(this.versioningMode);
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
    return Files.uploadFile(info.repositoryId, metadata, payload);
  }
}
