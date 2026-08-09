import { describe, expect, it } from "vitest";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  it("returns the same items without mutating the input", () => {
    const input = [1, 2, 3, 4];
    const result = shuffle(input, () => 0.5);
    expect(input).toEqual([1, 2, 3, 4]);
    expect(result).toHaveLength(4);
    expect([...result].sort()).toEqual(input);
  });

  it("can be deterministic with an injected RNG", () => {
    const rng = () => 0;
    expect(shuffle([1, 2, 3], rng)).toEqual([2, 3, 1]);
  });
});
