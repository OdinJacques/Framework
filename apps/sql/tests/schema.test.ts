import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { DatabaseSync } from 'node:sqlite';
import { createDatabase } from '../src/dbClient';

describe('schema', () => {
  let db: DatabaseSync;

  beforeAll(() => {
    db = createDatabase();
  });

  afterAll(() => {
    db.close();
  });

  it('creates all expected tables', () => {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
      .all()
      .map((row) => (row as { name: string }).name);

    expect(tables).toEqual(
      expect.arrayContaining([
        'brands',
        'categories',
        'order_items',
        'orders',
        'products',
        'users',
      ]),
    );
  });

  it('enforces a unique email on users', () => {
    db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(
      'Jane Doe',
      'jane@example.com',
      'pw',
    );

    expect(() =>
      db
        .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
        .run('Jane Doe 2', 'jane@example.com', 'pw2'),
    ).toThrow();
  });
});
