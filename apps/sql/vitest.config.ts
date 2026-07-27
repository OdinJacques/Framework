import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // junit ships in vitest core (unlike the html reporter, which needs
    // @vitest/ui) — gives CI a downloadable failure-evidence artifact,
    // matching the web/api jobs' Playwright HTML report uploads.
    reporters: ['default', 'junit'],
    outputFile: { junit: './test-results/junit.xml' },
  },
});
