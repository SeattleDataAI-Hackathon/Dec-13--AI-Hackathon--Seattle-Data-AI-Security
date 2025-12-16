Development Server Commands
============================

## Terminal 1: Start Backend Server
cd server && npm run dev

Output should show:
  🚀 AI Agent Server running on http://localhost:3001
  📡 Ollama endpoint: http://localhost:11434
  🤖 Default model: mistral

## Terminal 2: Start Frontend Development Server
cd client && npm run dev

Output should show:
  VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/

## Access the Application
Open http://localhost:5173 in your browser

## Test the API
Test if the backend is working:
  curl http://localhost:3001/status

You should get a response like:
  {"status":"ready","model":"mistral","availableModels":["mistral:latest"]}
