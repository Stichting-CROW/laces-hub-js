import Laces from "..";
import { Paginated } from "../util/types";
import { Repository, RepositoryData, RepositoryPartial, RepositoryView } from "./types";

/** A repository contains publications and files. */
export namespace Repositories {
  /**
   * @description Returns a collection of all repositories for which authenticated user has acces.
   *
   * @tags Repositories
   * @name GetRepositoriesWithAccessStatus
   * @summary Return repositories
   * @request GET:/api/v3/repositories
   */
  export async function getRepositoriesWithAccessStatus() {
    return Laces.API.asJSON<RepositoryView[]>(`/api/v3/repositories`);
  }

  /**
   * @description Creates a new repository.
   *
   * @tags Repositories
   * @name CreateRepositoryInGroup
   * @summary Create repository
   * @request POST:/api/v3/repositories
   */
  export async function createRepositoryInGroup(body: RepositoryData) {
    return Laces.API.asJSON<Repository>(`/api/v3/repositories`, {
      method: "POST",
      body: JSON.stringify(body),
      type: "application/json",
    });
  }

  /**
   * @description Updates the repository only with the provided info, omits the rest.
   *
   * @tags Repositories
   * @name UpdateRepository
   * @summary Update repository partially
   * @request PATCH:/api/v3/repositories/{id}
   */
  export async function updateRepository(id: string, body: RepositoryPartial) {
    return Laces.API.asJSON<RepositoryData>(`/api/v3/repositories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      type: "application/json",
    });
  }

  /**
   * @description Returns the repository details specified by the given id.
   *
   * @tags Repositories
   * @name GetRepositoryMetadata
   * @summary Return repository
   * @request GET:/api/v3/repositories/{id}
   */
  export async function getRepositoryMetadata(repositoryId: string) {
    return Laces.API.asJSON<RepositoryData>(`/api/v3/repositories/${repositoryId}`);
  }

  /**
   * @description Deletes the repository specified by the given id.
   *
   * @tags Repositories
   * @name DeleteRepository
   * @summary Delete repository
   * @request DELETE:/api/v3/repositories/{id}
   */
  export async function deleteRepository(repositoryId: string) {
    return Laces.API.asJSON<Repository>(`/api/v3/repositories/${repositoryId}`, {
      method: "DELETE",
    });
  }

  /**
   * @description Returns a collection of all repositories within the group identified by the given id.
   *
   * @tags Repositories
   * @name GetRepositories
   * @summary Return repositories within group
   * @request GET:/api/v3/groups/{groupId}/repositories
   */
  export async function getRepositories(
    groupId: string,
    query?: {
      searchText?: string;
      sortBy?: string;
      sortDirection?: "ASC" | "DESC";
      page?: number;
      pageSize?: number;
    }
  ): Promise<Paginated<RepositoryData>> {
    return Laces.API.asPaginatedJSON<RepositoryData>(`/api/v3/groups/${groupId}/repositories`, {
      query: query,
    });
  }
}
