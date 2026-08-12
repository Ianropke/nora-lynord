import { describe, expect, it } from "vitest";
import { regions, worlds } from "./words";

describe("word-trainer data integrity", () => {
  it("keeps the six language levels and twelve routes per level", () => {
    expect(regions.map((region) => region.id)).toEqual([
      "kanto",
      "johto",
      "hoenn",
      "sinnoh",
      "unova",
      "kalos",
    ]);
    expect(regions.every((region) => region.worlds.length === 12)).toBe(true);
    expect(worlds).toHaveLength(72);
  });

  it("keeps route IDs contiguous and every route at ten words", () => {
    expect(worlds.map((world) => world.id)).toEqual(
      Array.from({ length: 72 }, (_, index) => index + 1),
    );
    expect(worlds.every((world) => world.words.length === 10)).toBe(true);
  });

  it("keeps word IDs and word text unique across all routes", () => {
    const wordIds = worlds.flatMap((world) => world.words.map((word) => word.id));
    const wordTexts = worlds.flatMap((world) => world.words.map((word) => word.text));

    expect(wordIds).toHaveLength(720);
    expect(new Set(wordIds).size).toBe(wordIds.length);
    expect(wordTexts).toHaveLength(720);
    expect(new Set(wordTexts).size).toBe(wordTexts.length);
  });
});
