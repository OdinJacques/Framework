import { test as base } from '@playwright/test';
import { ApiClient } from '../clients/apiClient';
import { ProductsService } from '../services/products.service';
import { BrandsService } from '../services/brands.service';
import { AuthService } from '../services/auth.service';

interface ServiceFixtures {
  apiClient: ApiClient;
  productsService: ProductsService;
  brandsService: BrandsService;
  authService: AuthService;
}

export const test = base.extend<ServiceFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  productsService: async ({ apiClient }, use) => {
    await use(new ProductsService(apiClient));
  },
  brandsService: async ({ apiClient }, use) => {
    await use(new BrandsService(apiClient));
  },
  authService: async ({ apiClient }, use) => {
    await use(new AuthService(apiClient));
  },
});

export { expect } from '@playwright/test';
