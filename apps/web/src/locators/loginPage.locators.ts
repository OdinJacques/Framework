import type { LocatorObj } from '../types';

export const loginPageLocators: LocatorObj = {
  // CSS Selector Locators
  loginEmailInput: 'input[data-qa="login-email"]',
  loginPasswordInput: 'input[data-qa="login-password"]',
  loginButton: 'button[data-qa="login-button"]',
  // Structural selector (the login form's red-styled error paragraph)
  // rather than matching the exact wording — survives the site changing
  // its copy, which an exact-text match wouldn't.
  loginErrorText: 'form[action="/login"] p[style*="color: red"]',
};
