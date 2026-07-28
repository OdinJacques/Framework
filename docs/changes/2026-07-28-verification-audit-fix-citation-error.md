# Verification re-audit: fix a leftover citation error

**Date:** 2026-07-28

## Summary

Re-ran the same three-pronged audit that found and fixed the previous round's issues (commit `4115bd3`), this time specifically to verify those fixes actually held up rather than trusting the prior claims. Every substantive fix — the `changelog-check` critical checkout-ref bug, the `git fetch` error handling, the anchored trivial-file regex, all six Round 1 reliability fixes, and every doc-drift correction — was independently re-confirmed as genuinely correct against current source. Found and fixed one leftover citation error from the previous round, plus documented one previously-unaddressed low-priority trade-off.

## Files changed

- `README.md` (Troubleshooting section): the previous round's new "Exact-text assertions breaking" bullet cited `auth.service.ts`'s `"not found"` check — but `apps/api/src/services/auth.service.ts` contains no such string. The real assertion is `apps/api/tests/specs/auth.spec.ts:8` (`expect(result.message).toContain('not found')`). Corrected the citation. Caught independently by two separate audit passes plus a direct `grep` confirming `auth.service.ts` has zero occurrences of "not found".
- `.github/workflows/ci.yml` (`changelog-check` job's checkout step): added a comment documenting that `fetch-depth: 0`'s cost grows with repo history size — a real trade-off that was implemented correctly but never written down as an accepted risk anywhere, unlike every other CI/config decision in this repo.

## Rationale

The citation error is a good illustration of why this repo's own "verify by executing/re-reading, don't trust the last claim" habit matters: the previous round's changelog entry (`docs/changes/2026-07-27-fix-changelog-check-bug-and-doc-drift.md`) made the same wrong claim, but that's a historical record where point-in-time inaccuracy is accepted by the folder's own rules — it's `README.md` carrying the same error into *live*, currently-read documentation that made this worth fixing rather than shrugging off. Not touching the historical changelog entry itself for that reason.

The `fetch-depth: 0` note was a genuine gap, not a bug: the mechanism itself is correct and appropriately sized for this repo today, but every other similar trade-off in this codebase (SQLite choice, mobile CI scope, `node:sqlite` workaround) is documented as an intentional decision somewhere, and this one wasn't. A one-line comment closes that gap without changing behavior.
