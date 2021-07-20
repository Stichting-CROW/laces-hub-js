import { config } from "dotenv";
import { default as Endpoint } from "./endpoint/fetch";
import { Files } from "./file/api";
import { FileResource } from "./file/resource";
import { Groups } from "./group/api";
import { getTopGroups, Group } from "./group/resource";
import { Publications } from "./publication/api";
import { RdfPublication } from "./publication/resource";
import { Repositories } from "./repository/api";
import { getRepositoriesWithAccessStatus, Repository } from "./repository/resource";
import { Users } from "./user/api";
import { User } from "./user/resource";
import { fileFromPath, groupFromPath, publicationFromPath, repositoryFromPath } from "./util/path";
config();

Endpoint.envCheck();

/** The Laces Hub */
const Laces = {
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

  User: User,
  Group: Group,
  Repository: Repository,
  File: FileResource,
  Publication: RdfPublication,

  /** Find a resource by its path. */
  byPath: {
    group: groupFromPath,
    repository: repositoryFromPath,
    file: fileFromPath,
    publication: publicationFromPath,
  },

  groups: getTopGroups,
  repositories: getRepositoriesWithAccessStatus,
};

export default Laces;
