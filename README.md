# QA Automation Framework

A single TypeScript monorepo covering front-end, API, mobile, and SQL test automation, wired to GitHub Actions CI/CD.

## Overview

| Suite | Tooling | Target |
|---|---|---|
| Web (`apps/web`) | Playwright Test, Page Object Model | https://automationexercise.com (UI) |
| API (`apps/api`) | Playwright Test (`request` context), API object model | https://automationexercise.com/api |
| Mobile (`apps/mobile`) | Appium + WebdriverIO, Page Object Model | Android Settings app (`com.android.settings`) on an emulator |
| SQL (`apps/sql`) | Node's built-in `node:sqlite` + Vitest | Local, self-seeded SQLite DB modeled on the same product/order domain |

Web and API intentionally target the **same site** and share fixtures (`packages/test-data`) so the two suites cross-check each other — e.g. a product visible in the storefront UI is also asserted present in the `/productsList` API response. Mobile automates a native app, so it necessarily has its own Page Object Model, but follows the same conventions. SQL runs fully offline against seed data shaped after the same domain (products/brands/categories/users/orders).

## Repo Structure

```
apps/
  web/       Playwright Test UI suite (POM)
  api/       Playwright Test API suite (API object model)
  mobile/    WebdriverIO + Appium suite (POM)
  sql/       SQLite schema/seed/query test suite
packages/
  shared-types/  Domain interfaces (Product, User, Brand, Order)
  config/        Env loading + validation, shared across all apps
  test-data/     Canonical fixtures (demo user, sample products) shared by web + api
.github/workflows/
  ci.yml       lint/typecheck + web + api + sql, on push/PR
  mobile.yml   Android emulator job, manual + nightly only
```

## Prerequisites

- Node.js 24+ (the SQL suite uses the built-in `node:sqlite` module, which needs a recent Node)
- For mobile only: Android Studio with an emulator configured, and the Appium server (`npm install` in `apps/mobile` pulls in `appium` as a dependency)
- No Docker required for any suite

## Setup

```bash
npm install
cp .env.example .env
npx playwright install --with-deps chromium   # web suite only
```

Edit `.env` if you want to point suites at different values than the defaults (see [Environment Variables](#environment-variables)).

## Running Suites Locally

### Web
```bash
npm run test:web
npm run test:web -- --headed   # or: cd apps/web && npm run test:headed
```

### API
```bash
npm run test:api
```

### SQL
```bash
npm run test:sql
```
Runs entirely offline against an in-memory SQLite database seeded from `apps/sql/db/seed.ts` — no setup required.

### Mobile
1. Open Android Studio → Virtual Device Manager → start your emulator.
2. Run `adb devices` to confirm it appears (e.g. `emulator-5554`); update `appium:udid` in `apps/mobile/config/android.config.ts` if your emulator's serial differs.
3. Run:
   ```bash
   npm run test:mobile
   ```
   `wdio`'s Appium service starts the Appium server automatically. To run against a real device instead of the emulator, swap `emulator-5554` for the device's serial (from `adb devices`) in `android.config.ts`.

## Environment Variables

Defined in `.env` (see `.env.example`), loaded and validated by `packages/config`:

| Variable | Purpose |
|---|---|
| `WEB_BASE_URL` | Base URL for the web suite (default: `https://automationexercise.com`) |
| `API_BASE_URL` | Base URL for the API suite (default: `https://automationexercise.com/api/` — the trailing slash matters, see `apps/api/src/clients/api-client.ts`) |
| `DEMO_USER_NAME` / `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` | Shared demo user used by both the web login flow and API auth endpoints. The account must exist on the live site (create it once via the signup flow) for positive-login scenarios to work. |
| `APPIUM_HOST` / `APPIUM_PORT` | Appium server connection used by the mobile suite |

## POM / API Object Model Conventions

- **Web & mobile**: each page is a class extending `BasePage`, owns its own locators as private fields, and exposes action methods (`login()`, `searchProduct()`) and query methods (`getVisibleProductNames()`). Specs consume page objects through a fixture (`apps/web/src/fixtures/pages.fixture.ts`) rather than instantiating them directly.
- **API**: the equivalent pattern is a `*.service.ts` per resource family (`products.service.ts`, `brands.service.ts`, `auth.service.ts`), each wrapping a shared `ApiClient` and returning typed `@framework/shared-types` entities instead of raw JSON.
- Add a new page/service by following the existing files in the same directory — no separate locators file; locators live alongside the methods that use them.

## CI/CD

- **`ci.yml`** runs on every push/PR to `main`: lint + typecheck, then web, API, and SQL suites in parallel jobs. Web/API failures upload their Playwright HTML report as a workflow artifact.
- **`mobile.yml`** runs only via manual dispatch or a nightly schedule. GitHub-hosted runners have no real Android device; while a KVM-backed emulator can boot on `ubuntu-latest`, boot time and flakiness make it unsuitable as a PR gate. Local runs against a real emulator/device remain the primary way to develop and validate mobile tests.

## Troubleshooting

- **Web/API test flakiness**: automationexercise.com is a real third-party site — expect occasional flakiness unrelated to the framework. Playwright retries automatically in CI (`retries: 2`).
- **Mobile: Appium can't find the emulator**: confirm `adb devices` shows it before running tests, and that the serial matches `appium:udid` in `android.config.ts`.
- **Mobile: element not found**: locators in `apps/mobile/src/pages` target the stock Android 13 Settings app; resource-ids and text can shift between Android versions/OEM skins, so adjust them to match your emulator/device.
- **SQL suite state**: each test file gets a fresh in-memory database (see `apps/sql/src/db-client.ts`), so tests never depend on execution order or leftover state.
