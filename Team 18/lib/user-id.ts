import { nanoid } from 'nanoid';

const USER_ID_KEY = 'ai-chat-user-id';
const USER_NAME_KEY = 'coffeecorp-user-name';

export function getUserId(): string {
  // Only run this on the client side
  if (typeof window === 'undefined') return '';

  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    // Generate a new user ID and store it
    userId = nanoid();
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}

export function updateUserId(newUserId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_ID_KEY, newUserId);
}

export function getUserName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(USER_NAME_KEY) || '';
}

export function updateUserName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_NAME_KEY, name);
}
