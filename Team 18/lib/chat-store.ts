import { db } from './db';
import {
  chats,
  messages,
  type Chat,
  type Message,
  type MessagePart,
  type DBMessage,
} from './db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

type AIMessage = {
  role: string;
  content: string | any[];
  id?: string;
  parts?: MessagePart[];
};

type UIMessage = {
  id: string;
  role: string;
  content: string;
  parts: MessagePart[];
  createdAt?: Date;
};

type SaveChatParams = {
  id?: string;
  userId: string;
  messages?: any[];
  title?: string;
};

type ChatWithMessages = Chat & {
  messages: Message[];
};

// Function to convert AI messages to DB format
export function convertToDBMessages(aiMessages: AIMessage[], chatId: string): DBMessage[] {
  return aiMessages.map((msg) => {
    // Use existing id or generate a new one
    const messageId = msg.id || nanoid();

    // If msg has parts, use them directly
    if (msg.parts) {
      return {
        id: messageId,
        chatId,
        role: msg.role,
        parts: msg.parts,
        createdAt: new Date(),
      };
    }

    // Otherwise, convert content to parts
    let parts: MessagePart[];

    if (typeof msg.content === 'string') {
      parts = [{ type: 'text', text: msg.content }];
    } else if (Array.isArray(msg.content)) {
      if (msg.content.every((item) => typeof item === 'object' && item !== null)) {
        // Content is already in parts-like format
        parts = msg.content as MessagePart[];
      } else {
        // Content is an array but not in parts format
        parts = [{ type: 'text', text: JSON.stringify(msg.content) }];
      }
    } else {
      // Default case
      parts = [{ type: 'text', text: String(msg.content) }];
    }

    return {
      id: messageId,
      chatId,
      role: msg.role,
      parts,
      createdAt: new Date(),
    };
  });
}

// Convert DB messages to UI format
export function convertToUIMessages(dbMessages: Array<Message>): Array<UIMessage> {
  return dbMessages.map((message) => {
    // Parse parts if it's a string (from SQLite)
    const parts = typeof message.parts === 'string' ? JSON.parse(message.parts) : message.parts;

    return {
      id: message.id,
      parts: parts as MessagePart[],
      role: message.role as string,
      content: getTextContent(message), // For backward compatibility
      createdAt: message.createdAt ?? undefined,
    };
  });
}

// Helper function to generate user-friendly chat titles
function generateChatTitle(message: string): string {
  if (!message || message.trim().length === 0) {
    return 'New Chat';
  }

  // Clean up the message
  let cleanedMessage = message.trim();
  
  // Remove common prefixes
  const prefixes = [
    /^(can you|could you|please|would you|help me|i need|i want to|how do i|how to|what is|what are|tell me|show me|explain|create|make|build|write|generate)\s+/i
  ];
  
  for (const prefix of prefixes) {
    cleanedMessage = cleanedMessage.replace(prefix, '');
  }
  
  // Capitalize first letter
  cleanedMessage = cleanedMessage.charAt(0).toUpperCase() + cleanedMessage.slice(1);
  
  // Find the first sentence or clause
  const sentenceEnd = cleanedMessage.search(/[.!?;]|\s(and|or|but)\s/i);
  if (sentenceEnd > 0 && sentenceEnd < 60) {
    cleanedMessage = cleanedMessage.substring(0, sentenceEnd);
  }
  
  // Limit length to 40 characters for better display
  if (cleanedMessage.length > 40) {
    // Try to cut at a word boundary
    const lastSpace = cleanedMessage.substring(0, 40).lastIndexOf(' ');
    if (lastSpace > 20) {
      cleanedMessage = cleanedMessage.substring(0, lastSpace) + '...';
    } else {
      cleanedMessage = cleanedMessage.substring(0, 40) + '...';
    }
  }
  
  return cleanedMessage || 'New Chat';
}

// Helper to extract text from message
function extractMessageText(message: AIMessage): string {
  // Check for parts first (new format)
  if (message.parts && Array.isArray(message.parts)) {
    const textParts = message.parts.filter(
      (p: MessagePart) => p.type === 'text' && p.text
    );
    if (textParts.length > 0) {
      return textParts[0].text || '';
    }
  }
  // Fallback to content (old format)
  else if (typeof message.content === 'string') {
    return message.content;
  }
  return '';
}

export async function saveChat({ id, userId, messages: aiMessages, title }: SaveChatParams) {
  // Generate a new ID if one wasn't provided
  const chatId = id || nanoid();

  // Check if title is provided, if not generate one
  let chatTitle = title;

  // Generate title if messages are provided and no title is specified
  if (aiMessages && aiMessages.length > 0) {
    const hasEnoughMessages =
      aiMessages.length >= 2 &&
      aiMessages.some((m) => m.role === 'user') &&
      aiMessages.some((m) => m.role === 'assistant');

    if (!chatTitle || chatTitle === 'New Chat' || chatTitle === undefined) {
      // Find the first user message
      const firstUserMessage = aiMessages.find((m) => m.role === 'user');
      
      if (firstUserMessage) {
        const messageText = extractMessageText(firstUserMessage);
        chatTitle = generateChatTitle(messageText);
      } else {
        chatTitle = 'New Chat';
      }
    }
  } else {
    chatTitle = chatTitle || 'New Chat';
  }

  // Check if db is available
  if (!db) {
    console.warn('Database not available, skipping chat storage');
    return;
  }

  // Check if chat already exists
  const existingChat = await (db as any).query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
  });

  if (existingChat) {
    // Update existing chat
    await db
      .update(chats)
      .set({
        title: chatTitle,
        updatedAt: new Date(),
      })
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));
  } else {
    // Create new chat
    await db.insert(chats).values({
      id: chatId,
      userId,
      title: chatTitle,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return { id: chatId };
}

// Helper to get just the text content for display
export function getTextContent(message: Message): string {
  try {
    // Parse parts if it's a string (from SQLite)
    const parts = typeof message.parts === 'string' ? JSON.parse(message.parts) : message.parts;

    return parts
      .filter((part: MessagePart) => part.type === 'text' && part.text)
      .map((part: MessagePart) => part.text)
      .join('\n');
  } catch (e) {
    // If parsing fails, return empty string
    return '';
  }
}

export async function getChats(userId: string) {
  if (!db) {
    console.warn('Database not configured - returning empty chats list');
    return [];
  }
  return await (db as any).query.chats.findMany({
    where: eq(chats.userId, userId),
    orderBy: [desc(chats.updatedAt)],
  });
}

export async function getChatById(id: string, userId: string): Promise<ChatWithMessages | null> {
  if (!db) return null;
  const chat = await (db as any).query.chats.findFirst({
    where: and(eq(chats.id, id), eq(chats.userId, userId)),
  });

  if (!chat) return null;

  const chatMessages = await (db as any).query.messages.findMany({
    where: eq(messages.chatId, id),
    orderBy: [messages.createdAt],
  });

  return {
    ...chat,
    messages: chatMessages,
  };
}

export async function deleteChat(id: string, userId: string) {
  if (!db) return null;
  await db.delete(chats).where(and(eq(chats.id, id), eq(chats.userId, userId)));
}
