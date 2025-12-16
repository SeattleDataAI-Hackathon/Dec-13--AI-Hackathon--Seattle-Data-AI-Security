#!/usr/bin/env tsx
import { AzureOpenAI } from 'openai';
import { readFileSync, writeFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

interface ICD10Code {
  code: string;
  description: string;
  category: string;
  clinical_context: string;
}

interface ICD10Embedding {
  code: string;
  embedding: number[];
}

async function generateEmbeddings() {
  const endpoint = process.env.AZURE_EMBEDDINGS_ENDPOINT;
  const apiKey = process.env.AZURE_EMBEDDINGS_API_KEY;
  const deployment = process.env.AZURE_EMBEDDINGS_DEPLOYMENT;

  if (!endpoint || !apiKey || !deployment) {
    throw new Error(
      'Missing required environment variables. Please set AZURE_EMBEDDINGS_ENDPOINT, AZURE_EMBEDDINGS_API_KEY, and AZURE_EMBEDDINGS_DEPLOYMENT'
    );
  }

  console.log('🔧 Initializing Azure OpenAI client...');
  const client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion: '2024-12-01-preview',
  });

  // Read ICD-10 database
  console.log('📖 Reading ICD-10 database...');
  const databasePath = 'src/icd10-database.json';
  const codes: ICD10Code[] = JSON.parse(readFileSync(databasePath, 'utf-8'));
  console.log(`   Found ${codes.length} codes\n`);

  // Generate embeddings
  const embeddings: ICD10Embedding[] = [];
  console.log('🚀 Generating embeddings...');

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    // Concatenate description + clinical_context for richer semantic representation
    const textToEmbed = `${code.description} ${code.clinical_context}`;

    try {
      const response = await client.embeddings.create({
        model: deployment,
        input: textToEmbed,
      });

      const embedding = response.data[0].embedding;
      embeddings.push({
        code: code.code,
        embedding: embedding,
      });

      // Progress indicator
      const progress = ((i + 1) / codes.length * 100).toFixed(1);
      process.stdout.write(`\r   Progress: ${i + 1}/${codes.length} (${progress}%)`);
    } catch (error) {
      console.error(`\n❌ Error embedding code ${code.code}:`, error);
      throw error;
    }
  }

  console.log('\n');

  // Save embeddings
  const outputPath = 'src/icd10-embeddings.json';
  console.log(`💾 Saving embeddings to ${outputPath}...`);
  writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));

  console.log('✅ Embeddings generated successfully!\n');
  console.log(`   Total codes: ${embeddings.length}`);
  console.log(`   Embedding dimension: ${embeddings[0].embedding.length}`);
}

// Run the script
generateEmbeddings().catch((error) => {
  console.error('\n❌ Fatal error:', error instanceof Error ? error.message : error);
  process.exit(1);
});
