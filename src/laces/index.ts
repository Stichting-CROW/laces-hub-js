import { config } from "dotenv";
import { default as Endpoint } from "./endpoint/fetch";
import { Files } from "../resource/file/api";
import { FileResource } from "../resource/file";
import { Groups } from "../resource/group/api";
import { getTopGroups, Group } from "../resource/group";
import { Publications } from "../resource/publication/api";
import { RdfPublication } from "../resource/publication";
import { Repositories } from "../resource/repository/api";
import { getRepositoriesWithAccessStatus, Repository } from "../resource/repository";
import { Users } from "../resource/user/api";
import { User } from "../resource/user";
import { fileFromPath, groupFromPath, publicationFromPath, repositoryFromPath } from "../util/path";
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
