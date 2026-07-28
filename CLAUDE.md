# CLAUDE.md

Instructions for AI coding assistants (Claude Code, Cursor, etc.) working in this repo.

## Project summary

A TypeScript npm-workspaces monorepo for QA automation, covering four disciplines against one shared target where possible:

- **Web** (`apps/web`): Playwright Test, Page Object Model, targeting https://automationexercise.com
- **API** (`apps/api`): Playwright Test's `request` context, API object model, targeting the same site's REST API
- **Mobile** (`apps/mobile`): WebdriverIO + Appium, Page Object Model, targeting the native Android Settings app on an emulator
- **SQL** (`apps/sql`): Node's built-in `node:sqlite` + Vitest, self-seeded offline database seeded from the same `packages/test-data` fixtures web/api use

Web and API deliberately share a target and fixtures so the two suites cross-check each other. Mobile automates a native app, so it necessarily has its own POM, but follows the same conventions. Requires **Node 24+**.

See `README.md` for setup/run commands and `docs/ARCHITECTURE.md` for the deeper "why" behind the structure.

## Repo map

```
apps/web              Playwright Test UI suite (POM)
apps/api              Playwright Test API suite (API object model)
apps/mobile           WebdriverIO + Appium suite (POM)
apps/sql              SQLite schema/seed/query suite
packages/shared-types  Domain interfaces (Product, User, Brand, Order)
packages/config        Env loading + validation, shared by web + api (not mobile/sql — see gotchas)
packages/test-data     Canonical fixtures (demo user, sample products) shared by web + api + sql
.github/workflows/     ci.yml (lint/typecheck/web/api/sql, on push/PR), mobile.yml (manual + nightly)
docs/changes/          Change log — one entry per non-trivial change (see "After finishing a non-trivial change" below)
```

Path aliases (`tsconfig.base.json`, inherited by every workspace's `tsconfig.json`):
`@framework/shared-types` → `packages/shared-types/src/index.ts`, `@framework/config` → `packages/config/src/index.ts`, `@framework/test-data` → `packages/test-data/src/index.ts`. Import from these specifiers directly, e.g. `import { env } from '@framework/config'`.

## Conventions to follow when editing

- **Web/mobile page objects**: a new page is a class extending `BasePage` in that suite's `src/pages/`, with locators as private fields and action methods (`login()`, `searchProduct()`) / query methods (`getVisibleProductNames()`). Web specs consume pages through `apps/web/src/fixtures/pages.fixture.ts`; mobile specs instantiate page objects directly (no fixture layer there) — the driver/session itself is never set up per-spec, it comes from `apps/mobile/wdio.conf.ts` (which imports `wdOpts` — capabilities, host, port — from `apps/mobile/config/android.config.ts`, and wires `services: [['appium', ...]]`), and WebdriverIO's test runner injects the `browser`/`$`/`$$` globals automatically into every spec file.
- **API object model**: a new resource gets a `*.service.ts` in `apps/api/src/services/`, wrapping the shared `ApiClient` (`apps/api/src/clients/api-client.ts`) and returning typed `@framework/shared-types` entities instead of raw JSON. Wire it into `apps/api/src/fixtures/services.fixture.ts`.
- **Spec file location**: new tests go in that suite's `tests/specs/*.spec.ts` (web, api, mobile) or `apps/sql/tests/*.test.ts` (sql) — follow the naming of the existing files in the same directory (e.g. `product-search.spec.ts`, `auth.spec.ts`).
- **`packages/config`'s shape**: a single validated `env` object (parsed by zod from `process.env`/`.env`), plus its `Env` type — no factory function, just `import { env } from '@framework/config'; env.WEB_BASE_URL`. The zod schema in `packages/config/src/index.ts` is the source of truth for what's valid/required, and also supplies defaults via `.default(...)` (e.g. `WEB_BASE_URL` defaults to `https://automationexercise.com`). Adding a new environment variable means updating **all three**: the zod schema, `.env.example`, and README's Environment Variables table (human-facing, easy to forget since nothing enforces it).
- **SQL suite pattern**: a new test calls `createDatabase()` from `apps/sql/src/db-client.ts` (defaults to an in-memory DB) and, if it needs seeded rows, `seed(db)` from `apps/sql/db/seed.ts` — typically in `beforeEach`/`beforeAll`, so each test gets a fresh, isolated database.
- **Shared fixtures**: cross-suite test data (demo user, sample products) lives in `packages/test-data`, not duplicated per-suite. Web, API, and SQL all import it directly (`apps/sql/db/seed.ts` included) — if a suite needs to assert on the same data another suite uses, import the same fixture rather than hardcoding values twice.
- **No build step for internal packages**: `@framework/shared-types`, `@framework/config`, `@framework/test-data` are consumed as TS source directly via path aliases in `tsconfig.base.json`. Don't add a `dist`/build step to them.
- **Locators change between Android versions/OEM skins**: the mobile suite's locators target stock Android 13. If they don't resolve on a different emulator/device, that's expected — adjust rather than assuming the framework is broken.

## After finishing a non-trivial change

Add an entry to `docs/changes/` (template and full rules in `docs/changes/README.md`) before considering the task done — one entry per logical change (not per file touched), covering what changed, which files/lines, and why. Applies to human and AI-authored changes alike. Skip it for typos, formatting-only diffs, or single-line trivial tweaks — same judgment call as writing a real commit message. This is a historical log, not living documentation: line references are a point-in-time snapshot, not something that needs to stay accurate later.

## Known gotchas (already hit once — don't rediscover)

- **Playwright `APIRequestContext` + `baseURL` with a path segment**: a leading-slash request path resolves as an absolute path on the origin under WHATWG URL rules, silently dropping the `/api` segment of the base URL (e.g. `https://automationexercise.com/api/` + `/productsList` → `https://automationexercise.com/productsList`, the wrong URL). `ApiClient` (`apps/api/src/clients/api-client.ts`) normalizes this by stripping any leading slash before delegating — don't bypass it by calling `request` directly with a leading-slash path.
- **`node:sqlite` and Vite/Vitest**: Vite's builtin-module list predates `node:sqlite`, so a plain `import { DatabaseSync } from 'node:sqlite'` gets mis-resolved by vite-node inside Vitest. `apps/sql/src/db-client.ts` works around this with `process.getBuiltinModule('node:sqlite')` for the runtime value, plus a type-only import for TS types. This is also why the repo requires **Node 24+** (an older Node lacks `node:sqlite` entirely or needs a flag).
- **`apps/mobile` never consumes `packages/config`'s `env` object, even though `APPIUM_HOST`/`APPIUM_PORT` are in its zod schema**: the schema includes them (for `.env.example` completeness), but nothing in `apps/mobile` imports `@framework/config` — it has no `dotenv` dependency at all. `apps/mobile/config/android.config.ts` reads `APPIUM_HOST`/`APPIUM_PORT` directly off `process.env` with plain fallbacks (`localhost`/`4723`) — setting them in `.env` has no effect for this suite; they must be exported in the shell.

## Commands

`npm run lint`, `npm run typecheck`, `npm run test:web`, `npm run test:api`, `npm run test:sql`, `npm run test:mobile` — see `README.md` for full setup/prerequisites per suite.

## Explicit non-goals

- Don't add a build step to the internal `packages/*` — they're meant to be consumed as source.
- Don't introduce a second API testing framework (e.g. supertest, axios+jest) — Playwright's `request` context already covers this and keeping one runner across web+api is intentional.
- Don't add mobile to the default `ci.yml` push/PR gate — GitHub-hosted runners have no real device, and emulator boot time/flakiness make it unsuitable there. It stays in `mobile.yml` (manual + nightly).
