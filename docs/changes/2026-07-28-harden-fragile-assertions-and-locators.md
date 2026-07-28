# Harden the fragile assertions/locators identified as "fixable" in Troubleshooting

**Date:** 2026-07-28

## Summary

The README's Troubleshooting section listed several known-flaky-or-fragile items; on review, two were actually fixable with code changes rather than just documentable limitations (a real third-party site being occasionally flaky, or mobile UI varying by Android version/OEM, are inherent and can only be mitigated). Hardened both.

## Files changed

- `apps/web/src/pages/login.page.ts` (`loginErrorText` locator): was `page.getByText('Your email or password is incorrect!')` — an exact-text match that breaks if the site rewords its copy. Inspected the live DOM (`<p style="color: red;">...</p>` inside `<form action="/login">`, no class/id/data-qa attribute available) and switched to `page.locator('form[action="/login"] p[style*="color: red"]')` — a structural selector (the login form's red-styled error paragraph) that survives a copy change. Verified against the live site: matches exactly one element, both scoped to the form and page-wide.
- `apps/api/tests/specs/auth.spec.ts`: was asserting both `responseCode === 404` and `message.toContain('not found')`. `responseCode` is the API's stable, structured contract — kept as the primary assertion. Replaced the exact-substring `message` check with `message.length > 0`, since the message is human-readable copy the site could reword at any time and the substring match added exact-wording risk without adding meaningful verification beyond "the field is present."
- `apps/mobile/src/pages/network-internet.page.ts` (`getAirplaneModeSwitch`, new private method): the airplane-mode switch locator (`//android.widget.TextView[@text="Airplane mode"]/parent::*//android.widget.Switch`) could previously resolve to more than one match if the row's container ever nested another toggle, and a bare `$()` would silently interact with whichever one it found first — a silent wrong-click, not a clean failure. Now waits for the row to render, then explicitly requires exactly one match, throwing a clear diagnostic error naming the file to update otherwise. Spreads the WDIO `ChainablePromiseArray` into a plain array first, since its own `.length` is a `Promise<number>` (the same gotcha hit once already in `search-settings.page.ts` — caught this time via a live TypeScript diagnostic instead of a full typecheck run).
- `README.md` (Troubleshooting section): reworded the two affected bullets to describe the hardening rather than the original risk.

## Rationale

Not every Troubleshooting item was fixable: web/API flakiness against a real third-party site, and mobile UI drift across Android versions/OEM skins, are inherent to testing systems this framework doesn't control — no code change here removes those root causes, only mitigates symptoms (retries, adjustable locators). The two items fixed in this change were different in kind: both were assertions that depended on exact wording or exact element cardinality when a more structural or defensive check was available without losing verification value.

The mobile fix is a mitigation, not a verified fix — there's no Android emulator available in this environment to confirm the locator behaves correctly against a real device. What it does verifiably improve is the failure mode: a wrong-element interaction that silently corrupts device state is now a loud, attributable error instead. The web fix, by contrast, was verified directly against the live site (DOM structure inspected, selector match count confirmed) since that's actually testable here.
