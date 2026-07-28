import type { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { loginPageLocators } from '../locators/loginPage.locators';

export class LoginPage extends BasePage {
  private readonly loginEmailInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginButton: Locator;
  private readonly loginErrorText: Locator;

  constructor(page: Page) {
    super(page);
    this.loginEmailInput = page.locator(loginPageLocators.loginEmailInput);
    this.loginPasswordInput = page.locator(loginPageLocators.loginPasswordInput);
    this.loginButton = page.locator(loginPageLocators.loginButton);
    this.loginErrorText = page.locator(loginPageLocators.loginErrorText);
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
