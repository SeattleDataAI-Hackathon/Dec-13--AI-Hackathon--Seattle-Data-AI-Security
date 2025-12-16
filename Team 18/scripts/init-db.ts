import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { nanoid } from 'nanoid';

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
  console.log('✓ Created data directory');
}

// Initialize SQLite database
const dbPath = join(dataDir, 'local.db');
const db = new Database(dbPath);

console.log(`✓ Connected to SQLite database at: ${dbPath}`);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT 'New Chat',
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
  );
`);
console.log('✓ Created chats table');

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    parts TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
  );
`);
console.log('✓ Created messages table');

// Create indexes
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
  CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
  CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
`);
console.log('✓ Created indexes');

// Add default data
const defaultUserId = 'demo-user';
const defaultChatId = nanoid();

// Check if demo chat already exists
const existingChat = db.prepare('SELECT id FROM chats WHERE user_id = ?').get(defaultUserId);

if (!existingChat) {
  const now = Math.floor(Date.now() / 1000);

  // Insert default chat
  db.prepare(
    `
    INSERT INTO chats (id, user_id, title, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `
  ).run(defaultChatId, defaultUserId, 'Welcome to CoffeeCorp Chat', now, now);

  console.log('✓ Created default chat');

  // Insert welcome message
  const welcomeMessageId = nanoid();
  const welcomeParts = JSON.stringify([
    {
      type: 'text',
      text: "Welcome to Co-Creator! I'm your AI Marketing Copilot. I can help you:\n\n• Generate marketing strategies tailored to your business\n• Create platform-specific content (social posts, emails, outreach)\n• Schedule and automate marketing actions\n• Analyze performance and provide actionable insights\n• Discover local opportunities (events, fairs, partnerships)\n• Optimize campaigns for revenue, not just engagement\n\nLet's build a marketing strategy that actually drives paying customers. How can I help you today?",
    },
  ]);

  db.prepare(
    `
    INSERT INTO messages (id, chat_id, role, content, parts, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(
    welcomeMessageId,
    defaultChatId,
    'assistant',
    'Welcome to Co-Creator!',
    welcomeParts,
    now
  );

  console.log('✓ Created welcome message');
} else {
  console.log('✓ Default data already exists');
}

// Display stats
const chatCount = db.prepare('SELECT COUNT(*) as count FROM chats').get() as { count: number };
const messageCount = db.prepare('SELECT COUNT(*) as count FROM messages').get() as {
  count: number;
};

console.log('\n📊 Database Statistics:');
console.log(`   Chats: ${chatCount.count}`);
console.log(`   Messages: ${messageCount.count}`);
console.log('\n✅ Database initialization complete!');

db.close();
