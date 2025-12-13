import { AzureOpenAI } from 'openai';
import { readFileSync } from 'fs';

interface ICD10Code {
  code: string;
  description: string;
  category: string;
  clinical_context: string;
  code_type: 'diagnosis' | 'procedure';
}

interface ICD10Embedding {
  code: string;
  embedding: number[];
}

interface CodeMatch {
  code: string;
  description: string;
  category: string;
  code_type: 'diagnosis' | 'procedure';
  similarity: number;
}

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Tool for searching ICD-10 codes using semantic embeddings
 */
export class ICD10SearchTool {
  private codes: ICD10Code[];
  private embeddings: ICD10Embedding[];
  private client: AzureOpenAI;
  private embeddingDeployment: string;

  constructor() {
    const endpoint = process.env.AZURE_EMBEDDINGS_ENDPOINT;
    const apiKey = process.env.AZURE_EMBEDDINGS_API_KEY;
    const deployment = process.env.AZURE_EMBEDDINGS_DEPLOYMENT;

    if (!endpoint || !apiKey || !deployment) {
      throw new Error(
        'Missing required environment variables. Please set AZURE_EMBEDDINGS_ENDPOINT, AZURE_EMBEDDINGS_API_KEY, and AZURE_EMBEDDINGS_DEPLOYMENT'
      );
    }

    this.embeddingDeployment = deployment;
    this.client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion: '2024-12-01-preview',
    });

    // Load codes and embeddings into memory
    this.codes = JSON.parse(readFileSync('src/icd10-database.json', 'utf-8'));
    this.embeddings = JSON.parse(readFileSync('src/icd10-embeddings.json', 'utf-8'));

    if (this.codes.length !== this.embeddings.length) {
      throw new Error(
        `Code and embedding count mismatch: ${this.codes.length} codes vs ${this.embeddings.length} embeddings`
      );
    }
  }

  /**
   * Search for ICD-10 codes matching the query using semantic similarity
   * @param query - Clinical terminology or description to search for
   * @param codeType - Optional filter for diagnosis or procedure codes only
   * @returns Top 10 most similar codes with descriptions
   */
  async searchICD10Codes(query: string, codeType?: 'diagnosis' | 'procedure'): Promise<CodeMatch[]> {
    // Generate embedding for the query
    let queryEmbedding: number[];
    try {
      const response = await this.client.embeddings.create({
        model: this.embeddingDeployment,
        input: query,
      });
      queryEmbedding = response.data[0].embedding;
    } catch (error) {
      // Fail fast on embedding API errors
      throw new Error(
        `Failed to generate embedding for query: ${error instanceof Error ? error.message : error}`
      );
    }

    // Compute similarity scores for codes (filtered by type if specified)
    const similarities: Array<{ index: number; similarity: number }> = [];
    for (let i = 0; i < this.embeddings.length; i++) {
      // Skip if code type filter is specified and doesn't match
      if (codeType && this.codes[i].code_type !== codeType) {
        continue;
      }
      
      const similarity = cosineSimilarity(queryEmbedding, this.embeddings[i].embedding);
      similarities.push({ index: i, similarity });
    }

    // Sort by similarity (highest first) and take top 10
    similarities.sort((a, b) => b.similarity - a.similarity);
    const top10 = similarities.slice(0, 10);

    // Map to code matches
    const matches: CodeMatch[] = top10.map((item) => {
      const code = this.codes[item.index];
      return {
        code: code.code,
        description: code.description,
        category: code.category,
        code_type: code.code_type,
        similarity: item.similarity,
      };
    });

    return matches;
  }

  /**
   * Get the function definition for Azure OpenAI tool calling
   */
  static getToolDefinition() {
    return {
      type: 'function' as const,
      function: {
        name: 'searchICD10Codes',
        description:
          'Search ICD-10 database for diagnosis codes (ICD-10-CM) and procedure codes (ICD-10-PCS) matching clinical terminology or to validate billed codes. Use this when you need to find appropriate diagnosis codes, procedure codes for surgeries/treatments, verify if a billed code is correct, or suggest alternative codes based on clinical documentation.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description:
                'Clinical terminology, symptoms, conditions, procedures, or code to search for (e.g., "back pain radiating to leg", "preventive wellness exam", "knee replacement surgery", "spinal fusion", "Z00.00", "0SRC0KD")',
            },
            code_type: {
              type: 'string',
              enum: ['diagnosis', 'procedure'],
              description:
                'Optional: Filter results to only diagnosis codes (ICD-10-CM) or procedure codes (ICD-10-PCS). Use "diagnosis" for conditions/symptoms, "procedure" for surgeries/treatments. Omit to search both types.',
            },
          },
          required: ['query'],
        },
      },
    };
  }
}
