import { MarkRequired } from "../types/types";
import Endpoint from "./endpoint";
import {
  FileFormat,
  PublicationView,
  QueryFormat,
  RepositoryInfo,
  SelectQueryFormat,
} from "./responseTypes";
import { RequestInit } from "node-fetch";

export class Publication {
  private _repo_publications: Record<RepositoryInfo["id"], PublicationView[]>;

  constructor() {
    this._repo_publications = {};
  }

  /** Returns accessible publication in an accessible repository. */
  public async getInRepository(
    repository: MarkRequired<Partial<RepositoryInfo>, "id">
  ): Promise<PublicationView[]> {
    if (Object.keys(this._repo_publications).includes(repository.id))
      return this._repo_publications[repository.id];

    const response = await Endpoint.fetch(`/api/v2/repositories/${repository.id}/publications`);
    this._repo_publications[repository.id] = await response.json();
    return this._repo_publications[repository.id];
  }

  public async asRdf(
    publication: MarkRequired<Partial<PublicationView>, "id">,
    format: FileFormat = "text/turtle"
  ) {
    const endpoint = publication.id.replace(/https?:\/\/hub\.laces\.tech/, "");
    const response = await Endpoint.fetch(endpoint, { headers: { accept: format } });

    if (!response.ok) {
      throw Error(
        `${response.status}: Could not fetch RDF of publication {id: ${
          publication.id
        }} -- ${await response.text()}`
      );
    }

    return await response.text();
  }

  /** Laces only supports SELECT queries. */
  public async doSparqlSelect(
    publication: MarkRequired<Partial<PublicationView>, "id">,
    query: string,
    format?: SelectQueryFormat
  ) {
    const ctx: RequestInit = {
      method: "post",
      body: query,
      headers: {
        "Content-Type": "application/sparql-query",
        Accept: format ?? ("text/csv" as QueryFormat),
      },
    };

    const response = await Endpoint.fetch(`/api/v2/publications/sparql?id=${publication.id}`, ctx);

    if (!response.ok) {
      throw Error(
        `${response.status}: Could not query publication {id: ${
          publication.id
        }} -- ${await response.text()}`
      );
    }

    return response.text();
    // default-graph-uri => add for each graph URI that should be combined in the default union graph.
  }
}

export default Publication;
