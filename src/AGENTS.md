# Scoped Agent Contract — learning app source

The root `AGENTS.md` remains authoritative. These rules specialize review of `src/`.

## Code Review Rules

### Preserve progression and persistence integrity
Flag changes that can duplicate rewards/completion, unlock invalid IDs, corrupt/misread persisted progress, or silently conflate language/math/story completion. The safe path is module-specific bounded state through the existing progress contract plus regression coverage.

### Audio failure must not block the child flow
Flag changes that make local audio availability a prerequisite for completing an interaction or allow stale playback callbacks to mutate current UI state. Preserve the existing non-blocking fallback semantics.

### Significant UI changes need child-focused rendered acceptance
After deterministic tests/build, verify the rendered flow with browser/E2E tooling and, when available, Codex Computer Use. Check touch targets, navigation clarity, responsive layout, error/audio-fallback behavior, and completion flows rather than relying on compilation alone.
