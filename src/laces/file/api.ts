import FormData from "form-data";
import { Dictionary } from "ts-essentials";
import Laces from "..";
import { FromAPI } from "../util/types";
import { FileInfo, NewFileMetadata } from "./types";
import { VersionedFileResource } from "./versioned";

/** Files are assets like images or documents, either versioned or not. */
export namespace Files {
  /**
   * @description Returns the meta-data of file specified by the given id.
   *
   * @tags Files
   * @name GetFile
   * @summary Return file's meta-data
   * @request GET:/api/v3/files/{id}
   */
  export async function GetFile(fileId: string) {
    return await Laces.API.asJSON<FileInfo>(`/api/v3/files/${fileId}`);
  }

  /**
   * @description Updates the content of the file specified by the given id.
   *
   * @tags Files
   * @name UpdateNonVersionFile
   * @summary Update file content
   * @request PUT:/api/v3/files/{id}
   */
  export async function UpdateNonVersionFile(fileId: string, payload: Buffer) {
    const body = new FormData();
    body.append("content", payload);

    return await Laces.API.asJSON<FileInfo>(`/api/v3/files/${fileId}`, {
      method: "PUT",
      body: body,
      type: "multipart/form-data",
    });
  }

  /**
   * @description Delets the file specified by the given id.
   *
   * @tags Files
   * @name DeleteFile
   * @summary Delete file
   * @request DELETE:/api/v3/files/{id}
   */
  export async function DeleteFile(fileId: string): Promise<FromAPI<FileInfo> | void> {
    return await Laces.API.asJSON<FileInfo>(`/api/v3/files/${fileId}`, {
      method: "DELETE",
    });
  }

  /**
   * @description Returns the content of the file specified by the given id.
   *
   * @tags Files
   * @name DownloadFile
   * @summary Download file
   * @request GET:/api/v3/files/{id}/content
   */
  export async function DownloadFile(fileId: string) {
    return Laces.API.asStream(`/api/v3/files/${fileId}/content`);
  }

  /**
   * @description Returns the specific version of the file based on filename and version given.
   *
   * @tags Files
   * @name GetVersionOfFileContent
   * @summary Return versioned file
   * @request GET:/api/v3/repositories/{repositoryId}/{filename}/versions/{version}
   * @deprecated Use {@link DownloadFile} instead
   */
  export async function GetVersionOfFileContent(
    repositoryId: string,
    fileName: string,
    versionId: string
  ) {
    return Laces.API.asStream(
      `/api/v3/repositories/${repositoryId}/${fileName}/versions/${versionId}`
    );
  }

  /**
   * @description Returns a collection of the files from the repository with the specified repository id.
   *
   * @tags Files
   * @name GetRepositoryFiles
   * @summary Return files within repository
   * @request GET:/api/v3/repositories/{repositoryId}/files
   */
  export async function GetRepositoryFiles(repositoryId: string) {
    return await Laces.API.asJSON<FileInfo[]>(`/api/v3/repositories/${repositoryId}/files`);
  }

  /**
   * @description Creates a file within the given repository using the specified id.
   *
   * @tags Files
   * @name AddFile
   * @summary Create file
   * @request POST:/api/v3/repositories/{repositoryId}/files
   */
  export async function AddFile(
    repositoryId: string,
    data: { fileInfo: Partial<NewFileMetadata>; content: Buffer }
  ): Promise<FromAPI<FileInfo>> {
    const body = new FormData();
    body.append("fileInfo", JSON.stringify(data.fileInfo));
    body.append("content", data.content);

    return await Laces.API.asJSON<FileInfo>(`/api/v3/repositories/${repositoryId}/files`, {
      method: "POST",
      type: "multipart/form-data",
      body: body,
    });
  }

  /**
   * @description Returns the file specified by the given filename.
   *
   * @tags Files
   * @name GetFileContent
   * @summary Return file
   * @request GET:/api/v3/repositories/{repositoryId}/{filename}
   */
  export async function getFileContent(repositoryId: string, filename: string) {
    return await Laces.API.asJSON<FileInfo>(`/api/v3/repositories/${repositoryId}/${filename}`, {
      method: "GET",
    });
  }
}

/** @deprecated */
export class LacesFiles {
  /** Gather file descriptions and collect them into {@link LacesFiles files} */
  static asVersionedFiles(files: FileInfo[]): VersionedFileResource[] {
    const name2version: Dictionary<FileInfo[], Required<FileInfo>["name"]> = {};
    for (const file of files) {
      if (name2version[file.name!]) {
        name2version[file.name!].push(file);
      }
      name2version[file.name!] = [file];
    }

    const result: VersionedFileResource[] = [];
    for (const [filename, infos] of Object.entries(name2version)) {
      result.push(new VersionedFileResource(filename, infos));
    }
    return result;
  }
}

export default LacesFiles;
