import { default as FormData } from "form-data";
import { assert } from "ts-essentials";
import Laces from "../../laces";
import { FromAPI, LacesResource } from "../../laces/util/types";
import { publicationFromPath } from "../../util/path";
import { ConfirmDeletion } from "../types";
import {
  FileFormat,
  NewPublicationMetadata,
  PublicationUpdateable,
  PublicationView,
  SelectQueryFormat,
} from "./types";

export class RdfPublication
  implements LacesResource<PublicationView, PublicationUpdateable | NewPublicationMetadata>
{
  id: string;
  cache: Partial<PublicationView>;
  isVersioned?: boolean;

  constructor(id: string, info?: Partial<PublicationView>) {
    this.id = id;
    this.cache = { ...info };

    if (info) {
      this.isVersioned = !!info.versions;
    }
  }

  static async byPath(path: string): Promise<RdfPublication> {
    return publicationFromPath(path);
  }

  async getInfo(refresh?: boolean): Promise<FromAPI<PublicationView>> {
    if (refresh || !this.cache) {
      this.cache = await Laces.API.Publication.GetPublicationMetaData(this.id);
      this.isVersioned = !!this.cache.versions;
    }
    return this.cache as FromAPI<PublicationView>;
  }

  async delete(confirm: ConfirmDeletion): Promise<void | FromAPI<PublicationView>> {
    if (!confirm.confirm) return;
    return await Laces.API.Publication.DeletePublication(this.id);
  }

  async update(info: PublicationUpdateable): Promise<FromAPI<PublicationView>>;
  async update(info: NewPublicationMetadata, payload: Buffer): Promise<FromAPI<PublicationView>>;
  async update(
    info: PublicationUpdateable | NewPublicationMetadata,
    payload?: Buffer
  ): Promise<FromAPI<PublicationView>> {
    if (!payload) {
      return await Laces.API.Publication.UpdatePublicationMetadata(
        this.id,
        info as PublicationUpdateable
      );
    }

    if ((await this.getInfo()) && this.isVersioned) {
      if (this.cache.versioningMode == "CUSTOM")
        assert((info as NewPublicationMetadata).versionLabel);
    }
    const body = new FormData();
    body.append("meta-data", JSON.stringify(info));
    body.append("Content", payload);

    return await Laces.API.Publication.UpdatePublication(this.id!, body);
  }

  async contents(format?: FileFormat): Promise<NodeJS.ReadableStream> {
    return Laces.API.Publication.GetPublicationContent(this.id, format ?? "text/turtle");
  }

  /**
   * Perform a SPARQL query.
   *
   * @description Laces only supports SELECT queries.
   * @param {SelectQueryFormat} options.format Result format of query.
   * @param {string[]} options.additionalDefaultGraphs Add for each graph URI that should be combined in the default union graph.
   * @param {string} options.versionId Identifier of the version of the publication to query.
   */
  async sparqlSelect(
    query: string,
    options?: { format?: SelectQueryFormat; additionalDefaultGraphs?: string[]; versionId?: string }
  ): Promise<NodeJS.ReadableStream> {
    return await Laces.API.Publication.ExecuteSparqlQueryPost(
      options?.versionId ?? this.id,
      query,
      options?.format,
      options?.additionalDefaultGraphs
    );
  }
}
