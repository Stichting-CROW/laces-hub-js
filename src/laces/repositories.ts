import Endpoint from "./endpoint";
import { RepositoryInfo } from "./responseTypes";

export class Repository {
  private _repositories: Record<RepositoryInfo["id"], RepositoryInfo>;
  private _hasFetchedRepositories = false;

  constructor() {
    this._repositories = {};
  }

  /** Returns accessible repositories. */
  public async all(): Promise<RepositoryInfo[]> {
    if (this._hasFetchedRepositories) return Object.values(this._repositories);

    const response = await Endpoint.fetch("/api/v2/repositories");
    this._repositories = await response.json();

    this._hasFetchedRepositories = true;
    return Object.values(this._repositories);
  }
}

export default Repository;
