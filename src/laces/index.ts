import { config } from "dotenv";
import { Files } from "../resource/file/api";
import { getTopGroups } from "../resource/group";
import { Groups } from "../resource/group/api";
import { Publications } from "../resource/publication/api";
import { getRepositoriesWithAccessStatus } from "../resource/repository";
import { Repositories } from "../resource/repository/api";
import { User } from "../resource/user";
import { Users } from "../resource/user/api";
import { fileFromPath, groupFromPath, publicationFromPath, repositoryFromPath } from "../util/path";
import { default as Endpoint } from "./endpoint/fetch";
config();

/** The Laces Hub */
const Laces = {
  User: User,
  Group: groupFromPath,
  Repository: repositoryFromPath,
  File: fileFromPath,
  Publication: publicationFromPath,

  groups: getTopGroups,
  repositories: getRepositoriesWithAccessStatus,

  /** A collection of API calls to the platform. */
  API: {
    asJSON: Endpoint.asJson,
    asPaginatedJSON: Endpoint.asPaginatedJson,
    asStream: Endpoint.asStream,

    User: Users,
    Group: Groups,
    Repository: Repositories,
    File: Files,
    Publication: Publications,
  },
};

export default Laces;
