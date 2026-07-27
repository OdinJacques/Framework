import { test, expect } from '../../src/fixtures/services.fixture';
import { sampleProducts } from '@framework/test-data';

/**
 * Paired with apps/web/tests/specs/product-consistency.spec.ts. Both suites
 * assert on the same @framework/test-data fixture, so a catalog change on the
 * live site fails both suites for the same traceable reason.
 */
test.describe('Products API', () => {
  test('productsList contains every known sample product', async ({ productsService }) => {
    const products = await productsService.listProducts();
    const names = products.map((p) => p.name);

    for (const sample of sampleProducts) {
      expect(names).toContain(sample.name);
    }
  });

  test('searchProduct finds a known product by name', async ({ productsService }) => {
    const [sample] = sampleProducts;
    const results = await productsService.searchProducts(sample.name);

    expect(results.some((p) => p.name === sample.name)).toBe(true);
  });
});
