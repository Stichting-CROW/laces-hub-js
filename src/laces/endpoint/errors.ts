import { Response } from "node-fetch";

export class EndpointError extends Error {
  constructor(response: Response | string) {
    super(JSON.stringify(response, null, "  "));
  }
}
