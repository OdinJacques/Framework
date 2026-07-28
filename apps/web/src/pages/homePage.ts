import type { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { homePageLocators } from '../locators/homePage.locators';

export class HomePage extends BasePage {
  private readonly signupLoginLink: Locator;
  private readonly productsLink: Locator;
  private readonly cartLink: Locator;
  private readonly featuredProductCards: Locator;

  constructor(page: Page) {
    super(page);
    // Accessible-role locators aren't expressible as plain selector strings
    // in Playwright's locator-engine DSL the way CSS selectors are (the
    // `role=` engine matches on visible text via `>> text=`, not on
    // accessible name the way `getByRole` does) — kept as direct API calls
    // rather than forcing a worse-fit string into homePageLocators.
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.featuredProductCards = page.locator(homePageLocators.featuredProductCards);
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  async goToLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  async goToProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getFeaturedProductNames(): Promise<string[]> {
    return this.featuredProductCards.locator(homePageLocators.productInfoText).allTextContents();
  }
}
