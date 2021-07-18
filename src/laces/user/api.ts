import Laces from "..";
import { UserView } from "./types";

export namespace Users {
  /** Non-exposed API from Laces. */
  export async function GetUser(userId: string) {
    return await Laces.API.asJSON<UserView>(`/users/${userId}`);
  }
}
