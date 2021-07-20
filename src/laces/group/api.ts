import Laces from "..";
import { Paginated } from "../util/types";
import { GroupMutationView as Group, GroupMutationView, GroupView, Updateable } from "./types";

/** Groups organize publications and can contain subgroups. */
export namespace Groups {
  /**
   * @description Returns a collection with all top-level groups.
   *
   * @tags Groups
   * @name GetTopGroups
   * @summary Return top-level groups
   * @request GET:/api/v3/groups
   */
  export async function GetTopGroups(query?: {
    searchText?: string;
    sortBy?: "name" | "description" | "createdOn" | "modifiedOn";
    sortDirection?: "ASC" | "DESC";
    page?: number;
    pageSize?: number;
  }): Promise<Paginated<GroupMutationView>> {
    return await Laces.API.asPaginatedJSON<GroupMutationView>(`/api/v3/groups`, {
      query: query,
    });
  }
  /**
   * @description Creates a new top-level group.
   *
   * @tags Groups
   * @name CreateTopGroup
   * @summary Create top-level group
   * @request POST:/api/v3/groups
   */
  export async function CreateTopGroup(body: Group) {
    return Laces.API.asJSON<Group>(`/api/v3/groups`, {
      method: "POST",
      body: JSON.stringify(body),
      type: "application/json",
    });
  }

  /**
   * @description Returns the group specified by the specfied id.
   *
   * @tags Groups
   * @name GetGroupDetails
   * @summary Return group
   * @request GET:/api/v3/groups/{id}
   */
  export async function GetGroupDetails(id: string) {
    return Laces.API.asJSON<GroupView>(`/api/v3/groups/${id}`);
  }

  /**
   * @description Deletes the group specified by the specfied id.
   *
   * @tags Groups
   * @name DeleteGroup
   * @summary Delete group
   * @request DELETE:/api/v3/groups/{id}
   */
  export async function DeleteGroup(id: string) {
    return Laces.API.asJSON<Group>(`/api/v3/groups/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * @description Updates the groups only with the provided info, omits the rest.
   *
   * @tags Groups
   * @name UpdatePartialGroup
   * @summary Update group partially
   * @request PATCH:/api/v3/groups/{id}
   */
  export async function UpdatePartialGroup(id: string, body: Updateable) {
    return Laces.API.asJSON<Group>(`/api/v3/groups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      type: "application/json",
    });
  }

  /**
   * @description Cretes a group within - or subgroup of - the group specified by the given id.
   *
   * @tags Groups
   * @name CreateSubGroup
   * @summary Create subgroup
   * @request POST:/api/v3/groups/{id}
   */
  export async function CreateSubGroup(parentGroupId: string, body: GroupView) {
    return Laces.API.asJSON<Group>(`/api/v3/groups/${parentGroupId}`, {
      method: "POST",
      body: JSON.stringify(body),
      type: "application/json",
    });
  }

  /**
   * @description Returns all (direct) subgroups of the group specified by the given id.
   *
   * @tags Groups
   * @name GetSubGroups
   * @summary Return subgroups
   * @request GET:/api/v3/groups/{id}/subgroups
   */
  export async function GetSubGroups(
    id: string,
    query?: {
      searchText?: string;
      sortBy?: "name" | "description" | "createdOn" | "modifiedOn";
      sortDirection?: "ASC" | "DESC";
      page?: number;
      pageSize?: number;
    }
  ) {
    return Laces.API.asPaginatedJSON<GroupMutationView>(`/api/v3/groups/${id}/subgroups`, {
      query: query,
    });
  }
}
