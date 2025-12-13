import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// System prompt for the "Equations as Balance & Undoing" tutor
// CHANGED: Added strict rules for diagram_prompt to ensure consistent balance-scale diagrams only
// The diagram_prompt MUST be balance-scale ONLY with specific formatting rules for reliability
const SYSTEM_PROMPT = `You are a math tutor teaching students to solve equations using the "Equations as Balance & Undoing" method. 
Help students understand equations as a balance scale where both sides must remain equal. Guide them through undoing operations step by step.

CRITICAL RULES FOR diagram_prompt:
- diagram_prompt MUST be balance-scale ONLY, with left/right pan described as x-blocks and unit blocks.
- No tape diagram, no number line, no extra objects, no shading, white background.
- Keep diagram prompts short and structured (under 50 words).
- Format: "Balance scale with [left side description] on left pan, [right side description] on right pan, white background"

Always respond with valid JSON in this exact format:
{
  "tutor_explanation": "Your explanation text here",
  "thinking_question": "A question to prompt student thinking",
  "diagram_prompt": "Balance scale with [left] on left pan, [right] on right pan, white background",
  "current_equation_state": "The current state of the equation",
  "is_complete": false
}`;

type TutorResponse = {
  tutor_explanation: string;
  thinking_question: string;
  diagram_prompt: string;
  current_equation_state: string;
  is_complete: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Wrap entire handler in try/catch to catch all errors
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check for API key first - this was causing 500 errors if missing
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        error: 'Missing OPENAI_API_KEY environment variable' 
      });
    }

    // Parse request body
    const { equation, user_message, conversation_history } = req.body;

    if (!equation || typeof equation !== 'string') {
      return res.status(400).json({ 
        error: 'Missing or invalid "equation" field in request body' 
      });
    }

    // Initialize OpenAI client with current API (no deprecated options)
    const openai = new OpenAI({ apiKey });

    // Construct messages array
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      }
    ];

    // Add conversation history if provided
    if (conversation_history && Array.isArray(conversation_history)) {
      messages.push(...conversation_history);
    }

    // Add current turn: equation and optional user message
    const userContent = user_message 
      ? `Equation: ${equation}\n\nStudent: ${user_message}`
      : `Equation: ${equation}`;

    messages.push({
      role: 'user',
      content: userContent
    });

    // Call OpenAI API with safe model "gpt-4o-mini" and json_object response format
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    // Extract response content
    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return res.status(500).json({ 
        error: 'No content in OpenAI response' 
      });
    }

    // Parse JSON response
    let tutorResponse: TutorResponse;
    try {
      tutorResponse = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse OpenAI response as JSON',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      });
    }

    // Validate required fields match expected tutor JSON structure
    const requiredFields: (keyof TutorResponse)[] = [
      'tutor_explanation',
      'thinking_question',
      'diagram_prompt',
      'current_equation_state',
      'is_complete'
    ];

    const missingFields = requiredFields.filter(
      field => !(field in tutorResponse) || tutorResponse[field] === undefined
    );

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(500).json({ 
        error: `Missing required fields in response: ${missingFields.join(', ')}`,
        received: tutorResponse
      });
    }

    // Validate types
    if (typeof tutorResponse.tutor_explanation !== 'string' ||
        typeof tutorResponse.thinking_question !== 'string' ||
        typeof tutorResponse.diagram_prompt !== 'string' ||
        typeof tutorResponse.current_equation_state !== 'string' ||
        typeof tutorResponse.is_complete !== 'boolean') {
      console.error('Invalid field types in response:', tutorResponse);
      return res.status(500).json({ 
        error: 'Invalid field types in response',
        received: tutorResponse
      });
    }

    // Return successful response with correct tutor JSON structure
    return res.status(200).json(tutorResponse);

  } catch (error: any) {
    // Log full error including error.response?.data for OpenAI API errors
    console.error('Error in tutor API:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    
    // Log OpenAI API error response if available
    if (error?.response?.data) {
      console.error('OpenAI API error response:', JSON.stringify(error.response.data, null, 2));
    }
    
    // Always return JSON { error: string } on failure
    const errorMessage = error?.response?.data?.error?.message 
      || error?.message 
      || 'Internal server error';
    
    return res.status(500).json({ 
      error: errorMessage
    });
  }
}

