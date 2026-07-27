import type { Brand } from '@framework/shared-types';
import { ApiClient } from '../clients/api-client';

interface BrandsListResponseBody {
  responseCode: number;
  brands: Array<{ id: number; brand: string }>;
}

export class BrandsService {
  constructor(private readonly client: ApiClient) {}

  async listBrands(): Promise<Brand[]> {
    const response = await this.client.get('/brandsList');
    const body = (await response.json()) as BrandsListResponseBody;
    return body.brands.map((b) => ({ id: b.id, name: b.brand }));
  }
}
