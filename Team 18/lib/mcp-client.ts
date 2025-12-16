import { experimental_createMCPClient as createMCPClient } from 'ai';
import { startLocalStdioServer, stopLocalStdioServer } from './mcp-local-stdio';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface MCPServerConfig {
  url?: string;
  type: 'sse' | 'stdio';
  command?: string;
  args?: string[];
  env?: KeyValuePair[];
  headers?: KeyValuePair[];
}

export interface MCPClientManager {
  tools: Record<string, any>;
  clients: any[];
  localServerIds: string[];
  cleanup: () => Promise<void>;
}

/**
 * Initialize MCP clients for API calls
 * Handles both SSE servers and local stdio processes
 */
export async function initializeMCPClients(
  mcpServers: MCPServerConfig[] = [],
  abortSignal?: AbortSignal
): Promise<MCPClientManager> {
  // Initialize tools
  let tools = {};
  const mcpClients: any[] = [];
  const localServerIds: string[] = [];

  // Process each MCP server configuration
  for (const mcpServer of mcpServers) {
    try {
      if (mcpServer.type === 'stdio' && mcpServer.command && mcpServer.args) {
        // LOCAL STDIO MODE: Start local process
        const serverId = `local-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        console.log(`Starting local stdio server: ${serverId}`);

        const localProcess = await startLocalStdioServer({
          id: serverId,
          command: mcpServer.command,
          args: mcpServer.args,
          env: mcpServer.env,
        });

        localServerIds.push(serverId);

        // Create MCP client with the stdio transport from local process
        const mcpClient = await createMCPClient({
          transport: localProcess.transport,
        });
        mcpClients.push(mcpClient);

        const mcptools = await mcpClient.tools();
        console.log(`MCP tools from ${mcpServer.command}:`, Object.keys(mcptools));

        // Add MCP tools to tools object
        tools = { ...tools, ...mcptools };
      } else if (mcpServer.type === 'sse' && mcpServer.url) {
        // SSE MODE: Connect to persistent server
        const transport = {
          type: 'sse' as const,
          url: mcpServer.url,
          headers: mcpServer.headers?.reduce((acc, header) => {
            if (header.key) acc[header.key] = header.value || '';
            return acc;
          }, {} as Record<string, string>),
        };

        const mcpClient = await createMCPClient({ transport });
        mcpClients.push(mcpClient);

        const mcptools = await mcpClient.tools();
        console.log(`MCP tools from ${mcpServer.url}:`, Object.keys(mcptools));

        // Add MCP tools to tools object
        tools = { ...tools, ...mcptools };
      }
    } catch (error) {
      console.error('Failed to initialize MCP client:', error);
      // Continue with other servers instead of failing the entire request
    }
  }

  // Cleanup function
  const cleanup = async () => {
    await cleanupMCPClients(mcpClients, localServerIds);
  };

  // Register cleanup for all clients if an abort signal is provided
  if (abortSignal) {
    abortSignal.addEventListener('abort', cleanup);
  }

  return {
    tools,
    clients: mcpClients,
    localServerIds,
    cleanup,
  };
}

async function cleanupMCPClients(clients: any[], localServerIds: string[]): Promise<void> {
  // Clean up the MCP clients
  for (const client of clients) {
    try {
      await client.close();
    } catch (error) {
      console.error('Error closing MCP client:', error);
    }
  }

  // Stop local stdio servers
  for (const serverId of localServerIds) {
    try {
      await stopLocalStdioServer(serverId);
    } catch (error) {
      console.error(`Error stopping local stdio server ${serverId}:`, error);
    }
  }
}
