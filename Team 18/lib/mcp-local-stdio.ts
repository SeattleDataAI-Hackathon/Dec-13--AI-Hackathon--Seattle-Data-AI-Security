import { spawn, ChildProcess } from 'child_process';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { KeyValuePair } from './context/mcp-context';

export interface LocalStdioConfig {
  id: string;
  command: string;
  args: string[];
  env?: KeyValuePair[];
}

export interface LocalStdioProcess {
  id: string;
  process: ChildProcess;
  transport: StdioClientTransport;
  createdAt: Date;
}

// Track active local stdio processes
const activeProcesses = new Map<string, LocalStdioProcess>();

/**
 * Start a local stdio MCP server process
 */
export async function startLocalStdioServer(config: LocalStdioConfig): Promise<LocalStdioProcess> {
  console.log(`Starting local stdio server: ${config.id}`, {
    command: config.command,
    args: config.args,
  });

  // Check if process already exists
  const existing = activeProcesses.get(config.id);
  if (existing && !existing.process.killed) {
    console.log(`Server ${config.id} already running, reusing process`);
    return existing;
  }

  // Prepare environment variables
  const processEnv = { ...process.env };
  if (config.env) {
    config.env.forEach((kv) => {
      processEnv[kv.key] = kv.value;
    });
  }

  // Spawn the child process
  const childProcess = spawn(config.command, config.args, {
    env: processEnv,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  // Create stdio transport for MCP client
  const transport = new StdioClientTransport({
    command: config.command,
    args: config.args,
    env: processEnv as Record<string, string>,
  });

  const localProcess: LocalStdioProcess = {
    id: config.id,
    process: childProcess,
    transport,
    createdAt: new Date(),
  };

  // Track the process
  activeProcesses.set(config.id, localProcess);

  // Handle process errors
  childProcess.on('error', (error) => {
    console.error(`Error in stdio process ${config.id}:`, error);
    activeProcesses.delete(config.id);
  });

  // Handle process exit
  childProcess.on('exit', (code, signal) => {
    console.log(`Stdio process ${config.id} exited with code ${code}, signal ${signal}`);
    activeProcesses.delete(config.id);
  });

  // Log stderr for debugging
  childProcess.stderr?.on('data', (data) => {
    console.error(`[${config.id} stderr]:`, data.toString());
  });

  console.log(`Local stdio server ${config.id} started successfully`);
  return localProcess;
}

/**
 * Stop a local stdio MCP server process
 */
export async function stopLocalStdioServer(id: string): Promise<boolean> {
  const localProcess = activeProcesses.get(id);
  if (!localProcess) {
    console.log(`No active process found for ${id}`);
    return false;
  }

  try {
    console.log(`Stopping local stdio server: ${id}`);

    // Close the transport
    await localProcess.transport.close();

    // Kill the process
    localProcess.process.kill('SIGTERM');

    // Wait a bit for graceful shutdown
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Force kill if still alive
    if (!localProcess.process.killed) {
      localProcess.process.kill('SIGKILL');
    }

    activeProcesses.delete(id);
    console.log(`Local stdio server ${id} stopped`);
    return true;
  } catch (error) {
    console.error(`Error stopping local stdio server ${id}:`, error);
    // Remove from tracking even if error occurred
    activeProcesses.delete(id);
    return false;
  }
}

/**
 * Get a local stdio transport for MCP client
 */
export function getLocalStdioTransport(id: string): StdioClientTransport | null {
  const localProcess = activeProcesses.get(id);
  if (!localProcess || localProcess.process.killed) {
    return null;
  }
  return localProcess.transport;
}

/**
 * Get active local stdio process
 */
export function getLocalStdioProcess(id: string): LocalStdioProcess | null {
  return activeProcesses.get(id) || null;
}

/**
 * Check if a local stdio process is running
 */
export function isLocalStdioServerRunning(id: string): boolean {
  const localProcess = activeProcesses.get(id);
  return !!localProcess && !localProcess.process.killed;
}

/**
 * Cleanup all local stdio processes
 */
export async function cleanupAllLocalStdioServers(): Promise<void> {
  console.log(`Cleaning up ${activeProcesses.size} local stdio servers`);
  const promises = Array.from(activeProcesses.keys()).map((id) => stopLocalStdioServer(id));
  await Promise.all(promises);
}

/**
 * Get all active local stdio server IDs
 */
export function getActiveLocalStdioServerIds(): string[] {
  return Array.from(activeProcesses.keys());
}
