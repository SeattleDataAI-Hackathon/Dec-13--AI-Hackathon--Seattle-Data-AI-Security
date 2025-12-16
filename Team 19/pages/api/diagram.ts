import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// RELIABLE DIAGRAM GENERATION: Returns base64 images for reliability (no remote URL dependencies)
// CHANGED: Now uses base64 response format, configurable model via env, strong error logging
// This endpoint always returns 200 (except for invalid request body) with image_b64: null on failure

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Wrap entire handler in try/catch to catch all errors
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse request body first - this is the only case where we return 400
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Missing prompt' 
      });
    }

    // Check for API key - return 200 with null image_b64 if missing (non-blocking)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('[diagram] request failed', { 
        message: 'Missing OPENAI_API_KEY',
        status: 'no_key'
      });
      return res.status(200).json({ 
        image_b64: null,
        image_url: null,
        error: 'Missing OPENAI_API_KEY' 
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Get model from env with fallback - configurable for reliability
    // CHANGED: Now reads OPENAI_IMAGE_MODEL env var, falls back to dall-e-3 (gpt-image-1 doesn't exist)
    const imageModel = process.env.OPENAI_IMAGE_MODEL || 'dall-e-3';

    // Call OpenAI Images API using v4.x SDK syntax with base64 response for reliability
    // CHANGED: Now requests base64_json format instead of URL for reliability
    try {
      const response = await openai.images.generate({
        model: imageModel,
        prompt: prompt, // Prompt should already be formatted by caller
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'b64_json' // CHANGED: Use base64 for reliability
      });

      // Extract base64 image from the first result
      const imageB64 = (response.data?.[0] as any)?.b64_json;
      const imageUrl = response.data?.[0]?.url; // Keep URL as fallback for backward compat

      if (!imageB64 && !imageUrl) {
        console.error('[diagram] request failed', { 
          message: 'No image data in OpenAI response',
          status: 'no_data'
        });
        return res.status(200).json({ 
          image_b64: null,
          image_url: null,
          error: 'Diagram generation failed',
          details: 'No image data in response'
        });
      }

      // Return successful response with base64 (preferred) and URL (fallback)
      return res.status(200).json({ 
        image_b64: imageB64 || null,
        image_url: imageUrl || null
      });

    } catch (openaiError: any) {
      // Strong logging with full error details
      const errorStatus = openaiError?.status || openaiError?.response?.status;
      const errorData = openaiError?.response?.data || openaiError?.error;
      const errorMessage = openaiError?.message || 'Unknown OpenAI error';
      
      console.error('[diagram] request failed', {
        message: errorMessage,
        status: errorStatus,
        data: errorData
      });
      
      // Extract short details for client
      const shortDetails = errorData?.message || errorMessage;
      const truncatedDetails = shortDetails.length > 100 
        ? shortDetails.substring(0, 100) + '...' 
        : shortDetails;
      
      // Return 200 with null image_b64 - diagram generation is optional and non-blocking
      return res.status(200).json({ 
        image_b64: null,
        image_url: null,
        error: 'Diagram generation failed',
        details: truncatedDetails
      });
    }

  } catch (error: any) {
    // Catch any other unexpected errors
    console.error('[diagram] request failed', {
      message: error?.message || 'Unexpected error',
      status: 'unexpected',
      data: error
    });
    
    // NEVER return 500 from /api/diagram unless the request body itself is invalid
    // Diagram generation is optional, so return 200 with null image_b64
    return res.status(200).json({ 
      image_b64: null,
      image_url: null,
      error: 'Diagram generation failed',
      details: error?.message || 'Unexpected error'
    });
  }
}

