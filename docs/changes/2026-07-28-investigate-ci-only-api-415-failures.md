# Investigate CI-only 415 failures in the API suite

**Date:** 2026-07-28

## Summary

The API suite started failing in GitHub Actions with `415 Unsupported Media Type` on every request — including plain `GET` requests, which shouldn't trigger a media-type error at all — while passing consistently when run locally against the same live site. Because `ApiClient`'s `assertOk` (added in an earlier change) surfaces the real status/body instead of a generic parse error, the CI logs showed the actual problem immediately rather than a cryptic `SyntaxError`, which made this investigation possible in the first place.

## Investigation

- Confirmed the failure isn't a code bug: the exact same requests, run locally against `https://automationexercise.com/api/`, return `200` consistently (re-verified live during this investigation).
- Inspected the actual headers Playwright's `request` context sends by default (via `https://httpbin.org/get`/`/post`): `User-Agent: Playwright/<version> (x64; <os>; ...) node/<version>` — the User-Agent literally contains the string `"Playwright"`, a well-known automation-tool signature. `GET` requests carry no `Content-Type` at all, ruling out a body-format problem as the cause of a `GET` 415.
- The response body is Apache's default 415 error page (`"The supplied request data is not in a format acceptable for processing by this resource."`), suggesting the block happens at a layer in front of the Django application (Apache/mod_security or the CDN/WAF), not in application logic that would normally only ever reject a malformed `POST` body.
- GitHub Actions runners execute from shared Azure datacenter IP ranges, which Cloudflare-protected sites (confirmed earlier via `server: cloudflare` response headers) commonly treat with stricter, IP-reputation-based bot mitigation than residential/dev IPs — independent of the request's own headers or method.

## Files changed

- `apps/api/playwright.config.ts`: set an explicit browser-like `userAgent` (Chrome/Windows string) and `Accept-Language` header on the shared `request` context, replacing the default Playwright-branded User-Agent, so CI traffic no longer advertises itself as automation tooling to any WAF doing simple signature matching.

## Honest assessment — what this is and isn't

**Confirmed**: the code itself is correct; the same requests succeed locally. The header change is a legitimate, low-risk mitigation verified to (a) actually take effect (checked via httpbin) and (b) not break anything against the live site locally (all 4 API tests still pass).

**Not confirmed**: whether this actually resolves the CI-specific 415s. This environment has no way to reproduce GitHub Actions' actual network path/IP, so the datacenter-IP-reputation theory is a well-evidenced hypothesis, not a verified root cause — the alternative explanation (TLS/JA3 fingerprinting differences between Node/OS builds, which some WAFs also use) can't be ruled out from here either, and both point to the same fix (look less like a bare automation client) without being distinguishable without an actual CI run.

**If this doesn't fully resolve it**: this joins `README.md`'s existing "Web/API test flakiness" documented risk — automationexercise.com is a real third-party site whose infrastructure isn't under this framework's control. Re-running the workflow is worth trying on a future failure, since GitHub Actions assigns a new runner (often a different egress IP) per run, unlike retries within the same job (which reuse the same runner/IP and, per the original failure log, all failed identically).

## Addendum — checked whether `apps/web` has the same exposure

Asked whether the web suite could hit an analogous block, since it also runs from the same CI environment against the same site. Initial concern: Playwright's headless Chromium sends `HeadlessChrome` in its default User-Agent, a well-known automation signature — same general risk category as the API client's `"Playwright"` UA.

That concern turned out not to apply once checked against the *actual* configuration rather than a bare `chromium.launch()`: `apps/web/playwright.config.ts`'s project spreads Playwright's built-in `devices['Desktop Chrome']` preset, which already overrides the UA to a clean, non-headless `Chrome/...` string — confirmed by evaluating `navigator.userAgent` under that exact preset. No fix needed there.

A deeper signal does exist and isn't masked by any config choice: `navigator.webdriver` evaluates to `true` under Playwright regardless of UA overrides, since it's set by the automation protocol itself. Deliberately not acting on this: `apps/web` has no confirmed CI failure, unlike the API suite's reproducible 415s, and masking `navigator.webdriver` requires stealth-patching techniques that are a meaningfully more involved change than a header override. Adding that now would be speculative hardening against a threat that hasn't materialized — worth revisiting only if `apps/web` actually starts failing in CI with a similar signature.
