import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const MODEL = process.env.MODEL || 'mistral'

// Middleware
app.use(cors())
app.use(express.json())

// Routes

/**
 * Process thought dump through the Uncluttered workflow
 */
app.post('/process-thoughts', async (req, res) => {
  const { thoughts, stage = 'classify' } = req.body

  if (!thoughts || thoughts.trim() === '') {
    return res.status(400).json({ error: 'Thoughts cannot be empty' })
  }

  try {
    let systemPrompt = ''
    let userPrompt = ''

    if (stage === 'classify') {
      systemPrompt = `You are an expert life coach and organizer. Your task is to help people unclutter their minds by organizing chaotic thoughts.

Take the messy thoughts provided and classify each distinct thought into one of these categories:
- ACTION: Something they should do
- FEELING: An emotion or emotional state
- BELIEF: A conviction or belief they hold
- DECISION: Something they need to decide
- WORRY: Something they're anxious about
- IDEA: A creative thought or aspiration
- OTHER: Anything that doesn't fit above

Format your response as a clear, numbered list with each thought preceded by its category in brackets.`

      userPrompt = `Please classify these messy thoughts:\n\n${thoughts}`
    } else if (stage === 'prioritize') {
      systemPrompt = `You are an expert in prioritization and time management. 

Review these classified thoughts and assign each one a priority level (HIGH, MEDIUM, or LOW) based on:
1. Impact on the person's wellbeing and life
2. Urgency of the item
3. Whether it's actionable or needs release

Format: Show each item with its category, current priority, and brief reasoning.`

      userPrompt = `Please prioritize these thoughts:\n\n${thoughts}`
    } else if (stage === 'convert-to-actions') {
      systemPrompt = `You are an expert at converting thoughts into clear, actionable steps.

Review the prioritized items and for each HIGH priority item that is an ACTION or DECISION:
1. Break it down into concrete, specific steps
2. Suggest a timeline
3. Identify any blockers or dependencies

For items that are FEELINGS, WORRIES, or BELIEFS, suggest how to address them (release, acceptance practice, etc).

Be concise and practical.`

      userPrompt = `Please convert these prioritized thoughts into actionable steps:\n\n${thoughts}`
    } else if (stage === 'release-ritual') {
      systemPrompt = `You are a compassionate guide helping someone let go of what no longer serves them.

Based on the thoughts that are LOW priority, worries, or limiting beliefs, design a brief release ritual.
This could include:
- Acknowledgment of the thought
- Permission to let it go
- A symbolic action (writing it down and burning it, etc.)
- A positive affirmation to replace it

Make it poetic, meaningful, and actionable. This should be a transformative moment.`

      userPrompt = `Please create a release ritual for these items I want to let go of:\n\n${thoughts}`
    } else {
      return res.status(400).json({ error: 'Invalid stage. Valid stages: classify, prioritize, convert-to-actions, release-ritual' })
    }

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}\n\nResponse:`

    // Call Ollama API
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: MODEL,
        prompt: fullPrompt,
        stream: false,
        temperature: 0.5,
        top_p: 0.8,
        top_k: 40,
        num_predict: 150,
        keep_alive: "5m"
      },
      { timeout: 120000 }
    )

    const aiResponse = response.data.response.trim()

    res.json({ response: aiResponse, stage: stage })
  } catch (error) {
    console.error('Processing error:', error.message)
    res.status(500).json({ 
      error: 'Failed to process thoughts',
      details: error.message
    })
  }
})

/**
 * Check if Ollama model is available and ready
 */
app.get('/status', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`)
    
    // Check if the desired model is available
    const models = response.data.models || []
    const modelAvailable = models.some(m => m.name.includes(MODEL))
    
    if (modelAvailable) {
      res.json({ 
        status: 'ready',
        model: MODEL,
        availableModels: models.map(m => m.name)
      })
    } else {
      res.json({ 
        status: 'error',
        message: `Model '${MODEL}' not found. Available: ${models.map(m => m.name).join(', ')}`
      })
    }
  } catch (error) {
    console.error('Ollama connection error:', error.message)
    res.json({ 
      status: 'error',
      message: 'Cannot connect to Ollama. Make sure it is running on ' + OLLAMA_URL
    })
  }
})

/**
 * Chat endpoint - send message to AI Agent
 */
app.post('/chat', async (req, res) => {
  const { message, conversation = [] } = req.body

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message cannot be empty' })
  }

  try {
    // Format conversation history for the model
    let prompt = ''
    
    // Add conversation context
    for (const msg of conversation) {
      if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n`
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n`
      }
    }
    
    // Add current message
    prompt += `User: ${message}\nAssistant:`

    // Call Ollama API
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        num_predict: 64,
        num_ctx: 512,
        keep_alive: "5m"
      },
      { timeout: 300000 } // 5 minute timeout for first inference
    )

    const aiResponse = response.data.response.trim()

    res.json({ response: aiResponse })
  } catch (error) {
    console.error('Chat error:', error.message)
    res.status(500).json({ 
      error: 'Failed to get response from AI Agent',
      details: error.message
    })
  }
})

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

/**
 * Get available models from Ollama
 */
app.get('/models', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`)
    res.json({ models: response.data.models || [] })
  } catch (error) {
    console.error('Error fetching models:', error.message)
    res.status(500).json({ 
      error: 'Failed to fetch available models',
      details: error.message
    })
  }
})

/**
 * Set the active model
 */
app.post('/models/set', (req, res) => {
  const { model } = req.body
  
  if (!model) {
    return res.status(400).json({ error: 'Model name is required' })
  }

  process.env.MODEL = model
  res.json({ message: `Model changed to ${model}` })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 AI Agent Server running on http://localhost:${PORT}`)
  console.log(`📡 Ollama endpoint: ${OLLAMA_URL}`)
  console.log(`🤖 Default model: ${MODEL}\n`)
})
