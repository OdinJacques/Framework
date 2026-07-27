import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productCards = page.locator('.features_items .product-image-wrapper');
  }

  async open(): Promise<void> {
    await this.goto('/products');
  }

  async searchProduct(name: string): Promise<void> {
    await this.searchInput.fill(name);
    await this.searchButton.click();
  }

  async getVisibleProductNames(): Promise<string[]> {
    return this.productCards.locator('.productinfo p').allTextContents();
  }

  async addProductToCartByName(name: string): Promise<void> {
    const card = this.productCards.filter({ hasText: name });
    await expect(card, `Product "${name}" not found on the products page`).toHaveCount(1);
    await card.hover();
    await card.locator('.add-to-cart').first().click();
    // automationexercise.com shows a "Continue Shopping" modal after adding to cart.
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }
}
