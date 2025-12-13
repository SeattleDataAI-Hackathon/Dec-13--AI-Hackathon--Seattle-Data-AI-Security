#!/bin/bash

# Auto-check for Generative Language API activation
echo "🔄 Starting API activation checker..."
echo "Will test every 2 minutes. Press Ctrl+C to stop."
echo ""

count=0
max_attempts=45  # Check for up to 90 minutes (45 × 2 min)

while [ $count -lt $max_attempts ]; do
  count=$((count + 1))
  
  echo "[$count/$max_attempts] Testing API... $(date '+%H:%M:%S')"
  
  result=$(cd /home/jaiden/Hackathon/backend && node check-api.js 2>&1)
  
  if echo "$result" | grep -q "SUCCESS"; then
    echo ""
    echo "✅ ✅ ✅ SUCCESS! GENERATIVE LANGUAGE API IS READY! ✅ ✅ ✅"
    echo ""
    echo "Your Google Generative Language API is now active!"
    echo "You can now enable real AI in LearnMap.ai:"
    echo ""
    echo "1. Edit: /home/jaiden/Hackathon/backend/.env"
    echo "2. Change: USE_MOCK_DATA=false"
    echo "3. Restart backend: cd /home/jaiden/Hackathon/backend && node server.js"
    echo ""
    echo "Then refresh your browser at http://localhost:5173"
    echo ""
    exit 0
  fi
  
  if [ $count -lt $max_attempts ]; then
    echo "   Still initializing... waiting 2 minutes"
    sleep 120
  fi
done

echo ""
echo "❌ API did not activate after 90 minutes"
echo "Try these steps:"
echo "1. Check Google Cloud Console for billing/quota issues"
echo "2. Try enabling it again"
echo "3. Contact Google Cloud Support"
