import Laces from "..";
import { FromAPI, ReadOnlyLacesResource } from "../util/types";
import { UserView } from "./types";

export class User implements ReadOnlyLacesResource<UserView> {
  cache: UserView;
  id: string;

  constructor(id: string, data?: UserView) {
    this.id = id;
    this.cache = { ...data } as UserView;
  }

  async getInfo(refresh?: boolean): Promise<FromAPI<UserView>> {
    if (refresh || !this.cache) {
      this.cache = await Laces.API.User.GetUser(this.id);
    }
    return this.cache as FromAPI<UserView>;
  }
}
