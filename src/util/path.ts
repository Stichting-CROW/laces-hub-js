import { assert } from "ts-essentials";
import Laces from "../laces";
import { LacesError } from "../laces/endpoint/errors";
import { FileResource } from "../resource/file";
import { Group } from "../resource/group";
import { RdfPublication } from "../resource/publication";
import { Repository } from "../resource/repository";

export class PathError extends LacesError {}

/** Find a group via a path. */
export async function groupFromPath(path: string): Promise<Group> {
  const pathComponents = path.split("/");
  assert(pathComponents.length > 0, `Cannot construct path from "${path}"`);

  let children = await Laces.groups();
  if (children.length < 1) throw new PathError(`No groups (check token permissions).`);

  let parentGroup: Group = children[0];

  // Iterate over subgroups until path is matched.
  for (const pathComponent of pathComponents) {
    let child = children.find((info) => info.cache.pathSegment === pathComponent);
    if (!child) throw new PathError(`Group "${pathComponent}" not found`);

    parentGroup = child;
    children = await child.subgroups();
  }

  return parentGroup;
}

/** Get publication at path. */
export async function publicationFromPath(path: string): Promise<RdfPublication> {
  const pathComponents = path.split("/");
  const pubName = pathComponents.pop();

  const repo = await repositoryFromPath(pathComponents.join("/"));
  const publications = await repo.publications();
  const localName = path.replace(RegExp("https?://hub\\.laces\\.tech"), "");
  const pub = publications.find((info) => info.cache.uri === localName);
  if (!pub)
    throw new PathError(`No publication "${pubName}" in repository "${pathComponents.join("/")}"`);
  return pub;
}

/** Get file at path. */
export async function fileFromPath(path: string): Promise<FileResource> {
  const pathComponents = path.split("/");
  const filename = pathComponents.pop();

  const repo = await repositoryFromPath(pathComponents.join("/"));
  const files = await repo.files();
  const file = files.find((info) => info.cache.name === filename);
  if (!file)
    throw new PathError(`No file "${filename}" in repository "${pathComponents.join("/")}"`);
  return file;
}

/** Get repository at path. */
export async function repositoryFromPath(path: string): Promise<Repository> {
  // First option is to find from #fullPath
  const allRepos = await Laces.repositories();
  const localName = path.replace(RegExp("https?://hub\\.laces\\.tech/"), "");
  const repo = allRepos.find((repo) => repo.cache.fullPath === localName);
  if (!repo) throw new PathError(`No repository at path "${path}"`);
  return repo;
}
