import { describe, expect, it, vi, beforeEach } from "vitest";
import { playWord, stopAudio, toFilename } from "./useAudio";

describe("useAudio", () => {
  beforeEach(() => { vi.restoreAllMocks(); stopAudio(); });

  it("maps Danish characters to stable filenames", () => {
    expect(toFilename("mælk")).toBe("maelk");
    expect(toFilename("øje")).toBe("oeje");
    expect(toFilename("åben")).toBe("aaben");
  });

  it("uses the audio element for a word", () => {
    const play = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    playWord("mælk");
    expect(play).toHaveBeenCalled();
  });

  it("stops speech and cached audio without throwing", () => {
    expect(() => stopAudio()).not.toThrow();
  });
});
