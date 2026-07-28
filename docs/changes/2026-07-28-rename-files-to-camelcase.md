# Rename files to camelCase across web, mobile, api, sql

**Date:** 2026-07-28

## Summary

At the user's request, renamed 17 files in `apps/web/src/pages`, `apps/web/src/locators`, `apps/mobile/src/pages`, `apps/mobile/tests/specs`, `apps/api/src/clients`, and `apps/sql/src` from kebab-case/dot-separated names to camelCase (e.g. `base.page.ts` → `basePage.ts`, `network-internet.page.ts` → `networkInternetPage.ts`, `api-client.ts` → `apiClient.ts`). Pure rename — no exported class/function/const names changed, no behavior change; only file names and the import-path strings pointing at them.

## Files changed

**Renamed** (via `git mv`, or plain `mv` for the two locator files that were still untracked from the prior session's work):
- `apps/web/src/pages/{base,cart,home,login,products}.page.ts` → `{basePage,cartPage,homePage,loginPage,productsPage}.ts`
- `apps/web/src/locators/{cart,home,login,products}.page.locators.ts` → `{cartPage,homePage,loginPage,productsPage}.locators.ts`
- `apps/mobile/src/pages/{base,network-internet,search-settings,settings-home}.page.ts` → `{basePage,networkInternetPage,searchSettingsPage,settingsHomePage}.ts`
- `apps/mobile/tests/specs/airplane-mode-toggle.spec.ts` → `airplaneModeToggle.spec.ts` (also corrects a typo in the requested name, `airplnaneModeToggle`)
- `apps/mobile/tests/specs/search-settings.spec.ts` → `searchSettings.spec.ts` (not explicitly named, but renamed for consistency with its sibling in the same folder and with `searchSettingsPage.ts`)
- `apps/api/src/clients/api-client.ts` → `apiClient.ts`
- `apps/sql/src/db-client.ts` → `dbClient.ts`

**Import paths updated** in every file that referenced the old paths (found via grep, not assumed): all four `apps/web/src/pages/*.ts` files (import `BasePage` and their own locators module), `apps/web/src/fixtures/pages.fixture.ts`; all three renamed `apps/mobile/src/pages/*.ts` files (import `BasePage`) and both `apps/mobile/tests/specs/*.ts` files; `apps/api/src/services/{auth,brands,products}.service.ts` and `apps/api/src/fixtures/services.fixture.ts`; `apps/sql/tests/{schema,queries}.test.ts`. Also updated stale path references inside a few code comments and error messages that named the old filenames (`networkInternetPage.ts`'s own thrown-error message, a cross-reference comment in `productsPage.ts`).

**Docs updated**: `README.md` and `CLAUDE.md` both cited several of the old paths (`apps/api/src/clients/api-client.ts`, `apps/sql/src/db-client.ts`, `network-internet.page.ts`, `login.page.ts`, the `*.page.ts`/`*.page.locators.ts` glob patterns describing the locators convention) — all updated to the new names. Also added a "File naming" bullet to `CLAUDE.md` documenting the camelCase convention and, explicitly, which folders it does *not* apply to, so a future AI assistant doesn't assume it's repo-wide.

## Scope notes

The user gave "and so on for the rest" / multiple examples for `web/src/pages`, `web/src/locators`, and `mobile/src/pages`, and one example for `mobile/tests/specs`. Read as "apply consistently within every folder pointed at" — which is why `search-settings.spec.ts` (not named) was renamed alongside `airplane-mode-toggle.spec.ts` (named), since both live in `mobile/tests/specs`. Folders never referenced at all (`web/tests/specs`, `web/src/fixtures`, `api/src/services`, `api/src/fixtures`, `api/tests/specs`, `sql/db`, `sql/tests`, `mobile/config`) were left untouched.

## Rationale

Created as a separate entry from the same-day locators-extraction change rather than appended to it — different files, different motivation (one is "centralize selectors," this one is "consistent naming"), even though they touch overlapping folders.
