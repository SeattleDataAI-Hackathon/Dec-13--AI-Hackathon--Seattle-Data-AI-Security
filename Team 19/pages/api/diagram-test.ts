import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Quick local test endpoint for diagram generation
// CHANGED: Added test endpoint to verify image generation without running full tutor loop
// Usage: POST to /api/diagram-test (no body needed) - uses hardcoded prompt for "2x + 3 = 11"
// This directly calls OpenAI to test the diagram generation flow

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Missing OPENAI_API_KEY environment variable' 
      });
    }

    // Hardcoded test prompt for "2x + 3 = 11" balance scale
    const testPrompt = 'Balance scale with 2 x-blocks and 3 unit blocks on left pan, 11 unit blocks on right pan, white background';
    
    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });
    const imageModel = process.env.OPENAI_IMAGE_MODEL || 'dall-e-3';

    // Call OpenAI Images API directly
    const response = await openai.images.generate({
      model: imageModel,
      prompt: testPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json'
    });

    const imageB64 = (response.data?.[0] as any)?.b64_json;
    const imageUrl = response.data?.[0]?.url;
    
    return res.status(200).json({
      message: 'Diagram test completed',
      prompt: testPrompt,
      model: imageModel,
      hasBase64: !!imageB64,
      hasUrl: !!imageUrl,
      // Return truncated base64 for verification (first 50 chars)
      base64Preview: imageB64 ? imageB64.substring(0, 50) + '...' : null,
      url: imageUrl || null
    });

  } catch (error: any) {
    console.error('Error in diagram-test API:', error);
    const errorStatus = error?.status || error?.response?.status;
    const errorData = error?.response?.data || error?.error;
    
    return res.status(500).json({ 
      error: 'Test failed',
      details: error?.message || 'Unknown error',
      status: errorStatus,
      data: errorData
    });
  }
}

