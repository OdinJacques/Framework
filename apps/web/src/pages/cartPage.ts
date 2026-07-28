import type { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { cartPageLocators } from '../locators/cartPage.locators';

export class CartPage extends BasePage {
  private readonly cartRows: Locator;

  constructor(page: Page) {
    super(page);
    this.cartRows = page.locator(cartPageLocators.cartRows);
  }

  async open(): Promise<void> {
    await this.goto('/view_cart');
  }

  async getCartProductNames(): Promise<string[]> {
    return this.cartRows.locator(cartPageLocators.cartDescriptionLink).allTextContents();
  }

  async getItemCount(): Promise<number> {
    return this.cartRows.count();
  }
}
