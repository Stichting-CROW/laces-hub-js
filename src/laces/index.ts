import { config } from "dotenv";
config();

import { default as Endpoint } from "./endpoint";
import Group from "./groups";
import Publication from "./publications";
import Repository from "./repositories";

Endpoint.envCheck();

const Laces = {
  groups: new Group(),
  repositories: new Repository(),
  publications: new Publication(),
  fetch: Endpoint.fetch,
};

export default Laces;
