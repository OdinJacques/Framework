import type { DatabaseSync } from 'node:sqlite';
import { demoUser, sampleProducts } from '@framework/test-data';

/**
 * Seeds representative rows built from @framework/test-data, so the same
 * product names/prices and demo user used by the web and API suites also
 * exist in this database.
 */
export function seed(db: DatabaseSync): void {
  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)');
  const insertBrand = db.prepare('INSERT OR IGNORE INTO brands (id, name) VALUES (?, ?)');
  const insertProduct = db.prepare(
    'INSERT INTO products (id, name, price, brand_id, category_id) VALUES (?, ?, ?, ?, ?)',
  );
  const insertUser = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  const insertOrder = db.prepare('INSERT INTO orders (user_id) VALUES (?)');
  const insertOrderItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
  );

  const categoryIds = new Map<string, number>();
  const brandIds = new Map<string, number>();
  let nextCategoryId = 1;
  let nextBrandId = 1;

  for (const product of sampleProducts) {
    let categoryId = categoryIds.get(product.category);
    if (categoryId === undefined) {
      categoryId = nextCategoryId;
      categoryIds.set(product.category, categoryId);
      insertCategory.run(categoryId, product.category);
      nextCategoryId += 1;
    }

    let brandId = brandIds.get(product.brand);
    if (brandId === undefined) {
      brandId = nextBrandId;
      brandIds.set(product.brand, brandId);
      insertBrand.run(brandId, product.brand);
      nextBrandId += 1;
    }

    insertProduct.run(product.id, product.name, product.price, brandId, categoryId);
  }

  const userResult = insertUser.run(demoUser.name, demoUser.email, demoUser.password);
  const userId = Number(userResult.lastInsertRowid);

  const orderResult = insertOrder.run(userId);
  const orderId = Number(orderResult.lastInsertRowid);
  insertOrderItem.run(orderId, sampleProducts[0].id, 2);
}
