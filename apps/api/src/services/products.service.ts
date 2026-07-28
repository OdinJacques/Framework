import type { Product } from '@framework/shared-types';
import { ApiClient } from '../clients/apiClient';

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

/**
 * automationexercise.com's API embeds its own error codes in a 200-OK JSON
 * body (e.g. `{responseCode: 400, message: "..."}`) rather than using HTTP
 * status codes, so `ApiClient`'s status check can't catch this — a wrong
 * shape here would otherwise surface as a bare "Cannot read properties of
 * undefined (reading 'map')" instead of a message naming the actual problem.
 */
function assertProductsShape(body: unknown, endpoint: string): asserts body is ProductsListResponseBody {
  const products = (body as Partial<ProductsListResponseBody> | undefined)?.products;
  if (!Array.isArray(products)) {
    throw new Error(`Unexpected response shape from ${endpoint}: ${JSON.stringify(body)}`);
  }
}

export class ProductsService {
  constructor(private readonly client: ApiClient) {}

  async listProducts(): Promise<Product[]> {
    const response = await this.client.get('/productsList');
    const body: unknown = await response.json();
    assertProductsShape(body, 'GET productsList');
    return body.products.map(toProduct);
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const response = await this.client.postForm('/searchProduct', { search_product: searchTerm });
    const body: unknown = await response.json();
    assertProductsShape(body, 'POST searchProduct');
    return body.products.map(toProduct);
  }
}
