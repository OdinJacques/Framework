import { test, expect } from '../../src/fixtures/pages.fixture';
import { sampleProducts } from '@framework/test-data';

/**
 * Paired with apps/api/tests/specs/products.spec.ts. Both suites assert on the
 * same @framework/test-data fixture, so a catalog change on the live site
 * fails both suites for the same traceable reason instead of silently
 * diverging.
 */
test.describe('Product consistency (web side)', () => {
  for (const product of sampleProducts) {
    test(`"${product.name}" is visible in the storefront UI`, async ({ productsPage }) => {
      await productsPage.open();
      await productsPage.searchProduct(product.name);

      const visibleNames = await productsPage.getVisibleProductNames();
      expect(visibleNames.some((name) => name.includes(product.name))).toBe(true);
    });
  }
});
