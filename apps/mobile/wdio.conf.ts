import { wdOpts } from './config/android.config';

export const config: WebdriverIO.Config = {
  runner: 'local',
  hostname: wdOpts.hostname,
  port: wdOpts.port,
  path: wdOpts.path,
  logLevel: wdOpts.logLevel,
  capabilities: [wdOpts.capabilities],
  maxInstances: 1,

  specs: ['./tests/specs/**/*.spec.ts'],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  reporters: ['spec'],

  services: [['appium', {}]],
};
