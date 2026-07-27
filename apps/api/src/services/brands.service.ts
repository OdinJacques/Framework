import type { Brand } from '@framework/shared-types';
import { ApiClient } from '../clients/api-client';

interface BrandsListResponseBody {
  responseCode: number;
  brands: Array<{ id: number; brand: string }>;
}

/**
 * See products.service.ts's assertProductsShape for why this is needed:
 * automationexercise.com embeds its own error codes in 200-OK bodies, so a
 * wrong shape here isn't caught by ApiClient's HTTP status check.
 */
function assertBrandsShape(body: unknown, endpoint: string): asserts body is BrandsListResponseBody {
  const brands = (body as Partial<BrandsListResponseBody> | undefined)?.brands;
  if (!Array.isArray(brands)) {
    throw new Error(`Unexpected response shape from ${endpoint}: ${JSON.stringify(body)}`);
  }
}

export class BrandsService {
  constructor(private readonly client: ApiClient) {}

  async listBrands(): Promise<Brand[]> {
    const response = await this.client.get('/brandsList');
    const body: unknown = await response.json();
    assertBrandsShape(body, 'GET brandsList');
    return body.brands.map((b) => ({ id: b.id, name: b.brand }));
  }
}
