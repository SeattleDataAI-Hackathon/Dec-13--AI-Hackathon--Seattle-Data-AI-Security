# TechClub AI – Collaborative Learning Orchestrator

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai" alt="OpenAI" />
</div>

<br />

An AI-powered web application that automates the management of peer learning groups. It profiles members, uses AI to form optimal teams and generate project ideas, and automates progress tracking via GitHub integration.

## ✨ Features

### 🎴 Growth Card (User Profiling)
- Dynamic form collecting skills, interests, and learning goals
- AI-powered NLP to parse free-text project ideas
- Visual skill categorization and experience tracking

### 🤖 AI Team Formation & Project Genesis
- Intelligent matching algorithm analyzing complementary skills
- Automatic team formation based on shared interests
- AI-generated project suggestions with full scope
- Automated GitHub repository creation with README and Issues

### 📊 Progress Engine (Tracking)
- Real-time sync with GitHub webhooks
- Automatic task completion tracking via PR merges
- XP-based gamification system
- Individual and team statistics

### 🎯 Adaptive Recommendations
- AI-powered next-step suggestions
- Learning path recommendations
- Team velocity insights

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js UI    │────▶│  FastAPI Backend │────▶│    MongoDB      │
│   (Frontend)    │◀────│   (API Server)   │◀────│   (Database)    │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
            ┌───────────┐ ┌───────────┐ ┌───────────┐
            │  OpenAI   │ │  GitHub   │ │  Webhooks │
            │   API     │ │   API     │ │  Handler  │
            └───────────┘ └───────────┘ └───────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas)
- GitHub OAuth App
- OpenAI API Key

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from env.example.txt)
# Configure your environment variables:
# - MONGODB_URL
# - OPENAI_API_KEY
# - GITHUB_CLIENT_ID
# - GITHUB_CLIENT_SECRET

# Run the server
python run.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Run development server
npm run dev
```

The UI will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration settings
│   │   ├── database.py          # MongoDB connection
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic models
│   │   ├── routes/
│   │   │   ├── auth.py          # GitHub OAuth
│   │   │   ├── users.py         # User management
│   │   │   ├── teams.py         # Team operations
│   │   │   └── webhooks.py      # GitHub webhooks
│   │   └── services/
│   │       ├── ai_orchestrator.py    # OpenAI integration
│   │       └── github_service.py     # GitHub API
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── login/           # Login page
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── growth-card/     # Growth Card form
│   │   │   ├── teams/           # Teams list & detail
│   │   │   ├── projects/        # Projects view
│   │   │   └── analytics/       # Analytics dashboard
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   ├── GrowthCardForm.tsx
│   │   │   ├── TeamCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── ProgressChart.tsx
│   │   └── lib/
│   │       ├── api.ts           # API client
│   │       └── store.ts         # Zustand state
│   ├── package.json
│   └── tailwind.config.ts
│
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=techclub_ai
OPENAI_API_KEY=sk-...
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback/github
JWT_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App:
   - Application name: TechClub AI
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
3. Copy Client ID and Client Secret to backend .env

### GitHub Webhook Setup (for Progress Tracking)

1. In your GitHub repository Settings → Webhooks
2. Add webhook:
   - Payload URL: `https://your-domain.com/api/webhooks/github`
   - Content type: `application/json`
   - Events: Pull requests, Issues, Push

## 📡 API Endpoints

### Authentication
- `GET /api/auth/github/login` - Get GitHub OAuth URL
- `GET /api/auth/github/callback` - OAuth callback handler
- `GET /api/auth/me?token=<jwt>` - Get current user

### Users
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user profile
- `PUT /api/users/{id}/growth-card` - Update Growth Card
- `POST /api/users/{id}/parse-project-ideas` - AI parse project ideas

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/{id}` - Get team details
- `POST /api/teams/generate-teams` - AI team formation
- `POST /api/teams/{id}/generate-project` - AI project generation
- `GET /api/teams/{id}/tasks` - Get team tasks
- `GET /api/teams/{id}/recommendations` - Get AI recommendations
- `POST /api/teams/{id}/sync-github` - Sync with GitHub

### Webhooks
- `POST /api/webhooks/github` - Handle GitHub events

## 🎨 UI Design

The frontend features a modern, dark-themed design with:

- **Synthwave/Cyber aesthetic** - Gradient accents with pink and cyan
- **Glassmorphism effects** - Frosted glass cards and overlays
- **Smooth animations** - Framer Motion powered transitions
- **Responsive design** - Mobile-first approach
- **Custom fonts** - Clash Display (headings) + Satoshi (body)

## 🧠 AI Features

### Team Formation Algorithm
The AI analyzes:
- Skill complementarity (pairing experts with learners)
- Shared interests and learning goals
- Experience level diversity
- Domain preferences

### Project Generation
The AI creates:
- Project name and description
- Detailed scope document
- Technology stack recommendations
- Task breakdown with priorities
- Complete README.md content

### Adaptive Recommendations
The AI provides:
- Next logical steps based on progress
- Learning path suggestions
- Team velocity insights
- Code contribution analysis

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Code review AI assistant
- [ ] Learning resource recommendations
- [ ] Slack/Discord integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Mentor matching system

## 📄 License

MIT License - feel free to use this for your hackathon or learning projects!

---

<div align="center">
  Built with ❤️ for collaborative learning
</div>

# Backend
cd backend
pip install -r requirements.txt
# Set up .env with MONGODB_URL, OPENAI_API_KEY, GITHUB_CLIENT_ID/SECRET
python run.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev