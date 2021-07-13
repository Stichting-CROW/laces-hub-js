import { MarkRequired } from "../types/types";
import { Endpoint } from "./endpoint";
import { GroupView, HierarchicalGroup, Paginated } from "./responseTypes";

export class Group {
  private _groups: Record<GroupView["id"], GroupView>;
  private _hasFetchedGroups = false;

  constructor() {
    this._groups = {};
  }

  public async all(page: number = 0): Promise<GroupView[]> {
    if (this._hasFetchedGroups) return Object.values(this._groups);

    const response = await Endpoint.fetch(`/api/v2/groups?page=${page}`);
    const json = (await response.json()) as Paginated<GroupView>;

    for (const group of json.contents) {
      this._groups[group.id] = group;
      if (group.subgroupCount) {
        await this.allSubgroups(group);
      }
    }

    if (json.total != json.contents.length) {
      await this.all(page + 1);
    }

    this._hasFetchedGroups = true;
    return Object.values(this._groups);
  }

  private async allSubgroups(
    ofGroup: MarkRequired<Partial<GroupView>, "id">,
    page: number = 0
  ): Promise<void> {
    const response = await Endpoint.fetch(`/api/v2/groups/${ofGroup.id}/subgroups?page=${page}`);
    const json = (await response.json()) as Paginated<GroupView>;

    for (const group of json.contents) {
      this._groups[group.id] = group;
      if (group.subgroupCount) {
        await this.allSubgroups(group);
      }
    }

    if (json.total != json.contents.length) {
      await this.allSubgroups(ofGroup, page + 1);
    }
  }

  /** Builds a hierarchy of Group`s. */
  public asTree(ancestor: MarkRequired<Partial<GroupView>, "id">): HierarchicalGroup {
    const tree = Object.assign({}, this._groups[ancestor.id]) as HierarchicalGroup; // copy
    tree.children = [];
    for (const [__, potentialChild] of Object.entries(this._groups)) {
      if (ancestor.id === potentialChild.parentId) {
        const hydratedChild = this.asTree(potentialChild);
        tree.children.push(hydratedChild);
      }
    }
    return tree;
  }
}

export default Group;
