import type { Product } from '@framework/shared-types';
import { ApiClient } from '../clients/api-client';

interface RawProduct {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

interface ProductsListResponseBody {
  responseCode: number;
  products: RawProduct[];
}

function toProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    price: raw.price,
    brand: raw.brand,
    category: raw.category.category,
    userType: raw.category.usertype.usertype,
  };
}

export class ProductsService {
  constructor(private readonly client: ApiClient) {}

  async listProducts(): Promise<Product[]> {
    const response = await this.client.get('/productsList');
    const body = (await response.json()) as ProductsListResponseBody;
    return body.products.map(toProduct);
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const response = await this.client.postForm('/searchProduct', { search_product: searchTerm });
    const body = (await response.json()) as ProductsListResponseBody;
    return body.products.map(toProduct);
  }
}
