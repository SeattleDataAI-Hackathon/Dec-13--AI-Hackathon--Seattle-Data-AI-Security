import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createXai } from '@ai-sdk/xai';
import { createMistral, mistral } from '@ai-sdk/mistral';

import { customProvider, wrapLanguageModel, extractReasoningMiddleware } from 'ai';

export interface ModelInfo {
  provider: string;
  name: string;
  description: string;
  apiVersion: string;
  capabilities: string[];
}

const middleware = extractReasoningMiddleware({
  tagName: 'think',
});

// Helper to get API keys from environment variables first, then localStorage
const getApiKey = (key: string): string | undefined => {
  // Check for environment variables first
  if (process.env[key]) {
    return process.env[key] || undefined;
  }

  // Fall back to localStorage if available
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key) || undefined;
  }

  return undefined;
};

// Create provider instances with API keys from localStorage
// const openaiClient = createOpenAI({
//   apiKey: getApiKey('OPENAI_API_KEY'),
// });

const anthropicClient = createAnthropic({
  apiKey: getApiKey('ANTHROPIC_API_KEY'),
});

const groqClient = createGroq({
  apiKey: getApiKey('GROQ_API_KEY'),
});

const mistralClient = createMistral({
  apiKey: getApiKey('MISTRAL_API_KEY'),
});

// const xaiClient = createXai({
//   apiKey: getApiKey('XAI_API_KEY'),
// });

const languageModels = {
  // "gpt-4.1-mini": openaiClient("gpt-4.1-mini"),
  'claude-4-sonnet': anthropicClient('claude-sonnet-4-20250514'),
  'qwen-qwq': wrapLanguageModel({
    model: groqClient('qwen/qwen3-32b'),
    middleware,
  }),
  'deepseek-r1-distill-qwen-32b': wrapLanguageModel({
    middleware: extractReasoningMiddleware({
      tagName: 'think',
    }),
    model: groqClient('deepseek-r1-distill-qwen-32b'),
  }),

  'mistral-large': mistralClient('mistral-large-latest'),
  'mistral-small': mistralClient('mistral-small-latest'),

  'pixtral-large': mistralClient('pixtral-large-latest'),
  'ministral-3b': mistralClient('ministral-3b-latest'),
  'ministral-8b': mistralClient('ministral-8b-latest'),

  // "grok-3-mini": xaiClient("grok-3-mini-latest"),
};

export const modelDetails: Record<keyof typeof languageModels, ModelInfo> = {
  // "gpt-4.1-mini": {
  //   provider: "OpenAI",
  //   name: "GPT-4.1 Mini",
  //   description: "Compact version of OpenAI's GPT-4.1 with good balance of capabilities, including vision.",
  //   apiVersion: "gpt-4.1-mini",
  //   capabilities: ["Balance", "Creative", "Vision"]
  // },
  'claude-4-sonnet': {
    provider: 'Anthropic',
    name: 'Claude 4 Sonnet',
    description:
      "Latest version of Anthropic's Claude 4 Sonnet with strong reasoning and coding capabilities.",
    apiVersion: 'claude-sonnet-4-20250514',
    capabilities: ['Reasoning', 'Efficient', 'Agentic'],
  },
  'qwen-qwq': {
    provider: 'Groq',
    name: 'Qwen QWQ',
    description:
      "Latest version of Alibaba's Qwen QWQ with strong reasoning and coding capabilities.",
    apiVersion: 'qwen-qwq',
    capabilities: ['Reasoning', 'Efficient', 'Agentic'],
  },
  'deepseek-r1-distill-qwen-32b': {
    provider: 'Groq',
    name: 'DeepSeek R1 Distill Qwen 32B',
    description:
      'Distilled version of DeepSeek R1 based on Qwen 32B with strong reasoning capabilities, running on Groq infrastructure.',
    apiVersion: 'deepseek-r1-distill-qwen-32b',
    capabilities: ['Reasoning', 'Fast', 'Coding', 'Agentic'],
  },
  'mistral-large': {
    provider: 'Mistral',
    name: 'Mistral Large',
    description:
      "Mistral's flagship model with top-tier reasoning, knowledge, and coding capabilities.",
    apiVersion: 'mistral-large-latest',
    capabilities: ['Reasoning', 'Coding', 'Multilingual', 'Function Calling'],
  },
  'mistral-small': {
    provider: 'Mistral',
    name: 'Mistral Small',
    description:
      'Cost-efficient model optimized for low-latency workloads with strong performance.',
    apiVersion: 'mistral-small-latest',
    capabilities: ['Fast', 'Efficient', 'Coding', 'Function Calling'],
  },
  'pixtral-large': {
    provider: 'Mistral',
    name: 'Pixtral Large',
    description: 'Multimodal model with 123B parameters, combining vision and text understanding.',
    apiVersion: 'pixtral-large-latest',
    capabilities: ['Vision', 'Multimodal', 'Reasoning', 'Function Calling'],
  },
  'ministral-3b': {
    provider: 'Mistral',
    name: 'Ministral 3B',
    description: 'Ultra-lightweight 3B parameter model for edge and on-device use cases.',
    apiVersion: 'ministral-3b-latest',
    capabilities: ['Fast', 'Lightweight', 'Edge', 'Function Calling'],
  },
  'ministral-8b': {
    provider: 'Mistral',
    name: 'Ministral 8B',
    description: 'Compact 8B parameter model balancing performance and efficiency.',
    apiVersion: 'ministral-8b-latest',
    capabilities: ['Fast', 'Efficient', 'Function Calling'],
  },
  // "grok-3-mini": {
  //   provider: "XAI",
  //   name: "Grok 3 Mini",
  //   description: "Latest version of XAI's Grok 3 Mini with strong reasoning and coding capabilities.",
  //   apiVersion: "grok-3-mini-latest",
  //   capabilities: ["Reasoning", "Efficient", "Agentic"]
  // },
};

// Update API keys when localStorage changes (for runtime updates)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    // Reload the page if any API key changed to refresh the providers
    if (event.key?.includes('API_KEY')) {
      window.location.reload();
    }
  });
}

export const model = customProvider({
  languageModels,
});

export type modelID = keyof typeof languageModels;

export const MODELS = Object.keys(languageModels);

export const defaultModel: modelID = 'qwen-qwq';
