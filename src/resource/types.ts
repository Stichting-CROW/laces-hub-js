import { UserView } from "./user/types";

/** Explicitely confirm deletion. */
export interface ConfirmDeletion {
  /** Function returns void if false */
  confirm: boolean;
}

/** Common interface for created/modified properties */
export interface CreatedModifiedResource {
  createdBy?: UserView["id"];
  createdOn?: number;
  modifiedBy?: UserView["id"];
  modifiedOn?: number;
}
