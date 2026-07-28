import { defineConfig, devices } from '@playwright/test';
import { env } from '@framework/config';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  // Default is 5s — too tight given navigationTimeout below documents ~20s
  // page loads observed on this network path. Without this, an assertion
  // immediately after a slow navigation (e.g. login.spec.ts's expect.poll
  // for the post-submit error) could fail well before the page even settles.
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: env.WEB_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Shorter than the 30s test timeout so a hung action/navigation fails
    // with an attributable "Timeout Xms exceeded" message instead of the
    // generic "Test timeout of 30000ms exceeded".
    actionTimeout: 10_000,
    // automationexercise.com's page loads have been observed taking close to
    // 20s under parallel load from this network path — 25s leaves real
    // headroom while still bounding a genuine hang below the 30s test timeout.
    navigationTimeout: 25_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
