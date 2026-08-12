# Repository Agent Contract

This file is the repository-wide operating contract for AI agents and human contributors. Keep it short, factual, and current. Source code and executable tests are stronger evidence than historical prose.

## Project mission

Noras Lynord & Læringsunivers is a client-only React/Vite learning app for a young Danish reader. It combines word games, reading stories, arithmetic quizzes, and multiplication-table games. Preserve these correctness properties: progress must survive reloads, invalid persisted values must not crash the app, completion must be idempotent, word/math data must remain structurally valid, and child-facing interactions must remain touch-friendly and usable when audio is unavailable.

## Authoritative sources

Read the following before changing the related area:

- `src/data/words.ts` — authoritative word-trainer regions, worlds, IDs, and word lists. The current language progression is 6 levels, 72 worlds, and 720 word entries.
- `src/data/math.ts` — authoritative math regions and quiz questions. The current math progression has 8 regions, 24 quizzes, and 120 questions.
- `src/data/stories.ts` — authoritative reading-story catalog and story region IDs.
- `src/hooks/useProgress.ts` and its tests — persisted progress shape, validation bounds, migration/version behavior, and idempotency rules.
- `src/hooks/useAudio.ts`, `public/audio/`, and audio-generation scripts — local audio naming, playback lifecycle, and browser speech fallback.
- `src/App.tsx` and `src/components/` — screen navigation, module composition, and user-facing behavior.
- `src/**/*.test.ts(x)` — executable regression evidence. Update tests when behavior changes.

`GLOBAL_CODE_QA.md`, `LEARNINGS.md`, and `TEST_PLAN.md` are useful historical/design notes, but they are not authoritative where they conflict with code. They still contain obsolete claims about 4 regions, 48 worlds, 480 words, and Playwright coverage. Do not copy those numbers into new work. There is no README, ADR set, roadmap, security document, database schema, or CI workflow in the repository at present.

## Architectural invariants

- This is a frontend-only Vite application. React composition is rooted in `src/main.tsx`; application screen state is composed in `src/App.tsx`; domain data stays in `src/data/`; reusable UI/game logic stays in `src/components/`, `src/hooks/`, and `src/utils/`.
- Keep progression ownership in the relevant module. Read `MathShelf.tsx` and `StoryShelf.tsx` before changing unlock rules; do not make side-module access depend on word-trainer progress unless that bridge is intentional and tested.
- Keep persistence behind `useProgress`. Preserve the storage key, version handling, validation, deduplication, and storage-error fallback unless a deliberate migration is designed and tested.
- Keep browser-only APIs behind the existing audio/UI boundaries. Audio must remain non-blocking: local MP3 playback may fall back to Danish `SpeechSynthesis`, and stopping a prior playback must not allow stale callbacks to mutate current UI state.

## Domain and data correctness

- Language world IDs are currently bounded to `1..72`; completing world 72 must not unlock world 73. Each language world is expected to contain 10 words. Check `useProgress.test.ts` and `App.test.tsx` when changing progression or rewards.
- Math region IDs and quiz IDs are separate from language world IDs. Do not conflate math completion with language completion; use the module's own completion collections.
- Rewards and completion callbacks are deliberately guarded against duplicate completion. Preserve that behavior when editing game screens.
- Treat vocabulary and quiz arrays as authored data, not filler. Do not invent values or silently substitute unrelated words/questions to satisfy counts.
- The current source contains 720 word entries but only 687 unique words, and the audit found 220 entries without matching files in `public/audio/`. The app currently relies on speech fallback for missing audio. Preserve that distinction and do not claim full uniqueness or full local-audio coverage without fixing and testing the data/assets.
- Use the injected RNG in `src/utils/shuffle.ts` for deterministic tests; do not introduce uncontrolled randomness into behavior that needs regression coverage.

## Persistence, database, and external services

- There is no database, migration system, backend API, authentication layer, or server-side source of truth. Progress is browser-local `localStorage`; do not introduce server assumptions or destructive schema changes as a shortcut for tests.
- Runtime vocabulary/audio assets are local. Browser `SpeechSynthesis` is the fallback. The audio-generation scripts call Google Cloud Text-to-Speech and require `GOOGLE_TTS_API_KEY`; never commit that key or generated credentials.
- The app has a web manifest, but no service worker or offline-cache implementation is present. Do not describe offline support as implemented unless a service worker is added and verified.

## Security and secrets

- Never commit API keys, tokens, credentials, `.env` contents, or private user data. Use environment variables only for the documented generation scripts.
- Do not expose raw internal exceptions to children or users. Keep authentication/security boundaries intact if a future backend is introduced.
- Treat changes to audio-generation scripts, deployment configuration, persisted data, or user data handling as security-sensitive and validate them separately.

## Scope and task sizing

- Make the smallest coherent change that solves the stated task. Do not opportunistically redesign components, rename unrelated files, upgrade dependencies, reformat large areas, or add frameworks.
- For substantial architecture, data-model, infrastructure, security, or domain changes, first write an investigation covering current state, constraints, evidence, options, recommendation, and implementation decomposition.
- Separate independent concerns when it improves reviewability, rollback safety, or testability. Keep the goal, scope, out-of-scope items, constraints, acceptance criteria, and validation explicit in the PR.

## Validation and definition of done

Run the relevant checks and report their actual results:

1. `npm run test:run`
2. `npm run build` (runs `tsc` and `vite build`)
3. `git diff --check`
4. For meaningful UI changes, exercise the rendered flow in a browser and check responsive layout, interaction, accessibility, loading/error states, and browser console warnings/errors.

The repository currently has no lint script, coverage configuration, Playwright dependency/configuration, or GitHub Actions workflow. Never claim those checks passed. The intended clean install is `npm ci`, but the current `package-lock.json` is out of sync with `package.json` (`npm ci` currently fails on `@emnapi` entries); repair the lockfile in a focused dependency-maintenance change before treating clean installation as reproducible. `npm install --package-lock=false` is only a diagnostic workaround and must not be documented as the normal setup.

When behavior changes, add or update a regression test. Inspect the final diff and call out checks that could not run and the residual risk. For substantial changes, perform or request an independent review focused on correctness, regressions, security, data integrity, unnecessary complexity, and acceptance-criteria coverage.

## Documentation discipline

Update repository documentation when architecture, domain behavior, public contracts, deployment, configuration, migrations, or testing expectations change. Keep historical notes clearly historical; do not update prose merely to hide a mismatch with the implementation.

No nested `AGENTS.md` is needed currently: the repository has one frontend with shared constraints. Add scoped instructions only if a future subsystem develops materially different rules (for example, a database, backend, or infrastructure directory).
