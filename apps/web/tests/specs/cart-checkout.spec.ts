import { test, expect } from '../../src/fixtures/pages.fixture';
import { sampleProducts } from '@framework/test-data';

test.describe('Cart', () => {
  test('adding a product from the products page makes it appear in the cart', async ({
    productsPage,
    cartPage,
  }) => {
    const [product] = sampleProducts;

    await productsPage.open();
    await productsPage.addProductToCartByName(product.name);

    await cartPage.open();
    const cartProductNames = await cartPage.getCartProductNames();
    expect(cartProductNames.some((name) => name.includes(product.name))).toBe(true);
  });
});
