import { wdOpts } from './config/android.config';

export const config: WebdriverIO.Config = {
  runner: 'local',
  hostname: wdOpts.hostname,
  port: wdOpts.port,
  path: wdOpts.path,
  logLevel: wdOpts.logLevel,
  capabilities: [wdOpts.capabilities],
  maxInstances: 1,

  // Without this, nothing writes to disk and CI's wdio-logs artifact upload
  // silently has nothing to collect on failure.
  outputDir: './wdio-logs',

  specs: ['./tests/specs/**/*.spec.ts'],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  reporters: ['spec'],

  services: [['appium', {}]],
};
