import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  private readonly cartRows: Locator;

  constructor(page: Page) {
    super(page);
    this.cartRows = page.locator('#cart_info tbody tr');
  }

  async open(): Promise<void> {
    await this.goto('/view_cart');
  }

  async getCartProductNames(): Promise<string[]> {
    return this.cartRows.locator('.cart_description h4 a').allTextContents();
  }

  async getItemCount(): Promise<number> {
    return this.cartRows.count();
  }
}
