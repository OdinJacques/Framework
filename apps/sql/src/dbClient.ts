import fs from 'node:fs';
import path from 'node:path';
import type { DatabaseSync } from 'node:sqlite';

// Loaded via process.getBuiltinModule rather than `import 'node:sqlite'` because
// Vite/vite-node's builtin list predates node:sqlite and mis-resolves it.
const REQUIRED_NODE_VERSION = 'Node >= 22.5 (this repo targets Node 24+)';

function loadSqliteModule(): typeof import('node:sqlite') {
  if (typeof process.getBuiltinModule !== 'function') {
    throw new Error(
      `node:sqlite is unavailable: process.getBuiltinModule doesn't exist on this runtime ` +
        `(current: ${process.version}). Requires ${REQUIRED_NODE_VERSION}.`,
    );
  }
  const sqliteModule = process.getBuiltinModule('node:sqlite');
  if (!sqliteModule?.DatabaseSync) {
    throw new Error(
      `node:sqlite is unavailable or missing DatabaseSync on this runtime ` +
        `(current: ${process.version}). Requires ${REQUIRED_NODE_VERSION}.`,
    );
  }
  return sqliteModule;
}

const { DatabaseSync: DatabaseSyncCtor } = loadSqliteModule();

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
