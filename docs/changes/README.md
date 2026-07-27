# Change log

A lightweight, browsable history of non-trivial changes to this repo — easier to skim than `git log`, and meant to let a future contributor (human or AI) understand past decisions without archaeology.

## When to add an entry

One entry per **logical change** (a commit/PR-sized unit of work), not one per file touched. Only for **non-trivial** changes — a new feature, a bug fix, a refactor, a meaningful config/CI change. Skip it for typos, formatting-only diffs, or single-line trivial tweaks. This is the same judgment call already used for writing a real commit message.

## Naming

`YYYY-MM-DD-short-kebab-slug.md` — e.g. `2026-07-27-api-error-attribution-and-ci-reliability.md`. Date-prefixed so entries sort chronologically in a file browser, with no coordination needed between concurrent branches (unlike sequential numbering, which can collide across parallel PRs).

## Template

```markdown
# <Short title>

**Date:** YYYY-MM-DD

## Summary
What changed and why, in a few sentences.

## Files changed
- `path/to/file.ts` (around line N-M at the time of this change): what changed there and why
- `path/to/other.yml`: what changed there and why

## Rationale
(if not obvious from Summary) — why this approach over alternatives, what problem it solves.
```

Line references are a point-in-time snapshot, like a diff — they're not expected to stay accurate as the code around them changes later, and that's fine for a historical record. If a PR or commit description already covers this content well, reuse it rather than drafting the entry from scratch.
