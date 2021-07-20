import FormData from "form-data";
import Laces from "..";
import { VersionDeltaFormat } from "../repository/types";
import { FileFormat, NewPublicationMetadata, PublicationView, SelectQueryFormat } from "./types";

/** Publications are RDF files, exposed as static files and as a SPARQL endpoint. */
export namespace Publications {
  /**
   * @description Returns the publications within the repository with the specified id
   *
   * @tags Publications
   * @name GetRepositoryPublications
   * @summary Return publications within repository
   * @request GET:/api/v3/repositories/{repositoryId}/publications
   */
  export async function GetRepositoryPublications(repositoryId: string) {
    return await Laces.API.asJSON<PublicationView[]>(
      `/api/v3/repositories/${repositoryId}/publications`
    );
  }

  /**
   * @description Creates a new publication within repository specified by id, using the provided payload.
   *
   * @tags Publications
   * @name CreatePublication
   * @summary Create publication
   * @request POST:/api/v3/repositories/{repositoryId}/publications
   */
  export async function CreatePublication(
    repositoryId: string,
    data: { metadata: NewPublicationMetadata; content: Buffer }
  ) {
    const body = new FormData();
    body.append("metadata", JSON.stringify(data.metadata));
    body.append("content", data.content);

    return await Laces.API.asJSON<PublicationView>(
      `/api/v3/repositories/${repositoryId}/publications`,
      {
        method: "post",
        type: "multipart/form-data",
        body: body,
      }
    );
  }

  /**
   * @description Updates the publication using the given payload.
   *
   * @tags Publications
   * @name UpdatePublication
   * @summary Update publication
   * @request PUT:/api/v3/repositories/{repositoryId}/publications
   */
  export async function UpdatePublication(repositoryId: string, data: FormData) {
    return await Laces.API.asJSON<PublicationView>(
      `/api/v3/repositories/${repositoryId}/publications`,
      {
        method: "put",
        type: "multipart/form-data",
        body: data,
      }
    );
  }

  /**
   * @description Returns the meta-data of the publication specified by the given id.
   *
   * @tags Publications
   * @name GetPublicationMetaData
   * @summary Return publication's meta-data
   * @request GET:/api/v3/publications/{id}
   */
  export async function GetPublicationMetaData(publicationId: PublicationView["id"]) {
    return await Laces.API.asJSON<PublicationView>(`/api/v3/publications/${publicationId}`); // TODO: Check type
  }

  /**
   * @description Updates the publication only with the provided info.
   *
   * @tags Publications
   * @name UpdatePublicationMetadata
   * @summary Update publication's meta-data
   * @request PATCH:/api/v3/publications/{id}
   */
  export async function UpdatePublicationMetadata(
    publicationId: PublicationView["id"],
    query?: { publisher?: string; owner?: string; description?: string }
  ) {
    return await Laces.API.asJSON<PublicationView>(`/api/v3/publications/${publicationId}`, {
      method: "patch",
      query: query,
    });
  }

  /**
   * @description Deletes the publication specified by the given id.
   *
   * @tags Publications
   * @name DeletePublication
   * @summary Delete publication
   * @request DELETE:/api/v3/publications/{id}
   */
  export async function DeletePublication(publicationId: string) {
    return await Laces.API.asJSON<PublicationView>(`/api/v3/publications/${publicationId}`, {
      method: "delete",
    });
  }

  /**
   * @description Returns the delta between two publications as either TriG or N-Quads format. Using the publications A and B, the delta is calculated using B - A.
   *
   * @tags Publications
   * @name FindDeltaForPublicationVersions
   * @summary Return delta between publications
   * @request GET:/api/v3/publications.delta
   */
  export async function FindDeltaForPublicationVersions(
    query: {
      version1: string;
      version2: string;
    },
    format: VersionDeltaFormat
  ) {
    return await Laces.API.asStream(`/api/v3/publications.delta`, {
      query: { version1: query.version1, version2: query.version2 },
      accept: format,
    });
  }

  /**
   * @description Returns the RDF content of the publication specified by the given id.
   *
   * @tags Publications
   * @name GetPublicationContent
   * @summary Get publication content
   * @request GET:/api/v3/publications/{id}/statements
   */
  export async function GetPublicationContent(id: string, accept: FileFormat) {
    return await Laces.API.asStream(`/api/v3/publications/${id}/statements`, {
      accept: accept ?? "text/turtle",
    });
  }

  /**
   * @description Performs a SPARQL query using the query specified in the body payload.
   *
   * @tags Publications
   * @name ExecuteSparqlQueryPost
   * @summary Execute SPARQL query using POST
   * @request POST:/api/v3/publications/{id}/sparql
   */
  export async function ExecuteSparqlQueryPost(
    id: string,
    query: string,
    format?: SelectQueryFormat,
    additionalDefaultGraphs?: string[]
  ) {
    const headers = additionalDefaultGraphs?.map((uri) => ["default-graph-uri", uri]);
    return await Laces.API.asStream(`/api/v3/publications/${id}/sparql`, {
      type: "application/sparql-query",
      body: query,
      accept: format ?? "text/csv",
      rawHeaders: headers,
    });
  }
}
