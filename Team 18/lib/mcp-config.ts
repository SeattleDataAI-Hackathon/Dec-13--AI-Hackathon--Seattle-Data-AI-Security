import { MCPServer } from './context/mcp-context';

interface MCPConfigEntry {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

interface MCPConfig {
  [key: string]: MCPConfigEntry;
}

let cachedConfig: MCPServer[] | null = null;

/**
 * Load MCP servers from .mcp-config.json file
 * This runs on the client side and fetches the config file
 */
export async function loadMCPConfig(): Promise<MCPServer[]> {
  // Return cached config if available
  if (cachedConfig) {
    console.log('Returning cached MCP config:', cachedConfig);
    return cachedConfig;
  }

  try {
    console.log('Fetching .mcp-config.json...');
    console.log('Current location:', typeof window !== 'undefined' ? window.location.href : 'SSR');

    const response = await fetch('/.mcp-config.json');
    console.log('Fetch response status:', response.status, 'OK:', response.ok);

    if (!response.ok) {
      console.warn('No .mcp-config.json file found, using empty config. Status:', response.status);
      cachedConfig = [];
      return [];
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.warn('.mcp-config.json returned non-JSON content, using empty config');
      cachedConfig = [];
      return [];
    }

    const text = await response.text();
    console.log('Response text:', text);
    
    let config: MCPConfig;
    try {
      config = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Response was:', text.substring(0, 200));
      cachedConfig = [];
      return [];
    }
    
    console.log('Loaded MCP config:', config);

    // Transform config entries into MCPServer objects
    const servers: MCPServer[] = Object.entries(config).map(([id, entry]) => {
      // Convert env object to KeyValuePair array
      const env = entry.env
        ? Object.entries(entry.env).map(([key, value]) => ({ key, value }))
        : [];

      return {
        id: `config-${id}`,
        name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
        url: '', // stdio servers don't have URLs initially
        type: 'stdio' as const,
        command: entry.command,
        args: entry.args,
        env,
        headers: [],
        description: `MCP server from config: ${id}`,
        status: 'disconnected' as const,
        isFixed: true, // Mark as fixed so users can't delete config-based servers
      };
    });

    console.log('Transformed config servers:', servers);
    cachedConfig = servers;
    return servers;
  } catch (error) {
    console.error('Error loading .mcp-config.json:', error);
    cachedConfig = [];
    return [];
  }
}

/**
 * Clear the cached config (useful for hot reloading)
 */
export function clearMCPConfigCache(): void {
  cachedConfig = null;
}
