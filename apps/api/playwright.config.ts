import { defineConfig } from '@playwright/test';
import { env } from '@framework/config';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: env.API_BASE_URL,
    // Playwright's default User-Agent literally contains "Playwright", a
    // known automation-tool signature. Combined with GitHub Actions runners
    // coming from shared Azure datacenter IP ranges (which Cloudflare-backed
    // sites often treat more strictly than residential/dev IPs), this is a
    // likely contributor to CI-only 415 responses that don't reproduce
    // locally — see docs/changes for the investigation. Not guaranteed to
    // fully resolve it since the site's WAF behavior isn't under our control.
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },
});
