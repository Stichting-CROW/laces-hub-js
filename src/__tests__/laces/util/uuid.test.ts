import { Tuple } from "ts-essentials";
import { likeUUID } from "../../../laces/util/uuid";

describe("UUID", () => {
  test("matches uuid", () => {
    const values: Tuple<[string, boolean]> = [
      ["9268B002-F784-42ED-BA7F-08A74A735921", true],
      ["dd8d39e6-e34c-481f-a97f-c2625bd6852d", true],
      ["dd8d39e6e34c481fa97fc2625bd6852d", false],
      ["John Smith", false],
    ];
    for (const [value, expected] of values) {
      expect(likeUUID(value)).toBe(expected);
    }
  });
});
