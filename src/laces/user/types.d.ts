import { AccessRole } from "../group/types";

export interface UserView {
  id: string;
  email: string;
  fullName: string;
  userName: string;
  organisation: string;
  active: boolean;
  adminUser: boolean;
  roles: AccessRole[];
}
