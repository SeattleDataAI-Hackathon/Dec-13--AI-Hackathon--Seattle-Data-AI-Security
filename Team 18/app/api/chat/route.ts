import { model, type modelID } from '@/ai/providers';
import { smoothStream, streamText, type UIMessage } from 'ai';
import { appendResponseMessages } from 'ai';
import { nanoid } from 'nanoid';
import { initializeMCPClients, type MCPServerConfig } from '@/lib/mcp-client';
import {
  weatherTool,
  strategyAgentTool,
  contentAgentTool,
  executionAgentTool,
  analyticsAgentTool,
  localOpportunityTool,
  teamTool,
  hackathonInfoTool,
} from '@/ai/tools';
import { saveChat } from '@/lib/chat-store';
import { db } from '@/lib/db';
import { messages as messagesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const {
    messages,
    chatId,
    selectedModel,
    userId,
    mcpServers = [],
  }: {
    messages: UIMessage[];
    chatId?: string;
    selectedModel: modelID;
    userId: string;
    mcpServers?: MCPServerConfig[];
  } = await req.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = chatId || nanoid();

  // Save or update chat record
  try {
    await saveChat({
      id,
      userId,
      title: undefined, // Will be generated from first user message
    });
  } catch (error) {
    console.error('Error saving chat:', error);
  }

  // Save user messages to database
  try {
    if (db) {
      for (const message of messages.filter((m) => m.role === 'user')) {
        // Check if message already exists
        const existingMessage = await (db as any).query.messages.findFirst({
          where: eq(messagesTable.id, message.id),
        });

        if (!existingMessage) {
          await db.insert(messagesTable).values({
            id: message.id,
            chatId: id,
            role: message.role,
            parts: JSON.stringify(message.parts),
            createdAt: new Date(),
          });
        }
      }
    }
  } catch (error) {
    console.error('Error saving user messages:', error);
  }

  // Initialize MCP clients using the already running persistent SSE servers
  // mcpServers now only contains SSE configurations since stdio servers
  // have been converted to SSE in the MCP context
  const { tools: mcpTools, cleanup } = await initializeMCPClients(mcpServers, req.signal);

  // Merge custom tools with MCP tools
  const tools = {
    ...mcpTools,
    weather: weatherTool,
    strategyAgent: strategyAgentTool,
    contentAgent: contentAgentTool,
    executionAgent: executionAgentTool,
    analyticsAgent: analyticsAgentTool,
    localOpportunity: localOpportunityTool,
    teamInfo: teamTool,
    hackathonInfo: hackathonInfoTool,
  };

  console.log('messages', messages);
  console.log(
    'parts',
    messages.map((m) => m.parts.map((p) => p))
  );

  // Track if the response has completed
  let responseCompleted = false;

  const result = streamText({
    model: model.languageModel(selectedModel),
    system: `You are an AI Marketing Copilot for Co-Creator, helping small business owners, creators, and local sellers grow their businesses through intelligent marketing automation.
    
    You have access to 5 specialized agents:
    
    1. **Strategy Agent** - Creates comprehensive marketing strategies with platform recommendations, content calendars, and prioritized action steps
    2. **Content Agent** - Generates social media posts, email campaigns, and outreach messages in the user's brand voice
    3. **Execution Agent** - Schedules posts, automates email sequences, and sets up marketing workflows
    4. **Analytics Agent** - Tracks performance, explains what drives conversions, and provides revenue-focused insights
    5. **Local Opportunity Agent** - Discovers local markets, events, fairs, and partnership opportunities
    
    Today's date is ${new Date().toISOString().split('T')[0]}.
    
    ## Your Mission
    Help users with revenue-focused marketing that actually drives paying customers, not just vanity metrics like likes or followers.
    
    ## How to Help Users
    
    **Understanding their business:**
    - Ask about their business, products/services, target audience, and current challenges
    - Learn their brand voice, values, and unique selling points
    - Understand their goals (more customers, more sales, brand awareness, etc.)
    
    **Creating marketing strategies:**
    - Use the Strategy Agent to generate comprehensive multi-channel marketing plans
    - Provide clear priorities and next steps
    - Focus on platforms and tactics that match their audience and resources
    
    **Generating content:**
    - Use the Content Agent to create platform-specific posts, emails, and messages
    - Match their brand voice and maintain consistency across channels
    - Optimize content for engagement and conversions
    
    **Automating execution:**
    - Use the Execution Agent to schedule posts, set up email sequences, and automate workflows
    - Help them save time while maintaining consistent marketing presence
    
    **Tracking performance:**
    - Use the Analytics Agent to measure what's working and what's not
    - Focus on metrics that matter: conversions, sales, ROI, customer acquisition
    - Provide actionable recommendations based on data
    
    **Finding local opportunities:**
    - Use the Local Opportunity Agent to discover nearby markets, events, and partnership opportunities
    - Help them tap into their local community for in-person marketing
    
    ## Using MCP Tools
    You also have access to MCP (Model Context Protocol) tools for advanced capabilities like browser automation, file system access, and more.
    If users want additional tools, they can add MCP servers from the server icon in the bottom left corner of the sidebar.
    
    ## Best Practices
    - Be conversational, encouraging, and supportive—small business owners are often overwhelmed
    - Ask clarifying questions to understand their specific needs
    - Provide actionable, specific advice rather than generic tips
    - Focus on revenue and conversions, not vanity metrics
    - Break down complex marketing plans into manageable steps
    - Always provide some response, even if you need more information
    - Use the appropriate agent tools to provide comprehensive, data-driven assistance
    
    Remember: You're not just creating content—you're helping real businesses grow and succeed.
    `,
    messages,
    tools,
    maxSteps: 20,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 2048,
        },
      },
      anthropic: {
        thinking: {
          type: 'enabled',
          budgetTokens: 12000,
        },
      },
    },
    experimental_transform: smoothStream({
      delayInMs: 5, // optional: defaults to 10ms
      chunking: 'line', // optional: defaults to 'word'
    }),
    onError: (error) => {
      console.error(JSON.stringify(error, null, 2));
    },
    async onFinish({ response }) {
      responseCompleted = true;

      // Save assistant messages to database
      try {
        if (db) {
          for (const message of response.messages) {
            if (message.role === 'assistant') {
              // Check if message already exists
              const existingMessage = await (db as any).query.messages.findFirst({
                where: eq(messagesTable.id, message.id),
              });

              if (!existingMessage) {
                // Convert content to parts format
                let parts: any[] = [];
                if (typeof message.content === 'string') {
                  parts = [{ type: 'text', text: message.content }];
                } else if (Array.isArray(message.content)) {
                  parts = message.content.map((part: any) => {
                    if (typeof part === 'string') {
                      return { type: 'text', text: part };
                    }
                    return part;
                  });
                }

                await db.insert(messagesTable).values({
                  id: message.id,
                  chatId: id,
                  role: message.role,
                  parts: JSON.stringify(parts),
                  createdAt: new Date(),
                });
              }
            }
          }
        }

        // Update chat with messages for title generation
        await saveChat({
          id,
          userId,
          messages: [...messages, ...response.messages],
        });
      } catch (error) {
        console.error('Error saving assistant messages:', error);
      }

      // Clean up resources - now this just closes the client connections
      // not the actual servers which persist in the MCP context
      await cleanup();
    },
  });

  // Ensure cleanup happens if the request is terminated early
  req.signal.addEventListener('abort', async () => {
    if (!responseCompleted) {
      console.log('Request aborted, cleaning up resources');
      try {
        await cleanup();
      } catch (error) {
        console.error('Error during cleanup on abort:', error);
      }
    }
  });

  result.consumeStream();
  // Add chat ID to response headers so client can know which chat was created
  return result.toDataStreamResponse({
    sendReasoning: true,
    headers: {
      'X-Chat-ID': id,
    },
    getErrorMessage: (error) => {
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          return 'Rate limit exceeded. Please try again later.';
        }
      }
      console.error(error);
      return 'An error occurred.';
    },
  });
}
