import { test, expect } from '../../src/fixtures/services.fixture';
import { sampleProducts } from '@framework/test-data';

test.describe('Brands API', () => {
  test('brandsList includes the brands used by known sample products', async ({
    brandsService,
  }) => {
    const brands = await brandsService.listBrands();
    const brandNames = brands.map((b) => b.name);

    for (const sample of sampleProducts) {
      expect(brandNames).toContain(sample.brand);
    }
  });
});
