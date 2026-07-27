import { test, expect } from '../../src/fixtures/pages.fixture';

test.describe('Product search', () => {
  test('returns no results for a product name that does not exist', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.searchProduct('this-product-does-not-exist-xyz');

    const visibleNames = await productsPage.getVisibleProductNames();
    expect(visibleNames).toHaveLength(0);
  });
});
