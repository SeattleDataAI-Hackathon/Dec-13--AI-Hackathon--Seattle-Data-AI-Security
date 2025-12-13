# LearnMap.ai - How It Works (Beginner-Friendly Guide)

## Overview

LearnMap.ai is an AI-powered learning platform that:
1. **Tests your knowledge** with a smart quiz
2. **Analyzes your results** to find weak areas
3. **Creates a personalized roadmap** with real learning resources
4. **Lets you download** everything as a PDF

Think of it like a personal tutor that figures out what you need to learn and gives you a custom plan.

---

## The Flow (What Happens When You Use It)

### Step 1: You Enter a Topic
```
User types in: "Python"
User picks: "3 months"
```
↓ This information goes to the backend

### Step 2: Quiz Generation
The app asks the AI to create 5 questions about Python
```
Question 1: "What is the difference between a list and a tuple?"
Question 2: "What does the 'with' statement do?"
...etc
```

### Step 3: You Answer the Questions
You pick an answer for each question (or click "Skip" if you don't know)
```
Your Answer: "Lists are mutable, tuples are immutable" ✓ Correct!
Your Answer: "Skip" (you don't know this one)
```

### Step 4: Scoring & Analysis
The app checks your answers:
```
Your Score: 3/5 = 60%
Weak Areas: "Advanced concepts", "Practical applications"
Strong Areas: "Fundamentals", "Basic theory"
```

### Step 5: Personalized Roadmap
The AI creates a 5-step learning plan based on:
- Your score (60%)
- What you're bad at (weak areas)
- What you're good at (strong areas)

Each step includes:
- What to learn
- Real resources (Udemy courses, YouTube, official docs, books)
- Time estimate (e.g., "1-2 weeks")
- Whether resources are free or paid

### Step 6: Download
Click "Download as PDF" to save everything for offline reading

---

## The Technical Architecture

### Frontend (What You See)
**File: `src/App.tsx`**

This is the user interface - everything you click on:
- Input form (topic & timeline selection)
- Quiz display (questions & answer options)
- Results page (your score & performance)
- Roadmap page (learning path with resources)

**File: `src/App.css`**

All the styling - colors, spacing, buttons, animations

### Backend (The Brains)
**File: `backend/server.js`**

The server that handles requests. It has 4 endpoints (routes):

```
GET  /health                    → Check if server is running
POST /api/generate-quiz         → Create a quiz
POST /api/assess-knowledge      → Score the quiz
POST /api/generate-roadmap      → Create learning path
```

**File: `backend/services.js`**

The logic for each endpoint:
- `generateQuiz()` - Creates quiz questions
- `assessKnowledge()` - Scores your answers
- `generateRoadmap()` - Creates learning resources

**File: `backend/mock-data.js`**

Fake data used when you're testing locally (so you don't need to call the real AI)

**File: `backend/google-ai.js`**

Connects to Google's AI (Gemini) to generate smart content

---

## How Quizzes Are Generated

### Without AI (Mock Mode - For Testing)
```javascript
// Uses pre-written questions in mock-data.js
if (USE_MOCK_DATA === 'true') {
  return hardcodedQuestions;  // 5 fake questions for Python
}
```

### With AI (Real Mode)
```javascript
// Sends a prompt to Google's AI
const prompt = `Generate a 5-question quiz about Python...`;
const response = await invokeGoogleModel(prompt);
// AI responds with 5 realistic questions
```

---

## How Answers Are Scored

### The Process
```javascript
// For each question:
// - Compare user's answer with correct answer
// - Count how many are right
// - Calculate percentage (score / totalQuestions * 100)

if (userAnswer === correctAnswer) {
  correctCount++;  // This one was right!
}

percentage = (correctCount / 5) * 100;  // e.g., 60%
```

### What Counts as Correct?
- ✓ You selected the right option
- ✗ You selected wrong option
- ⊘ You clicked "Skip" (treated as wrong)

---

## How the Roadmap Works

### The Roadmap Has 5 Steps
Each step teaches you something new:

1. **Master Fundamentals** (1-2 weeks)
   - Resources: Official docs, beginner videos, interactive course
   
2. **Deep Dive into Weak Areas** (2-3 weeks)
   - Resources: Advanced guides, practice problems, expert courses
   
3. **Hands-On Projects** (3-4 weeks)
   - Resources: Project ideas, code templates, mentoring
   
4. **Optimization & Advanced Topics** (2-3 weeks)
   - Resources: Performance guides, system design, research papers
   
5. **Specialization** (Ongoing)
   - Resources: Certification programs, open-source contribution, mentorship

### Real Resources Included
```javascript
{
  "title": "The Complete Python Bootcamp",
  "type": "course",
  "creator": "Jose Portilla on Udemy",
  "isPremium": true,
  "url": "https://udemy.com/...",
  "description": "Comprehensive course covering Python basics to advanced"
}
```

---

## How Data Flows (The Network)

### Frontend → Backend
```
User clicks "Start Assessment"
         ↓
Browser sends HTTP request: 
POST /api/generate-quiz { topic: "Python" }
         ↓
Backend receives request
```

### Backend → AI
```
Server says to Google AI:
"Create a quiz about Python"
         ↓
Google AI thinks and responds:
{ questions: [...] }
         ↓
Server sends response back to browser
```

### Final Result
```
Browser displays the quiz questions
User sees them on screen
```

---

## Key Technologies

### Frontend
- **React** - Makes the UI interactive
- **TypeScript** - Makes JavaScript safer
- **Vite** - Bundles and runs the code fast
- **jsPDF** - Generates PDF downloads

### Backend
- **Node.js** - Runs JavaScript on server
- **Express** - Handles HTTP requests
- **Google Generative AI API** - The AI that creates content

### Communication
- **HTTP** - How frontend and backend talk
- **JSON** - Format for sending data

---

## The Quiz Generation Prompt (How AI Knows What to Do)

When generating a quiz, the app sends this to the AI:

```
"You are an expert educator. Generate a comprehensive 10-question quiz 
to assess someone's practical knowledge of Python. 

The quiz should:
1. Test real-world understanding
2. Progress from basic to intermediate
3. Cover key concepts and practical skills
4. Include realistic scenarios
5. Ensure exactly ONE correct answer per question

Return ONLY a valid JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0
    }
  ]
}"
```

The AI reads these instructions and follows them exactly.

---

## The Roadmap Generation Prompt

Similarly, for creating a roadmap:

```
"Create a personalized learning roadmap for someone learning Python.

Context:
- Timeline: 3 months
- Assessment Score: 60%
- Weak Areas: Advanced concepts, Practical applications
- Strong Areas: Fundamentals, Basic theory

Create 5 detailed learning steps with:
1. Real, specific resources (not generic)
2. Mix of FREE and PREMIUM options
3. Time estimates for each step
4. Progression from beginner to advanced

Example resources:
- 'The Complete Python Bootcamp' by Jose Portilla on Udemy
- 'Python Official Documentation' at python.org
- 'Corey Schafer's Python Tutorials' on YouTube"
```

The AI uses these instructions to create a realistic, detailed roadmap.

---

## Code Block Rendering (Special Feature)

If a quiz question contains code, it displays as a code block:

```bash
# Instead of seeing this:
"Type the command: npm install react && npm start"

# You see this (formatted nicely):
┌─────────────────────────────────────┐
│ $ npm install react                 │
│ $ npm start                         │
└─────────────────────────────────────┘
```

**How it works:**
```javascript
// In App.tsx, there's a function called renderQuestionText()
// It looks for ``` marks in the text
// If it finds them, it renders the content as a code block
// Different colors for different languages (bash = green, JavaScript = yellow)
```

---

## Button Formatting

All buttons have consistent styling:

### Submit Button (Blue Gradient)
- Used for "Start Assessment", "Submit Quiz", "Generate Roadmap"
- Full width, large padding
- Glows when hovered

### Navigation Button (Gray)
- Used for "Previous", "Next", "Start Over"
- Side by side layout
- Lighter styling

### Skip Button (Orange/Warning)
- Used for "I don't know"
- Stands out to indicate it's different
- Different hover effect

### Code
```javascript
.submit-btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);  // Blue gradient
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  // ... more styling
}

.nav-btn {
  background: #f8fafc;  // Light gray
  color: #1e293b;  // Dark text
  border: 2px solid #e2e8f0;
  // ... more styling
}
```

---

## File Structure Overview

```
Team 7/
├── src/
│   ├── App.tsx              ← Main React component (541 lines)
│   ├── App.css              ← All styling (1170+ lines)
│   └── main.tsx             ← Entry point
│
├── backend/
│   ├── server.js            ← Express server (handles requests)
│   ├── services.js          ← Quiz/roadmap logic
│   ├── google-ai.js         ← AI integration
│   ├── mock-data.js         ← Fake data for testing
│   └── .env                 ← API keys (secret!)
│
├── package.json             ← Frontend dependencies
└── README.md                ← Documentation
```

---

## Running the App (Step by Step)

### Terminal 1 - Start Backend
```bash
cd Team\ 7/backend
npm install          # Download dependencies first time
npm start            # Runs on localhost:5000
```

### Terminal 2 - Start Frontend
```bash
cd Team\ 7
npm install          # Download dependencies first time
npm run dev          # Runs on localhost:5173
```

### In Browser
```
Go to: http://localhost:5173
Start using the app!
```

---

## Environment Variables (.env)

The `.env` file contains:

```env
USE_MOCK_DATA=true
# When true: Uses fake quiz data (no AI calls, instant)
# When false: Calls real Google AI API (slower, more realistic)

GOOGLE_API_KEY=AIzaSy...
# Secret key to use Google's AI
# Keep this safe! Don't share it!
```

---

## Common Questions

### Q: Why do we need mock data?
**A:** Testing! If we only used the real AI:
- Every test would be slow (waiting for AI response)
- We'd use up API quota quickly
- Tests might fail if API is down

Mock data lets us test instantly during development.

### Q: How does the AI know good resources?
**A:** We tell it in the prompt! The prompt says:
- "Use actual course names"
- "Include real instructors"
- "Mix free and premium"

The AI has been trained on real courses and can suggest legitimate resources.

### Q: Why are there so many buttons?
**A:** Each button does something specific:
- **Submit** = Confirm your answers
- **Previous/Next** = Navigate quiz
- **Skip** = Don't know this one
- **Start Over** = Begin again

Clear buttons = better user experience.

### Q: What if the AI generates bad content?
**A:** You can:
1. Use mock mode (which has pre-checked content)
2. Edit the prompt in `services.js` to be more specific
3. Manually review responses before showing to users

---

## Summary

**LearnMap.ai is:**
- ✅ A quiz-based learning assessment tool
- ✅ Powered by Google's AI for smart content
- ✅ Personalized based on your answers
- ✅ Provides real, actionable learning resources
- ✅ Beautiful, modern UI
- ✅ Mobile-responsive design

**The Flow:**
1. User enters topic → 2. Quiz generated → 3. User answers → 4. Results analyzed → 5. Roadmap created → 6. PDF downloaded

**The Tech:**
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + Google AI
- Communication: HTTP + JSON

That's it! You now understand how the entire application works. 🎉

---

## Next Steps for Hackathon

- [ ] Test with different topics (Python, JavaScript, React, etc.)
- [ ] Try enabling real AI mode to see the difference
- [ ] Download a PDF roadmap
- [ ] Test on mobile devices
- [ ] Share with judges and explain the flow
- [ ] Show them the code and how it all connects

Good luck at the hackathon! 🚀
