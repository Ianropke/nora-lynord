# Noras Lynord

Noras Lynord is a Danish, child-friendly learning app built around Pokémon-themed word games, reading stories, arithmetic quizzes, and multiplication tables.

## Current scope

- Ordtræner: 6 levels, 72 routes, 720 unique Danish words
- Regnehjørne: 8 math regions, 24 quizzes, 120 questions
- Læsehjørne: 12 stories across the currently authored story regions
- Tabeller: multiplication tables 1–20 with two game modes
- Progress: browser-local `localStorage`; no account, backend, or database
- Audio: local MP3 assets with Danish browser SpeechSynthesis fallback

## Local development

Requirements: Node.js 24.x and npm.

```bash
npm ci
npm run dev
```

Open the Vite URL printed in the terminal. Progress is stored in the browser under `nora-lynord-progress`.

## Validation commands

```bash
npm run lint       # ESLint
npm run test:run   # Vitest
npm run test:e2e   # Playwright Chromium smoke tests
npm run build      # TypeScript check and Vite production build
```

`npm run test:e2e` starts its own Vite server on port 4173. Playwright browsers can be installed with:

```bash
npx playwright install chromium
```

CI runs the same checks in `.github/workflows/ci.yml` and installs the Linux browser dependencies automatically.

## Repository map

- `src/App.tsx` — top-level screen navigation and module composition
- `src/data/words.ts` — word regions, routes, and vocabulary
- `src/data/math.ts` — math regions and quiz data
- `src/data/stories.ts` — story catalog
- `src/components/` — game and shelf components
- `src/hooks/useProgress.ts` — validated progress persistence
- `src/hooks/useAudio.ts` — local audio and speech fallback
- `src/**/*.test.ts(x)` — Vitest regression tests
- `e2e/` — Playwright browser smoke tests

Read [`AGENTS.md`](AGENTS.md) before making repository changes. It defines source-of-truth rules, validation gates, persistence constraints, and known limitations.

## Known limitations

- The 720 vocabulary entries are unique, but 253 words do not currently have a matching local MP3; they use browser speech fallback.
- The web manifest is present, but there is no service worker/offline cache yet.
- The reading catalog currently has fewer regions than the word and math progressions.
