import { Response } from "node-fetch";

export class LacesError extends Error {}

export class EndpointError extends LacesError {
  constructor(response: Response | string) {
    super(JSON.stringify(response, null, "  "));
  }
}
