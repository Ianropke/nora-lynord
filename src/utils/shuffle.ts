export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const random = rng();
    const normalized = Number.isFinite(random) ? Math.min(0.999999999, Math.max(0, random)) : 0;
    const j = Math.floor(normalized * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
