import Laces from "../../laces";
import { FromAPI, LacesResource } from "../../laces/util/types";
import { fileFromPath } from "../../util/path";
import { ConfirmDeletion } from "../types";
import { FileInfo } from "./types";

/** Represents all versions of a file. */
export class FileResource implements LacesResource<FileInfo, null> {
  readonly id: string;
  cache: Partial<FileInfo>;

  public constructor(id: string, info?: Partial<FileInfo>) {
    this.id = id;
    this.cache = { ...info };
  }

  static async byPath(path: string): Promise<FileResource> {
    return fileFromPath(path);
  }

  async update(_metadata: never, payload: Buffer) {
    return await Laces.API.File.UpdateNonVersionFile(this.id, payload);
  }

  async getInfo(refresh: boolean = false): Promise<FromAPI<FileInfo>> {
    if (refresh || !this.cache) {
      this.cache = await Laces.API.File.GetFile(this.id);
    }
    return this.cache as FromAPI<FileInfo>;
  }

  async delete(confirm: ConfirmDeletion): Promise<FromAPI<FileInfo> | void> {
    if (!confirm.confirm) return;
    return await Laces.API.File.DeleteFile(this.id);
  }

  async contents() {
    return await Laces.API.File.DownloadFile(this.id);
  }
}
