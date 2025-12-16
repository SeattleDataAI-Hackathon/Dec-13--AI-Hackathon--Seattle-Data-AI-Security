#!/bin/bash

# Quick Start Script for AI Agent Application
# This script helps you get the application running quickly

echo "🚀 AI Agent - Uncluttered Quick Start"
echo "======================================"
echo ""

# Check if Ollama is running
echo "📡 Checking Ollama connection..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✓ Ollama is running"
else
    echo "✗ Ollama is not running"
    echo "  Please start Ollama with: ollama serve"
    echo "  Then try again."
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✓ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client && npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
