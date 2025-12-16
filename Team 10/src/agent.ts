import { AzureOpenAI } from 'openai';
import { readFileSync } from 'fs';
import { SYSTEM_PROMPT, USER_PROMPT_TEMPLATE } from './prompts.js';
import type { AppealResponse } from './types.js';
import { ICD10SearchTool } from './tools.js';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';

export class AppealAgent {
  private client: AzureOpenAI;
  private deployment: string;
  private searchTool: ICD10SearchTool;
  private maxIterations = 10;
  private logs: string[] = [];

  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

    if (!endpoint || !apiKey || !deployment) {
      throw new Error(
        'Missing required environment variables. Please set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT'
      );
    }

    this.deployment = deployment;
    this.client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion: '2024-12-01-preview',
    });

    // Initialize ICD-10 search tool (loads embeddings into memory)
    this.searchTool = new ICD10SearchTool();
  }

  /**
   * Get agent activity logs
   */
  getLogs(): string[] {
    return this.logs;
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Read file contents from path
   */
  private readFile(filePath: string): string {
    try {
      return readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
  }

  /**
   * Generate appeal using Azure OpenAI with tool calling
   */
  async generateAppeal(denialPath: string, notesPath: string): Promise<AppealResponse> {
    // Read input files
    const denialContent = this.readFile(denialPath);
    const notesContent = this.readFile(notesPath);

    console.log('📄 Reading denial letter and clinical notes...');
    console.log('🤖 Analyzing with Azure OpenAI...\n');

    this.clearLogs();
    this.logs.push(`[${new Date().toISOString()}] Started appeal generation`);
    this.logs.push(`Denial letter: ${denialPath}`);
    this.logs.push(`Clinical notes: ${notesPath}`);

    try {
      // Initialize conversation with system and user messages
      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: USER_PROMPT_TEMPLATE(denialContent, notesContent),
        },
      ];

      // Define available tools
      const tools: ChatCompletionTool[] = [ICD10SearchTool.getToolDefinition()];

      let iteration = 0;
      let response;

      // Multi-turn conversation loop with max 3 iterations
      while (iteration < this.maxIterations) {
        iteration++;

        // Call Azure OpenAI
        response = await this.client.chat.completions.create({
          model: this.deployment,
          messages: messages,
          tools: tools,
          temperature: 0.3,
          response_format: iteration === this.maxIterations ? { type: 'json_object' } : undefined,
        });

        const choice = response.choices[0];
        if (!choice) {
          throw new Error('No response from Azure OpenAI');
        }

        const message = choice.message;

        // Add assistant's message to conversation
        messages.push(message);

        // Check if assistant wants to call a tool
        if (message.tool_calls && message.tool_calls.length > 0) {
          console.log(`🔍 Agent is searching ICD-10 codes (iteration ${iteration})...`);

          // Process each tool call
          for (const toolCall of message.tool_calls) {
            if (toolCall.function.name === 'searchICD10Codes') {
              const args = JSON.parse(toolCall.function.arguments);
              const codeTypeLabel = args.code_type ? ` (${args.code_type} only)` : '';
              console.log(`   Query: "${args.query}"${codeTypeLabel}`);

              this.logs.push(`\n[Iteration ${iteration}] Tool Call: searchICD10Codes`);
              this.logs.push(`Query: "${args.query}"${args.code_type ? ` [Type: ${args.code_type}]` : ''}`);

              // Execute the search
              const results = await this.searchTool.searchICD10Codes(args.query, args.code_type);

              // Format results for the agent
              const resultText = results
                .map((r) => `${r.code} [${r.code_type}]: ${r.description} (Category: ${r.category})`)
                .join('\n');

              console.log(`   Found ${results.length} matching codes\n`);

              // Log the results
              this.logs.push(`Results: Found ${results.length} codes`);
              results.forEach((r, idx) => {
                this.logs.push(`  ${idx + 1}. ${r.code} [${r.code_type}]: ${r.description.substring(0, 80)}${r.description.length > 80 ? '...' : ''}`);
              });

              // Add tool response to conversation
              messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: resultText,
              });
            }
          }

          // Continue the loop to get next response from assistant
          continue;
        }

        // No tool calls - check if we have final content
        if (message.content) {
          this.logs.push(`\n[${new Date().toISOString()}] Appeal generated successfully`);
          this.logs.push(`Scenario identified: ${JSON.parse(message.content).scenario}`);
          const appealResponse: AppealResponse = JSON.parse(message.content);
          return appealResponse;
        }

        // If we get here, something unexpected happened
        throw new Error('Assistant response did not contain content or tool calls');
      }

      // If we exhausted iterations, try to parse the last response
      if (response?.choices[0]?.message?.content) {
        const appealResponse: AppealResponse = JSON.parse(response.choices[0].message.content);
        return appealResponse;
      }

      throw new Error('Max iterations reached without generating final appeal');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Azure OpenAI API error: ${error.message}`);
      }
      throw error;
    }
  }
}
