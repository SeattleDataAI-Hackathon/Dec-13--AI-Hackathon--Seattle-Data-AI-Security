import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Initialize SQLite connection
let db: ReturnType<typeof drizzle> | null = null;

try {
  console.log('Initializing SQLite database...');

  // Ensure data directory exists
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  const sqliteDb = new Database(join(dataDir, 'local.db'));
  db = drizzle(sqliteDb, { schema });
  console.log('✓ Database connection initialized (SQLite)');

  // Create tables if they don't exist
  initializeSqliteTables(sqliteDb);
} catch (error) {
  console.error('Failed to initialize database:', error);
}

function initializeSqliteTables(sqliteDb: Database.Database) {
  try {
    // Create chats table
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT 'New Chat',
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);

    // Create messages table
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        role TEXT NOT NULL,
        parts TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
      );
    `);

    // Create indexes
    sqliteDb.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
      CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
    `);

    console.log('✓ SQLite tables initialized');
  } catch (error) {
    console.error('Error initializing SQLite tables:', error);
  }
}

// Export db
export { db };
