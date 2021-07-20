import { Dictionary } from "ts-essentials";
import Laces from "..";
import { FileResource } from "../file/resource";
import { FileInfo, NewFileMetadata } from "../file/types";
import { VersionedFileResource } from "../file/versioned";
import { RdfPublication } from "../publication/resource";
import { NewPublicationMetadata, PublicationView } from "../publication/types";
import { VersionedRdfPublication } from "../publication/versioned";
import { ConfirmDeletion, FromAPI, LacesResource } from "../util/types";
import { likeUUID } from "../util/uuid";
import {
  Repository as RepositoryT,
  RepositoryData,
  RepositoryPartial,
  RepositoryView,
} from "./types";

/** Contains {@link RdfPublication RDF Publications} or {@link LacesFiles other files}. */
export class Repository
  implements LacesResource<RepositoryData | RepositoryView, RepositoryPartial>
{
  readonly id: string;
  cache: Partial<RepositoryView>;

  readonly ownerId?: string;
  readonly ownerName?: string;

  constructor(id: string, data?: Partial<RepositoryView>) {
    this.id = id;
    this.cache = { ...data };

    if (this.cache.owner) {
      if (likeUUID(this.cache.owner)) {
        this.ownerId = this.cache.owner;
      } else this.ownerName = this.cache.owner;
    }
  }

  static async create(data: RepositoryData): Promise<Repository> {
    const info = await Laces.API.Repository.createRepositoryInGroup(data);
    return new Repository(info.id, info);
  }

  async getInfo(refresh: boolean = false): Promise<FromAPI<RepositoryData>> {
    if (refresh || !this.cache) {
      this.cache = await Laces.API.Repository.getRepositoryMetadata(this.id);
    }
    return this.cache as FromAPI<RepositoryData>;
  }

  async update(data: RepositoryPartial): Promise<RepositoryData> {
    return await Laces.API.Repository.updateRepository(this.id, data);
  }

  async delete(opt: ConfirmDeletion): Promise<RepositoryT | void> {
    if (!opt.confirm) return;
    return await Laces.API.Repository.deleteRepository(this.id);
  }

  async contents(): Promise<{ publications: RdfPublication[]; files: FileResource[] }> {
    return {
      publications: await this.publications(),
      files: await this.files(),
    };
  }

  /** Returns publication within the repository. */
  async publications(): Promise<RdfPublication[]> {
    const data = await Laces.API.Publication.GetRepositoryPublications(this.id);

    const unversioned: RdfPublication[] = [];
    const name2version: Dictionary<PublicationView[], Required<PublicationView>["name"]> = {};

    for (const info of data) {
      if (info.versioningMode === "NONE") {
        unversioned.push(new RdfPublication(info.id, info));
        continue;
      }

      if (name2version[info.name]) {
        name2version[info.name].push(info);
        continue;
      } else {
        name2version[info.name] = [info];
        continue;
      }
    }

    const versioned: VersionedRdfPublication[] = [];
    for (const [__, infos] of Object.entries(name2version)) {
      const [basename, ...__] = infos[0].uri.split("/versions/");
      versioned.push(new VersionedRdfPublication(basename, infos));
    }
    return [...unversioned, ...versioned];
  }

  /** Returns files within the repository. */
  async files(): Promise<FileResource[]> {
    const data = await Laces.API.File.GetRepositoryFiles(this.id);

    const unversioned: FileResource[] = [];
    const name2version: Dictionary<FileInfo[], Required<FileInfo>["name"]> = {};

    for (const info of data) {
      if (info.versioningMode === "NONE") {
        unversioned.push(new FileResource(info.id, info));
        continue;
      }

      if (name2version[info.name]) {
        name2version[info.name].push(info);
        continue;
      } else {
        name2version[info.name] = [info];
        continue;
      }
    }

    const versioned: VersionedFileResource[] = [];
    for (const [filename, infos] of Object.entries(name2version)) {
      versioned.push(new VersionedFileResource(filename, infos));
    }
    return [...unversioned, ...versioned];
  }

  /**
   * Creates a new publication within a repository.
   * @param payload Supported: Turtle (.ttl), N-Triples (.nt), N3 (.n3), RDF/XML (.rdf, .owl, .xml), JSON-LD (.jsonld), RDF/JSON (.rj).
   * @name CreatePublication
   */
  async addPublication(
    metadata: NewPublicationMetadata,
    payload: Buffer
  ): Promise<PublicationView> {
    return await Laces.API.Publication.CreatePublication(this.id, {
      metadata: metadata,
      content: payload,
    });
  }

  /** Creates a file within the given repository using the specified id. */
  async uploadFile(metadata: NewFileMetadata, payload: Buffer): Promise<FileInfo> {
    return await Laces.API.File.AddFile(this.id, { fileInfo: metadata, content: payload });
  }
}

/** Returns all accessible repositories. */
export async function getRepositoriesWithAccessStatus(): Promise<Repository[]> {
  const data = await Laces.API.Repository.getRepositoriesWithAccessStatus();
  return data.map((info) => new Repository(info.id, info));
}
