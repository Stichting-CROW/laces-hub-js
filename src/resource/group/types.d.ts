import { MarkRequired } from "ts-essentials";
import { Paginated } from "../util/types";
import { CreatedModifiedResource } from "../types";

export type Visibility = "PRIVATE" | "PUBLIC" | "USER";
export type AccessRole = "VIEWER" | "PUBLISHER" | "MANAGER" | "OWNER";

export interface BaseGroup {
  description?: string;
  name: string;
  owner?: string;
  parentId?: string;
  type: Visibility;
}

export interface Updateable extends Partial<BaseGroup> {}

export interface GroupMutationView extends BaseGroup, CreatedModifiedResource {
  id?: string;
  pathSegment?: string;
}

export interface GroupView extends BaseGroup, CreatedModifiedResource {
  id?: string;
  path?: string;
  repositoryCount?: number;
  role?: AccessRole;
  subgroupCount?: number;
}
