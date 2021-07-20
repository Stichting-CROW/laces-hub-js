import Laces from "..";
import { EndpointError } from "../endpoint/errors";
import { FileResource } from "../file/resource";
import { Group } from "../group/resource";
import { RdfPublication } from "../publication/resource";
import { Repository } from "../repository/resource";

export class PathError extends EndpointError {}

/** Find a group via a path. */
export async function groupFromPath(path: string): Promise<Group | undefined> {
  const pathComponents = path.split("/");

  let parentGroup;
  let children = await Laces.groups();

  // Iterate over subgroups until path is matched.
  for (const pathComponent of pathComponents) {
    let child = children.find((info) => info.cache.pathSegment === pathComponent);
    if (!child) return;

    parentGroup = child;
    children = await child.subgroups();
  }

  return parentGroup;
}

/** Get publication at path. */
export async function publicationFromPath(path: string): Promise<RdfPublication | undefined> {
  const pathComponents = path.split("/");
  pathComponents.pop();

  const repo = await repositoryFromPath(pathComponents.join("/"));
  if (!repo) return;
  return (await repo.publications()).find((info) => info.cache.uri?.startsWith(path));
}

/** Get file at path. */
export async function fileFromPath(path: string): Promise<FileResource | undefined> {
  const pathComponents = path.split("/");
  const filename = pathComponents.pop();

  const repo = await repositoryFromPath(pathComponents.join("/"));
  if (!repo) return;
  return (await repo.files()).find((info) => info.cache.name === filename);
}

/** Get repository at path. */
export async function repositoryFromPath(path: string): Promise<Repository | undefined> {
  // First option is to find from #fullPath
  const allRepos = await Laces.repositories();
  return allRepos.find((repo) => repo.cache.fullPath === path);
}
