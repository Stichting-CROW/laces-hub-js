import Laces from "../../laces";
import { UserView } from "./types";

/** People (via their access tokens) that modify the files and publication on Laces. */
export namespace Users {
  /** Non-exposed API from Laces. */
  export async function GetUser(userId: string) {
    return await Laces.API.asJSON<UserView>(`/user/${userId}`);
  }
}
