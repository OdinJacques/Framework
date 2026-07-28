import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './basePage';
import { productsPageLocators } from '../locators/productsPage.locators';

export class ProductsPage extends BasePage {
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator(productsPageLocators.searchInput);
    this.searchButton = page.locator(productsPageLocators.searchButton);
    this.productCards = page.locator(productsPageLocators.productCards);
  }

  async open(): Promise<void> {
    await this.goto('/products');
  }

  async searchProduct(name: string): Promise<void> {
    await this.searchInput.fill(name);
    await this.searchButton.click();
  }

  async getVisibleProductNames(): Promise<string[]> {
    return this.productCards.locator(productsPageLocators.productInfoText).allTextContents();
  }

  async addProductToCartByName(name: string): Promise<void> {
    const card = this.productCards.filter({ hasText: name });
    await expect(card, `Product "${name}" not found on the products page`).toHaveCount(1);
    await card.hover();
    await card.locator(productsPageLocators.addToCartButton).first().click();
    // automationexercise.com shows a "Continue Shopping" modal after adding
    // to cart. Kept as a direct getByRole call — see homePage.ts for why
    // accessible-role locators aren't moved into the locators file.
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }
}
