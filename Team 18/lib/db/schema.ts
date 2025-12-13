import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

// Message role enum type
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  TOOL = 'tool',
}

// SQLite schema
export const chats = sqliteTable('chats', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  userId: text('user_id').notNull(),
  title: text('title').notNull().default('New Chat'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const messages = sqliteTable('messages', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  chatId: text('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  parts: text('parts').notNull(), // Store as JSON string for SQLite
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Types for structured message content
export type MessagePart = {
  type: string;
  text?: string;
  toolCallId?: string;
  toolName?: string;
  args?: any;
  result?: any;
  [key: string]: any;
};

export type Attachment = {
  type: string;
  [key: string]: any;
};

export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type DBMessage = {
  id: string;
  chatId: string;
  role: string;
  parts: MessagePart[];
  createdAt: Date;
};
