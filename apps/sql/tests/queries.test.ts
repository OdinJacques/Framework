import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { DatabaseSync } from 'node:sqlite';
import { demoUser, sampleProducts } from '@framework/test-data';
import { createDatabase } from '../src/db-client';
import { seed } from '../db/seed';

describe('queries', () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = createDatabase();
    seed(db);
  });

  afterEach(() => {
    db.close();
  });

  it('lists products for a given category', () => {
    const rows = db
      .prepare(
        `SELECT p.name AS name
         FROM products p
         JOIN categories c ON c.id = p.category_id
         WHERE c.name = ?`,
      )
      .all('Tops') as Array<{ name: string }>;

    expect(rows.map((r) => r.name)).toContain('Blue Top');
  });

  it('joins orders back to the seeded demo user', () => {
    const rows = db
      .prepare(
        `SELECT u.email AS email, oi.quantity AS quantity, pr.name AS name
         FROM orders o
         JOIN users u ON u.id = o.user_id
         JOIN order_items oi ON oi.order_id = o.id
         JOIN products pr ON pr.id = oi.product_id
         WHERE u.email = ?`,
      )
      .all(demoUser.email) as Array<{ email: string; quantity: number; name: string }>;

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ name: sampleProducts[0].name, quantity: 2 });
  });
});
