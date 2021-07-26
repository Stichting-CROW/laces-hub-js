import Laces from "../../laces";
import { Repository } from "../repository";
import { RepositoryData } from "../repository/types";
import { allPages, allPagesId } from "../../laces/util/paginated";
import { FromAPI, LacesResource } from "../../laces/util/types";
import { ConfirmDeletion } from "../types";
import {
  GroupMutationView as GroupMutationView,
  GroupView,
  Updateable as GroupUpdateView,
} from "./types";

/**
 * A directory that contains other groups or a {@link Repository}.
 */
export class Group
  implements LacesResource<GroupView | GroupMutationView, GroupUpdateView | GroupMutationView>
{
  id: string;
  cache: Partial<GroupMutationView>;

  public constructor(id: string, data?: Partial<GroupMutationView>) {
    this.id = id;
    this.cache = { ...data };
  }

  async getInfo(refresh: boolean = false): Promise<FromAPI<GroupView>> {
    if (refresh || !this.cache) {
      this.cache = await Laces.API.Group.GetGroupDetails(this.id);
    }
    return this.cache as FromAPI<GroupView>;
  }

  async delete(confirm: ConfirmDeletion): Promise<GroupMutationView | void> {
    if (!confirm.confirm) return;
    return await Laces.API.Group.DeleteGroup(this.id);
  }

  async update(data: GroupUpdateView, _payload?: never): Promise<GroupMutationView> {
    return await Laces.API.Group.UpdatePartialGroup(this.id, data);
  }

  async contents(): Promise<{ subgroups: Group[]; repositories: Repository[] }> {
    return {
      subgroups: await this.subgroups(),
      repositories: await this.repositories(),
    };
  }

  /** Returns all subgroups within this group. */
  async subgroups(): Promise<Group[]> {
    const data = await allPagesId<GroupMutationView>(Laces.API.Group.GetSubGroups, this.id);
    return data.map((info) => new Group(info.id, info));
  }

  /** Returns all repositories within this group. */
  async repositories(): Promise<Repository[]> {
    const data = await allPagesId<RepositoryData>(Laces.API.Repository.getRepositories, this.id);
    return data.map((info) => new Repository(info.id, info));
  }

  /** Create top-level group. */
  static async createTopGroup(metadata: Omit<GroupMutationView, "id">): Promise<Group> {
    const response = await Laces.API.Group.CreateTopGroup(metadata);
    return new Group(response.id, response);
  }

  /** Create subgroup. */
  async createSubgroup(data: Omit<GroupMutationView, "id">): Promise<Group> {
    const response = await Laces.API.Group.CreateSubGroup(this.id, data);
    return new Group(response.id, response);
  }
}

/**
 * Returns all accessible top-level groups.
 * @name GetTopGroups
 */
export async function getTopGroups(): Promise<Group[]> {
  const data = await allPages<GroupMutationView>(Laces.API.Group.GetTopGroups);

  return data.map((info) => new Group(info.id, info));
}
