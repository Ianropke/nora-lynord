import { useState, useCallback, useEffect } from "react";

export interface Progress {
  unlockedWorlds: number[];
  stars: number;
  hardWords: string[];
  completedWorlds: number[];
  completedStories: string[];
  completedMathQuizzes: string[];
  completedTimesTables: number[];
  completedTimesTablesCount: number[];
}

const STORAGE_KEY = "nora-lynord-progress";
const CURRENT_PROGRESS_VERSION = 1;
const MAX_WORLD_ID = 72;

const defaultProgress: Progress = {
  unlockedWorlds: [1], stars: 0, hardWords: [], completedWorlds: [],
  completedStories: [], completedMathQuizzes: [], completedTimesTables: [], completedTimesTablesCount: [],
};

interface PersistedProgress { version: number; data: Progress }

function uniquePositiveIntegers(value: unknown, max: number): number[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is number => Number.isInteger(item) && item >= 1 && item <= max))];
}
function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))];
}
function validateProgress(value: unknown): Progress {
  if (!value || typeof value !== "object") return { ...defaultProgress };
  const c = value as Partial<Progress>;
  const stars = typeof c.stars === "number" && Number.isFinite(c.stars) && c.stars >= 0 ? Math.floor(c.stars) : 0;
  const completedWorlds = uniquePositiveIntegers(c.completedWorlds, MAX_WORLD_ID);
  const unlocked = new Set(uniquePositiveIntegers(c.unlockedWorlds, MAX_WORLD_ID));
  unlocked.add(1);
  for (const id of completedWorlds) { unlocked.add(id); if (id < MAX_WORLD_ID) unlocked.add(id + 1); }
  return {
    unlockedWorlds: [...unlocked].sort((a, b) => a - b), stars,
    hardWords: uniqueStrings(c.hardWords), completedWorlds,
    completedStories: uniqueStrings(c.completedStories), completedMathQuizzes: uniqueStrings(c.completedMathQuizzes),
    completedTimesTables: uniquePositiveIntegers(c.completedTimesTables, 20),
    completedTimesTablesCount: uniquePositiveIntegers(c.completedTimesTablesCount, 20),
  };
}
function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "version" in parsed && "data" in parsed) {
      const p = parsed as Partial<PersistedProgress>;
      return p.version === CURRENT_PROGRESS_VERSION ? validateProgress(p.data) : { ...defaultProgress };
    }
    return validateProgress(parsed);
  } catch { return { ...defaultProgress }; }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const saveUpdater = useCallback((updater: (prev: Progress) => Progress) => {
    setProgress(prev => {
      const next = validateProgress(updater(prev));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CURRENT_PROGRESS_VERSION, data: next } satisfies PersistedProgress)); }
      catch (err) { console.warn("localStorage write failed", err); }
      return next;
    });
  }, []);
  const addStars = useCallback((count: number) => { if (Number.isFinite(count) && count > 0) saveUpdater(p => ({ ...p, stars: p.stars + Math.floor(count) })); }, [saveUpdater]);
  const addHardWord = useCallback((word: string) => saveUpdater(p => p.hardWords.includes(word) ? p : { ...p, hardWords: [...p.hardWords, word] }), [saveUpdater]);
  const removeHardWord = useCallback((word: string) => saveUpdater(p => ({ ...p, hardWords: p.hardWords.filter(w => w !== word) })), [saveUpdater]);
  const unlockWorld = useCallback((id: number) => {
    if (!Number.isInteger(id) || id < 1 || id > MAX_WORLD_ID) return;
    saveUpdater(p => p.unlockedWorlds.includes(id) ? p : { ...p, unlockedWorlds: [...p.unlockedWorlds, id].sort((a,b)=>a-b) });
  }, [saveUpdater]);
  const completeWorld = useCallback((id: number) => {
    if (!Number.isInteger(id) || id < 1 || id > MAX_WORLD_ID) return;
    saveUpdater(p => {
      if (p.completedWorlds.includes(id)) return p;
      const unlocked = [...p.unlockedWorlds];
      if (id < MAX_WORLD_ID && !unlocked.includes(id + 1)) unlocked.push(id + 1);
      return { ...p, completedWorlds: [...p.completedWorlds, id], unlockedWorlds: unlocked.sort((a,b)=>a-b) };
    });
  }, [saveUpdater]);
  const resetProgress = useCallback(() => saveUpdater(() => ({ ...defaultProgress })), [saveUpdater]);
  useEffect(() => {
    const handler = (e: StorageEvent) => { if (e.key === STORAGE_KEY) setProgress(loadProgress()); };
    window.addEventListener("storage", handler); return () => window.removeEventListener("storage", handler);
  }, []);
  const completeStory = useCallback((id: string) => { if (id) saveUpdater(p => p.completedStories.includes(id) ? p : ({ ...p, stars: p.stars + 10, completedStories: [...p.completedStories, id] })); }, [saveUpdater]);
  const completeMathQuiz = useCallback((id: string) => { if (id) saveUpdater(p => p.completedMathQuizzes.includes(id) ? p : ({ ...p, stars: p.stars + 10, completedMathQuizzes: [...p.completedMathQuizzes, id] })); }, [saveUpdater]);
  const completeTimesTable = useCallback((id: number) => { if (Number.isInteger(id) && id >= 1 && id <= 20) saveUpdater(p => p.completedTimesTables.includes(id) ? p : ({ ...p, stars: p.stars + 10, completedTimesTables: [...p.completedTimesTables, id] })); }, [saveUpdater]);
  const completeTimesTableCount = useCallback((id: number) => { if (Number.isInteger(id) && id >= 1 && id <= 20) saveUpdater(p => p.completedTimesTablesCount.includes(id) ? p : ({ ...p, stars: p.stars + 10, completedTimesTablesCount: [...p.completedTimesTablesCount, id] })); }, [saveUpdater]);
  return { progress, addStars, addHardWord, removeHardWord, unlockWorld, completeWorld, resetProgress, completeStory, completeMathQuiz, completeTimesTable, completeTimesTableCount };
}
