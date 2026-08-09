import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProgress } from "./useProgress";

const key = "nora-lynord-progress";

describe("useProgress", () => {
  beforeEach(() => localStorage.clear());

  it("recovers from malformed persisted JSON", () => {
    localStorage.setItem(key, "{not-json");
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress).toMatchObject({ stars: 0, unlockedWorlds: [1] });
  });

  it("sanitises invalid persisted values", () => {
    localStorage.setItem(key, JSON.stringify({
      stars: -10,
      unlockedWorlds: [1, 2, 2, 49, "3"],
      completedWorlds: [2, 2, -1, 49, "4"],
      hardWords: ["kat", "kat", 42],
    }));
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress.stars).toBe(0);
    expect(result.current.progress.unlockedWorlds).toEqual([1, 2, 3]);
    expect(result.current.progress.completedWorlds).toEqual([2]);
    expect(result.current.progress.hardWords).toEqual(["kat"]);
  });

  it("awards world completion only once and unlocks the next world", () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.completeWorld(1));
    act(() => result.current.completeWorld(1));
    expect(result.current.progress.completedWorlds).toEqual([1]);
    expect(result.current.progress.unlockedWorlds).toContain(2);
    expect(result.current.progress.stars).toBe(10);
  });

  it("does not unlock world 49", () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.completeWorld(48));
    expect(result.current.progress.unlockedWorlds).not.toContain(49);
  });

  it("makes story completion idempotent", () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.completeStory("story-1"));
    act(() => result.current.completeStory("story-1"));
    expect(result.current.progress.stars).toBe(10);
    expect(result.current.progress.completedStories).toEqual(["story-1"]);
  });
});
