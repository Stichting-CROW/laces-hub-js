import Laces from "../../laces";
import { FromAPI, ReadOnlyLacesResource } from "../../laces/util/types";
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
    if (refresh || Object.keys(this.cache).length === 0) {
      this.cache = await Laces.API.User.GetUser(this.id);
    }
    return this.cache as FromAPI<UserView>;
  }

  /** Try to retreive the User that provided the token. */
  static async me(): Promise<undefined | User> {
    const groups = await Laces.groups();
    const userGroup = groups.find(async (group) => (await group.getInfo()).type == "USER");
    if (!userGroup) return;
    const ownerId = (await userGroup.getInfo(true)).owner;
    return new User(ownerId);
  }
}
