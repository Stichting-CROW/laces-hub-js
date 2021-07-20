import Laces from "..";
import { FromAPI, ReadOnlyLacesResource } from "../util/types";
import { UserView } from "./types";

/** A user account, acting directly or through an tokened application. */
export class User implements ReadOnlyLacesResource<UserView> {
  cache: Partial<UserView>;
  id: string;

  constructor(id: string, data?: Partial<UserView>) {
    this.id = id;
    this.cache = { ...data };
  }

  async getInfo(refresh?: boolean): Promise<FromAPI<UserView>> {
    if (refresh || !this.cache) {
      this.cache = await Laces.API.User.GetUser(this.id);
    }
    return this.cache as FromAPI<UserView>;
  }
}
