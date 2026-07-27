import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  private readonly signupLoginLink: Locator;
  private readonly productsLink: Locator;
  private readonly cartLink: Locator;
  private readonly featuredProductCards: Locator;

  constructor(page: Page) {
    super(page);
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.featuredProductCards = page.locator('.features_items .product-image-wrapper');
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
    return this.featuredProductCards.locator('.productinfo p').allTextContents();
  }
}
