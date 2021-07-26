import { AccessRole, GroupMutationView, GroupView, ICreatedModified } from "../group/types";
import { UserView } from "../user/types";

export interface RepositoryPartial {
  description?: string;
  name?: string;
  visible?: boolean;
}

export interface RepositoryPage {
  contents: RepositoryData[];
  total: number;
}

export interface Repository extends ICreatedModified {
  description?: string;
  id?: string;
  name: string;
  parentId: GroupView["id"];
  pathSegment: string;
  publiclyVisible?: boolean;
}

export interface RepositoryView {
  accessRequestId?: string;
  description?: string;
  fullPath?: string;
  id: string;
  name: string;
  owner: UserView["fullName"];
  publicVisibility?: boolean;
  status: RepositoryStatus;
}
export interface RepositoryData extends ICreatedModified {
  description?: string;
  id?: string;
  name: string;
  owner?: UserView["id"];
  parentId: GroupView["id"];
  pathSegment: string;
  publicationCount?: number;
  visible: boolean;
}

export type VersionDeltaFormat = "application/n-quads" | "application/trig";

export type RepositoryStatus = "PENDING_PUBLISHER" | "PENDING_MANAGER" | "DENIED" | AccessRole;
