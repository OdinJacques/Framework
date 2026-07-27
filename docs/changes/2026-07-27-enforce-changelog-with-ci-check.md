# Enforce the change-log convention with a CI check

**Date:** 2026-07-27

## Summary

The `docs/changes/` convention added earlier today was purely a written policy — nothing actually checked whether a human (working without any AI, e.g. via the GitHub web UI) skipped it. Added a `changelog-check` job to `.github/workflows/ci.yml` that runs on every pull request, diffs the PR against its base branch, and fails with a clear, actionable message if the PR touches real code/config without adding a new file under `docs/changes/`.

## Files changed

- `.github/workflows/ci.yml` (new `changelog-check` job, top of the `jobs:` list): checks out full history (`fetch-depth: 0`), fetches the PR's base branch, and diffs `origin/<base>...HEAD`. Skips (exit 0) if: the latest commit message contains `[skip-changelog]`, all changed files are on a small trivial allowlist (`package-lock.json`, `.gitignore`, `.prettierignore`, anything under `docs/changes/` itself), or a new/modified `docs/changes/*.md` file (other than the folder's own `README.md`) is already present in the diff. Otherwise fails with a message — written to both the job log and `$GITHUB_STEP_SUMMARY` for visibility — that explains the convention, gives the exact filename pattern and template to use, links to `docs/changes/README.md`, and names the `[skip-changelog]` escape hatch for genuinely trivial changes.
- `README.md` (CI/CD section): added a bullet describing `changelog-check` — when it triggers, what it checks, and the `[skip-changelog]` escape hatch — plus a correction noting the SQL job's JUnit report upload (added in an earlier change but never reflected here).

## Rationale

"Non-trivial" is a judgment call a human makes easily but a CI script can't infer, so this can't be a perfect gate — it works off a conservative heuristic (require an entry unless a file is on a short trivial allowlist) that intentionally errs toward false positives (flagging some genuinely trivial changes) over false negatives (silently letting a real change through unlabeled), since false positives are cheaply recoverable via `[skip-changelog]` while false negatives would quietly defeat the whole convention.

The check only runs on `pull_request` events, not on direct pushes to `main` — a push means the change is already merged, so there's nothing left to gate, and there's no meaningful "base" to diff a direct push against in the same way. It also deliberately doesn't post PR comments (which would need `pull-requests: write` permission) — the existing workflow scopes permissions to `contents: read` only, and the job log + step summary already surface the message clearly without widening that scope.

The core diff/heuristic logic was written once as a standalone script and executed directly (not just read) against a disposable scratch git repo covering all four branches — missing entry, entry present, `[skip-changelog]` marker, and trivial-file-only — to confirm the exit codes and message actually behave as intended before trusting it in CI, rather than assuming the YAML was correct from inspection alone. The YAML itself was also parsed with `js-yaml` to confirm the heredoc's indentation survives GitHub Actions' block-scalar de-indentation correctly (a common source of subtle bugs in multi-line `run:` steps).
