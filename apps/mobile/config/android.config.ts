/**
 * android.config.ts
 * Capabilities for Android Settings app on an Android Studio emulator.
 *
 * SETUP:
 *  1. Open Android Studio → Virtual Device Manager → start your emulator
 *  2. Run `adb devices` to confirm it shows as emulator-5554 (or similar)
 *  3. Update appium:udid below if your emulator serial is different
 *
 * TO SWITCH BACK TO REAL DEVICE: replace emulator-5554 with C0C4c200 (change to your phone)
 *
 * Docs: https://appium.io/docs/en/2.0/guides/caps/
 */

export const androidCapabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:udid': 'emulator-5554', // serial from `adb devices` — change if different
  'appium:deviceName': 'Pixel_6_API_33', // name from Virtual Device Manager
  'appium:platformVersion': '13',
  'appium:appPackage': 'com.android.settings',
  'appium:appActivity': '.Settings',
  'appium:newCommandTimeout': 60,
  'appium:autoGrantPermissions': true,
  'appium:isHeadless': false, // set true to run emulator without UI window
};

export const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT || '4723', 10),
  path: '/wd/hub',
  logLevel: 'warn' as const, // set 'info' for verbose Appium logs
  capabilities: androidCapabilities,
};
