# Extract apps/web locators into a dedicated locators/ folder

**Date:** 2026-07-28

## Summary

At the user's request, moved `apps/web`'s Playwright selectors out of the page-object classes and into a parallel `apps/web/src/locators/*.page.locators.ts` file per page, each exporting a flat, typed map of selector strings (`LocatorObj`), for cleaner and more reusable locator definitions. This reverses an explicit convention documented earlier this session ("no separate locators file"), scoped to web only — `apps/mobile` keeps its inline-locator convention unchanged, since that wasn't part of the request.

## Files changed

- `apps/web/src/types.ts` (new): `LocatorObj` — `{ [key: string]: string }`.
- `apps/web/src/locators/{home,login,products,cart}.page.locators.ts` (new): one file per existing page, each exporting `<name>PageLocators`. `login.page.locators.ts` and `cart.page.locators.ts` hold every locator from their page 1:1. `home.page.locators.ts`/`products.page.locators.ts` hold the CSS-selector-based ones only — see the exception below. `base.page.ts` has no locators today (just `goto`/`title` helpers), so it has no matching locators file — creating an empty one would be pure ceremony.
- `apps/web/src/pages/{home,login,products,cart}.page.ts`: constructors now build `Locator` fields from the imported locator-string constants (`page.locator(loginPageLocators.loginButton)`) instead of inline string literals. No change to method signatures, class structure, or behavior — this was a pure refactor of *where the selector string lives*, not what it does.

## Exception: accessible-role locators stay inline

`home.page.ts`'s `signupLoginLink`/`productsLink`/`cartLink` and `products.page.ts`'s "Continue Shopping" button use `page.getByRole('link'/'button', { name: '...' })`, which isn't a plain CSS/XPath string. Before assuming Playwright's `role=` locator-engine string syntax (`'role=link[name="Cart"]'`) was a drop-in equivalent, tested it directly against the live site — it silently matched zero elements. The only working string form found was `'role=link >> text=Cart'`, which uses substring text-matching, not `getByRole`'s accessible-name computation — a real behavioral difference, not just a syntax swap. Rather than introduce that mismatch for the sake of 100% file coverage, these four locators were kept as direct `getByRole` calls in the page objects and explicitly excluded from the locators files, with a comment at each site explaining why.

## Rationale

Verified the `role=` finding empirically (multiple live syntax variants tried, including `[name="..."]` with double/single quotes and case-insensitivity flags, all returning zero matches, versus the working `>> text=` chain) rather than assuming Playwright's string DSL was a complete mirror of its fluent API — it isn't, and guessing wrong here would have silently broken three passing tests. This is the same "verify before trusting a locator claim" discipline used earlier when the mobile suite's `ChainablePromiseArray.length` gotcha was found the hard way.

The convention-reversal (this session had previously and deliberately chosen "no separate locators file") is scoped to web only per the user's explicit ask — `CLAUDE.md` and `README.md` were updated to describe both the new web convention and that mobile is intentionally unaffected, rather than leaving the docs describing a single convention that no longer matches either suite consistently.
