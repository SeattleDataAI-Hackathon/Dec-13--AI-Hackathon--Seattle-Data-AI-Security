import { useState, useEffect, useCallback } from 'react';
import { loadMCPConfig } from '@/lib/mcp-config';
import type { MCPServer } from '@/lib/context/mcp-context';

type SetValue<T> = T | ((val: T) => T);

/**
 * Custom hook for persistent localStorage state with SSR support
 * @param key The localStorage key
 * @param initialValue The initial value if no value exists in localStorage
 * @returns A stateful value and a function to update it
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Check if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';

  // Initialize state from localStorage or use initialValue
  useEffect(() => {
    if (!isBrowser) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(parseJSON(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key, isBrowser]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: SetValue<T>) => {
      if (!isBrowser) return;

      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, isBrowser]
  );

  return [storedValue, setValue] as const;
}

/**
 * Custom hook for persistent localStorage state with SSR support
 * @param key The localStorage key
 * @param initialValue The initial value if no value exists in localStorage
 * @returns A stateful value and a function to update it
 */
export function useLocalStorageMcpServers<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [configServers, setConfigServers] = useState<MCPServer[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const demoServer = {
    id: 'MCP-UI-Demo',
    name: 'MCP-UI Demo',
    url: 'https://remote-mcp-server-authless.idosalomon.workers.dev/sse',
    type: 'sse' as const,
    isFixed: true,
    status: 'connected' as const,
  };

  // Track when component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load MCP config from .mcp-config.json
  useEffect(() => {
    if (!isMounted) return;

    console.log('Starting MCP config load...');
    loadMCPConfig()
      .then((servers) => {
        console.log('Loaded config servers:', servers);
        setConfigServers(servers);
      })
      .catch((error) => {
        console.error('Failed to load MCP config:', error);
        setConfigServers([]);
      });
  }, [isMounted]);

  // Initialize state from localStorage or use initialValue
  useEffect(() => {
    if (!isMounted) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(parseJSON(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key, isMounted]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: SetValue<T>) => {
      if (!isMounted) return;

      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, isMounted]
  );

  // Combine demo server, config servers, and user servers
  // Avoid duplicates by filtering based on ID
  const allConfigServers = [demoServer, ...configServers];
  const configServerIds = new Set(allConfigServers.map((s) => s.id));

  const servers = [
    ...allConfigServers,
    ...(storedValue as any[]).filter((server: any) => !configServerIds.has(server.id)),
  ];

  console.log('Final servers list:', servers);
  console.log('Config servers count:', configServers.length);
  console.log('Stored value:', storedValue);

  return [servers, setValue] as const;
}

// Helper function to parse JSON with error handling
function parseJSON<T>(value: string): T {
  try {
    return JSON.parse(value);
  } catch {
    console.error('Error parsing JSON from localStorage');
    return {} as T;
  }
}

/**
 * A hook to get a value from localStorage (read-only) with SSR support
 * @param key The localStorage key
 * @param defaultValue The default value if the key doesn't exist
 * @returns The value from localStorage or the default value
 */
export function useLocalStorageValue<T>(key: string, defaultValue: T): T {
  const [value] = useLocalStorage<T>(key, defaultValue);
  return value;
}
