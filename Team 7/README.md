# LearnMap.ai 🎓

**AI-Powered Learning Roadmap Generator**

An intelligent web application that generates personalized learning roadmaps based on your knowledge assessment. LearnMap.ai uses AI to create tailored learning paths, assess your current knowledge, and provide structured guidance for mastering new topics.

---

## 🌟 Features

### Core Functionality
- **Intelligent Quiz Generation** - AI-powered quizzes tailored to your learning topic
- **Knowledge Assessment** - Evaluate your current understanding with automatic scoring
- **Personalized Roadmaps** - AI-generated learning paths based on assessment results
- **Visual Feedback** - Color-coded answers (correct/incorrect/skipped) with detailed breakdowns
- **PDF Export** - Download your personalized roadmap as a PDF document

### User Experience
- **Modern, Responsive Design** - Beautiful UI that works on all devices
- **Smooth Animations** - Fluid transitions and interactive feedback
- **Intuitive Navigation** - Easy-to-use page flow: Home → Quiz → Review → Roadmap
- **Skip Questions** - "I don't know" button to skip difficult questions
- **Progress Tracking** - Real-time progress indicators during the quiz

### Technology Stack
- **Frontend**: React 18.2.0 with TypeScript
- **Backend**: Node.js with Express 5.2.1
- **Build Tool**: Vite 5.0.8
- **AI**: Google Generative AI (Gemini)
- **PDF Generation**: jsPDF 2.x
- **Styling**: Modern CSS with design system variables

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Internet connection (for AI features)

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd "Team 7"
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` folder:
   ```env
   USE_MOCK_DATA=true
   GOOGLE_API_KEY=your_api_key_here
   ```
   
   - `USE_MOCK_DATA=true` - Uses mock data for testing (no API calls)
   - `USE_MOCK_DATA=false` - Uses real Google AI (requires valid API key)

### Running the Application

#### Option 1: Run Both Servers (Recommended)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

Then open your browser to: `http://localhost:5173`

#### Option 2: Build for Production

```bash
# Build the frontend
npm run build

# This creates an optimized `dist` folder for deployment
```

---

## 📋 How It Works

### The Learning Flow

1. **Home Page** 
   - Enter the topic you want to learn
   - Select your preferred timeline (1 week to 6 months)
   - Click "Start Assessment"

2. **Quiz Page**
   - Answer 5 carefully crafted questions
   - Questions range from basic to intermediate difficulty
   - Use "I don't know" button to skip questions
   - Navigate between questions with Previous/Next buttons
   - Submit when ready

3. **Review Page**
   - See your score and percentage
   - Review each question with your answer vs. correct answer
   - Visual indicators: ✓ (correct), ✗ (wrong), ⊘ (skipped)
   - Identify strong areas and areas to improve

4. **Roadmap Page**
   - AI-generated personalized learning path
   - Step-by-step guidance with time estimates
   - Focus areas based on your performance
   - Download as PDF for offline reference

---

## 🏗️ Project Structure

```
Team 7/
├── src/
│   ├── App.tsx           # Main React component (408 lines)
│   ├── App.css           # Styling with design system (1190+ lines)
│   ├── main.tsx          # Entry point
│   ├── index.css         # Global styles
│   └── vite-env.d.ts     # Vite type definitions
│
├── backend/
│   ├── server.js         # Express server (107 lines)
│   ├── services.js       # API business logic (176 lines)
│   ├── google-ai.js      # Google AI integration
│   ├── mock-data.js      # Mock quiz/roadmap data
│   ├── package.json      # Backend dependencies
│   ├── .env              # Environment configuration
│   └── README.md         # Backend documentation
│
├── public/               # Static assets
├── dist/                 # Production build (generated)
├── package.json          # Frontend dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite bundler configuration
└── README.md             # This file
```

---

## 🔌 API Endpoints

All endpoints are hosted on `http://localhost:5000/api/`

### 1. Health Check
```
GET /health
Response: { "status": "Backend is running" }
```

### 2. Generate Quiz
```
POST /api/generate-quiz
Body: { "topic": "JavaScript" }
Response: {
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "type": "multiple-choice",
      "correctAnswer": 0
    },
    ...
  ]
}
```

### 3. Assess Knowledge
```
POST /api/assess-knowledge
Body: {
  "topic": "JavaScript",
  "answers": { "0": 0, "1": 1, "2": null, "3": 3, "4": 2 },
  "questions": [...]
}
Response: {
  "score": 4,
  "totalQuestions": 5,
  "percentage": 80,
  "weakAreas": ["Closures", "Prototypes"],
  "strongAreas": ["Data Types", "Functions"]
}
```

### 4. Generate Roadmap
```
POST /api/generate-roadmap
Body: { "topic": "JavaScript" }
Response: {
  "topic": "JavaScript",
  "timeline": "3 months",
  "steps": [
    {
      "title": "Master Fundamentals",
      "description": "Learn syntax, variables, data types, operators...",
      "estimatedTime": "2 weeks"
    },
    ...
  ],
  "summary": "...",
  "focusAreas": ["Advanced Concepts", "ES6+ Features"]
}
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `#6366f1` (Indigo) - Main brand color
- **Success**: `#10b981` (Green) - Correct answers, positive feedback
- **Error**: `#ef4444` (Red) - Wrong answers, errors
- **Warning**: `#f59e0b` (Amber) - Time badges, alerts
- **Background**: `#f8fafc` (Light slate) - Card backgrounds
- **Text Primary**: `#1e293b` (Dark slate) - Main text
- **Text Secondary**: `#64748b` (Slate) - Secondary text

### Typography
- **System Font Stack**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Font Sizes**: Responsive, scaled for mobile and desktop
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extra bold)

### Spacing
- **Base Unit**: 1rem (16px)
- **Common Gaps**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem
- **Padding Variants**: Responsive sizing for different screen sizes

---

## 🧪 Testing with Mock Data

By default, the application uses mock data for reliable testing:

```env
USE_MOCK_DATA=true
```

**Mock Quiz Questions** (5 questions):
- Question 1: Fundamentals - Correct answer: Option 0
- Question 2: Key concepts - Correct answer: Option 0
- Question 3: Learning timeline - Correct answer: Option 3
- Question 4: Common challenges - Correct answer: Option 3
- Question 5: Complementary skills - Correct answer: Option 3

**Mock Assessment Scoring**:
- Automatically compares user answers with correct answers
- Calculates percentage and score
- Identifies weak and strong areas

---

## 🔑 Environment Variables

### Backend (.env)
```env
# Enable/disable mock data mode
USE_MOCK_DATA=true

# Google Generative AI API key (for real quizzes)
GOOGLE_API_KEY=your_api_key_here

# Server port (optional, defaults to 5000)
PORT=5000
```

### Frontend (vite.config.ts)
```typescript
server: {
  port: 5173,           // Dev server port
  host: '127.0.0.1',    // Localhost only
  strictPort: true,     // Fail if port is in use
}
```

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Desktop**: 1024px+ (full layout)
- **Tablet**: 768px - 1023px (optimized grid)
- **Mobile**: Below 768px (stacked layout)
- **Small Mobile**: Below 480px (minimal padding)

All pages automatically adapt to screen size with:
- Flexible grid layouts
- Responsive typography
- Touch-friendly button sizes
- Optimized spacing

---

## ⚙️ Configuration

### Vite Configuration (vite.config.ts)
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
    strictPort: true,
  },
})
```

### TypeScript Configuration (tsconfig.json)
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- JSX support for React

---

## 🐛 Troubleshooting

### Frontend not loading
1. Ensure backend is running: `curl http://localhost:5000/health`
2. Check if port 5173 is in use: `lsof -i :5173`
3. Clear browser cache and reload
4. Check browser console (F12) for errors

### Backend API errors
1. Verify `.env` file exists in `backend/` folder
2. Check if Google API key is valid (if not using mock data)
3. Ensure Node.js is installed: `node --version`
4. Reinstall dependencies: `npm install`

### Quiz not loading
1. Enable mock mode: `USE_MOCK_DATA=true` in `.env`
2. Check backend logs for errors
3. Verify API endpoint is responding: `curl http://localhost:5000/api/generate-quiz -X POST -H "Content-Type: application/json" -d '{"topic":"Test"}'`

### PDF download not working
1. Check browser console for errors
2. Ensure jsPDF is properly installed
3. Try with a shorter topic name (some special characters may cause issues)

---

## 📊 Performance

- **Build Size**: ~540KB (gzipped: ~175KB)
- **Load Time**: < 2 seconds on 3G
- **Quiz Load**: Instant with mock data, < 1s with AI
- **PDF Generation**: < 500ms for typical roadmap

---

## 🔐 Security

- **CORS Enabled**: Allows frontend-backend communication
- **Input Validation**: All API inputs are validated
- **Environment Variables**: Sensitive data (API keys) stored securely
- **No External Requests**: Default mock mode has no external dependencies

---

## 📝 License

This project was created for the Seattle Data & AI Security Hackathon (December 2025).

---

## 👥 Team 7

**LearnMap.ai** - AI-Powered Learning Roadmap Generator

---

## 🤝 Contributing

To contribute improvements:

1. Create a new branch for your feature
2. Make changes and test thoroughly
3. Ensure TypeScript compiles without errors
4. Test on both mobile and desktop
5. Submit a pull request with description

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Guide](https://expressjs.com)
- [Google Generative AI](https://ai.google.dev)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)

---

## 💡 Future Enhancements

- [ ] User accounts and progress tracking
- [ ] Multiple choice questions with explanations
- [ ] Video resource recommendations
- [ ] Interactive code challenges
- [ ] Community learning paths
- [ ] Mobile app version
- [ ] Real-time collaborative learning
- [ ] Advanced analytics dashboard

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review console logs (F12 in browser)
3. Ensure all dependencies are installed
4. Try with mock data enabled

---

**Happy Learning! 🚀**

Last Updated: December 13, 2025
