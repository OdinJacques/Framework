import fs from 'node:fs';
import path from 'node:path';
import type { DatabaseSync } from 'node:sqlite';

// Loaded via process.getBuiltinModule rather than `import 'node:sqlite'` because
// Vite/vite-node's builtin-module list predates node:sqlite and mis-resolves it.
const { DatabaseSync: DatabaseSyncCtor } = process.getBuiltinModule('node:sqlite');

const SCHEMA_PATH = path.resolve(__dirname, '../db/schema.sql');

/**
 * Creates a fresh, schema-initialized SQLite database using Node's built-in
 * node:sqlite module (no native compilation, no docker). Defaults to an
 * in-memory database so every test run starts from a clean state.
 */
export function createDatabase(filePath: string = ':memory:'): DatabaseSync {
  const db = new DatabaseSyncCtor(filePath);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(fs.readFileSync(SCHEMA_PATH, 'utf-8'));
  return db;
}
