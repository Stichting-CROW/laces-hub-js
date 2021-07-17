import { Endpoint } from "../endpoint/fetch";
import { ConfirmDeletion, FromAPI, LacesResource } from "../util/types";
import { Files } from "./api";
import { FileInfo } from "./types";

/** Represents all versions of a file. */
export class FileResource implements LacesResource<FileInfo, null> {
  readonly id: string;
  cache: FileInfo;

  public constructor(id: string, info?: FileInfo) {
    this.id = id;
    this.cache = { ...info };
  }

  async update(_metadata: never, payload: Buffer) {
    return await Files.UpdateNonVersionFile(this.id, payload);
  }

  async getInfo(refresh: boolean = false): Promise<FromAPI<FileInfo>> {
    if (refresh || !this.cache) {
      this.cache = await Files.GetFile(this.id);
    }
    return {
      ...(this.cache as FileInfo),
      createdOn: Endpoint.datetime(this.cache.createdOn as number) as unknown as number,
      modifiedOn: Endpoint.datetime(this.cache.modifiedOn as number) as unknown as number,
    } as FromAPI<FileInfo>;
  }

  async delete(confirm: ConfirmDeletion): Promise<FromAPI<FileInfo> | void> {
    if (!confirm.confirm) return;
    return await Files.DeleteFile(this.id);
  }

  async contents() {
    return await Files.DownloadFile(this.id);
  }
}
