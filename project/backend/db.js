import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, "data");
mkdirSync(dataDir, { recursive: true });

export const dbPath = join(dataDir, "subtrack.sqlite");

export function openDb() {
  const db = new DatabaseSync(dbPath);

  // Basic safety + better concurrency behavior for local dev
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      iuc TEXT,
      username TEXT,
      package TEXT,
      startDate TEXT,
      expiryDate TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Helpful index for quick search in small apps
  db.exec("CREATE INDEX IF NOT EXISTS idx_customers_iuc ON customers(iuc);");

  return db;
}

