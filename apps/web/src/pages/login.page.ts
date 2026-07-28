import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly loginEmailInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginButton: Locator;
  private readonly loginErrorText: Locator;

  constructor(page: Page) {
    super(page);
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    // Structural selector (the login form's red-styled error paragraph)
    // rather than matching the exact wording — survives the site changing
    // its copy, which an exact-text match wouldn't.
    this.loginErrorText = page.locator('form[action="/login"] p[style*="color: red"]');
  }

  async open(): Promise<void> {
    await this.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async isLoginErrorVisible(): Promise<boolean> {
    return this.loginErrorText.isVisible();
  }
}
