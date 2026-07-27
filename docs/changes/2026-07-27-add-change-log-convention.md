# Add a change-log convention (docs/changes/)

**Date:** 2026-07-27

## Summary

Added a standing convention, followed by both humans and AI assistants, that after making a non-trivial change to this repo a new entry gets added under `docs/changes/` documenting what changed, roughly where, and why. The goal is a lightweight, browsable historical record that's easier to skim than `git log`, and that a future AI session can read to understand past decisions without archaeology. Scoping: one entry per logical change (not per file touched), and only for non-trivial changes — the same judgment call already used for commits.

## Files changed

- `docs/changes/README.md` (new): the folder's landing doc — when to add an entry, naming convention (`YYYY-MM-DD-short-kebab-slug.md`), and the entry template (Title/Date/Summary/Files changed/Rationale).
- `CLAUDE.md` (new "After finishing a non-trivial change" section, ~line 45-47; repo map, ~line 29): instructs an AI assistant to add a `docs/changes/` entry before considering a task done, with the same non-trivial/one-per-logical-change scoping.
- `README.md` (Repo Structure tree, ~line 30-34): added a `docs/` block listing both `ARCHITECTURE.md` and `changes/`, so human contributors browsing the repo tree see the convention too. This also fixed a pre-existing gap — `docs/` had been entirely missing from README's tree since `ARCHITECTURE.md` was moved there in an earlier change.

## Rationale

Considered a single running `CHANGELOG.md` instead of one-file-per-change, but rejected it: a shared file creates merge conflicts whenever two changes land close together, and it grows unbounded. Date-prefixed filenames (rather than sequential ADR-style numbers) avoid needing coordination across concurrent branches to pick the next number. The convention is documented in three places rather than one so it's discoverable regardless of entry point — `CLAUDE.md` for an AI assistant reading its instructions, `docs/changes/README.md` for anyone who opens the folder directly, and `README.md`'s structure tree for a human browsing the repo — all three were cross-checked to state the same rules with no drift.
