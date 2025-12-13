"""
Seed data script for development/demo purposes.
Run: python -m app.seed_data
"""
import asyncio
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

from .config import settings

# Pre-generate ObjectIds for linking
USER_IDS = [ObjectId() for _ in range(6)]
TEAM_ID = ObjectId()
TASK_IDS = [ObjectId() for _ in range(6)]

# Demo users with diverse skills
DEMO_USERS = [
    {
        "_id": USER_IDS[0],
        "name": "Alex Chen",
        "email": "alex.chen@demo.com",
        "github_handle": "alexchen",
        "github_id": 1001,
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        "degree": "Bachelor's",
        "major": "Computer Science",
        "experience_years": 2,
        "bio": "Full-stack developer passionate about React and Node.js",
        "growth_card": {
            "skills": [
                {"name": "React", "level": "advanced", "category": "frontend"},
                {"name": "TypeScript", "level": "intermediate", "category": "frontend"},
                {"name": "Node.js", "level": "intermediate", "category": "backend"},
            ],
            "interests": ["Web Development", "AI/LLMs", "Open Source"],
            "explore_goals": ["Learn Kubernetes", "Contribute to open source"],
            "project_ideas": ["AI-powered code reviewer"],
            "parsed_categories": ["AI", "Developer Tools"],
            "stats": {
                "tasks_completed": 12,
                "commits_count": 45,
                "prs_merged": 8,
                "xp_points": 850,
                "streak_days": 7,
                "completion_rate": 0.85,
            },
        },
        "team_ids": [str(TEAM_ID)],
    },
    {
        "_id": USER_IDS[1],
        "name": "Sarah Kim",
        "email": "sarah.kim@demo.com",
        "github_handle": "sarahkim",
        "github_id": 1002,
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        "degree": "Master's",
        "major": "Data Science",
        "experience_years": 3,
        "bio": "ML engineer interested in NLP and computer vision",
        "growth_card": {
            "skills": [
                {"name": "Python", "level": "expert", "category": "backend"},
                {"name": "TensorFlow", "level": "advanced", "category": "data"},
                {"name": "SQL", "level": "advanced", "category": "data"},
            ],
            "interests": ["Machine Learning", "Data Visualization", "AI/LLMs"],
            "explore_goals": ["Build production ML systems", "Learn MLOps"],
            "project_ideas": ["Sentiment analysis dashboard"],
            "parsed_categories": ["Machine Learning", "Data Science"],
            "stats": {
                "tasks_completed": 18,
                "commits_count": 67,
                "prs_merged": 12,
                "xp_points": 1250,
                "streak_days": 14,
                "completion_rate": 0.92,
            },
        },
        "team_ids": [str(TEAM_ID)],
    },
    {
        "_id": USER_IDS[2],
        "name": "Marcus Johnson",
        "email": "marcus.j@demo.com",
        "github_handle": "marcusj",
        "github_id": 1003,
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
        "degree": "Bachelor's",
        "major": "Software Engineering",
        "experience_years": 1,
        "bio": "Junior dev eager to learn backend and DevOps",
        "growth_card": {
            "skills": [
                {"name": "JavaScript", "level": "intermediate", "category": "frontend"},
                {"name": "HTML/CSS", "level": "advanced", "category": "frontend"},
                {"name": "Git", "level": "intermediate", "category": "devops"},
            ],
            "interests": ["Web Development", "Cloud Computing", "DevOps"],
            "explore_goals": ["Master Docker", "Learn AWS"],
            "project_ideas": ["Portfolio website builder"],
            "parsed_categories": ["Web Development", "DevOps"],
            "stats": {
                "tasks_completed": 5,
                "commits_count": 23,
                "prs_merged": 3,
                "xp_points": 420,
                "streak_days": 4,
                "completion_rate": 0.71,
            },
        },
        "team_ids": [str(TEAM_ID)],
    },
    {
        "_id": USER_IDS[3],
        "name": "Priya Patel",
        "email": "priya.p@demo.com",
        "github_handle": "priyap",
        "github_id": 1004,
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
        "degree": "Bachelor's",
        "major": "Computer Engineering",
        "experience_years": 2,
        "bio": "Backend specialist with a love for clean architecture",
        "growth_card": {
            "skills": [
                {"name": "Java", "level": "advanced", "category": "backend"},
                {"name": "Spring Boot", "level": "intermediate", "category": "backend"},
                {"name": "PostgreSQL", "level": "advanced", "category": "backend"},
            ],
            "interests": ["Backend Development", "System Design", "APIs"],
            "explore_goals": ["Learn microservices patterns", "Study system design"],
            "project_ideas": ["API gateway for microservices"],
            "parsed_categories": ["Backend", "Architecture"],
            "stats": {
                "tasks_completed": 9,
                "commits_count": 38,
                "prs_merged": 6,
                "xp_points": 680,
                "streak_days": 9,
                "completion_rate": 0.82,
            },
        },
        "team_ids": [],
    },
    {
        "_id": USER_IDS[4],
        "name": "James Wilson",
        "email": "james.w@demo.com",
        "github_handle": "jameswilson",
        "github_id": 1005,
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
        "degree": "PhD",
        "major": "Artificial Intelligence",
        "experience_years": 5,
        "bio": "AI researcher transitioning to industry applications",
        "growth_card": {
            "skills": [
                {"name": "Python", "level": "expert", "category": "backend"},
                {"name": "PyTorch", "level": "expert", "category": "data"},
                {"name": "LLMs", "level": "advanced", "category": "data"},
            ],
            "interests": ["AI/LLMs", "Machine Learning", "Research"],
            "explore_goals": ["Build production AI apps", "Learn web development"],
            "project_ideas": ["LLM-powered learning assistant"],
            "parsed_categories": ["AI", "LLMs", "Education"],
            "stats": {
                "tasks_completed": 15,
                "commits_count": 52,
                "prs_merged": 9,
                "xp_points": 1100,
                "streak_days": 11,
                "completion_rate": 0.88,
            },
        },
        "team_ids": [],
    },
    {
        "_id": USER_IDS[5],
        "name": "Emma Rodriguez",
        "email": "emma.r@demo.com",
        "github_handle": "emmarodriguez",
        "github_id": 1006,
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        "degree": "Bachelor's",
        "major": "Design & Technology",
        "experience_years": 2,
        "bio": "UI/UX designer who codes. Passionate about accessible design.",
        "growth_card": {
            "skills": [
                {"name": "Figma", "level": "expert", "category": "design"},
                {"name": "React", "level": "intermediate", "category": "frontend"},
                {"name": "CSS", "level": "advanced", "category": "frontend"},
            ],
            "interests": ["Design", "Web Development", "Accessibility"],
            "explore_goals": ["Master animation libraries", "Learn 3D web"],
            "project_ideas": ["Design system component library"],
            "parsed_categories": ["Design", "Frontend", "Accessibility"],
            "stats": {
                "tasks_completed": 11,
                "commits_count": 34,
                "prs_merged": 7,
                "xp_points": 780,
                "streak_days": 6,
                "completion_rate": 0.84,
            },
        },
        "team_ids": [],
    },
]

# Demo team with project
DEMO_TEAM = {
    "_id": TEAM_ID,
    "name": "AI Innovators",
    "members": [
        {"user_id": str(USER_IDS[0]), "role": "lead", "joined_at": datetime.now(timezone.utc)},
        {"user_id": str(USER_IDS[1]), "role": "member", "joined_at": datetime.now(timezone.utc)},
        {"user_id": str(USER_IDS[2]), "role": "member", "joined_at": datetime.now(timezone.utc)},
    ],
    "project_name": "StudyBuddy AI",
    "project_description": "An AI-powered study companion that helps students learn more effectively through personalized quizzes, flashcard generation, and adaptive learning paths.",
    "ai_generated_scope": """## Project Scope: StudyBuddy AI

### Overview
StudyBuddy AI is an intelligent learning platform that uses LLMs to create personalized study experiences.

### Core Features
1. **Smart Flashcard Generator** - Upload notes/PDFs and AI creates flashcards
2. **Adaptive Quiz Engine** - Generates quizzes based on weak areas
3. **Study Session Tracker** - Gamified progress tracking with streaks
4. **Concept Explainer** - AI explains difficult concepts in simple terms

### Tech Stack
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Python + FastAPI
- AI: OpenAI GPT-4 API
- Database: MongoDB
- Auth: GitHub OAuth

### Timeline
- Week 1: Setup + Flashcard Generator
- Week 2: Quiz Engine + Progress Tracking
- Week 3: Concept Explainer + Polish
- Week 4: Testing + Demo Prep""",
    "repo_url": "https://github.com/techclub-ai/studybuddy-ai",
    "repo_name": "studybuddy-ai",
    "tech_stack": ["React", "TypeScript", "Python", "FastAPI", "OpenAI", "MongoDB"],
    "ai_strengths": ["Full-stack development", "ML/AI integration", "UI design"],
    "ai_learning_opportunities": ["Production ML systems", "API design", "DevOps basics"],
    "suggested_domain": "AI/Education",
    "stats": {
        "total_tasks": 6,
        "completed_tasks": 3,
        "completion_percentage": 50.0,
        "commit_velocity": 4.2,
        "active_members": 3,
    },
}

# Demo tasks for the project
DEMO_TASKS = [
    {
        "_id": TASK_IDS[0],
        "team_id": str(TEAM_ID),
        "github_issue_id": 1,
        "github_issue_url": "https://github.com/techclub-ai/studybuddy-ai/issues/1",
        "title": "Set up project structure and dependencies",
        "description": "Initialize React frontend with TypeScript, set up FastAPI backend, configure MongoDB connection, and create basic folder structure.",
        "status": "completed",
        "assigned_to": str(USER_IDS[0]),
        "priority": 1,
        "estimated_hours": 4,
        "ai_generated": True,
        "completed_at": datetime.now(timezone.utc) - timedelta(days=5),
    },
    {
        "_id": TASK_IDS[1],
        "team_id": str(TEAM_ID),
        "github_issue_id": 2,
        "github_issue_url": "https://github.com/techclub-ai/studybuddy-ai/issues/2",
        "title": "Implement PDF/text upload and parsing",
        "description": "Create file upload component, implement PDF text extraction using PyPDF2, and store parsed content in MongoDB for flashcard generation.",
        "status": "completed",
        "assigned_to": str(USER_IDS[1]),
        "priority": 1,
        "estimated_hours": 6,
        "ai_generated": True,
        "completed_at": datetime.now(timezone.utc) - timedelta(days=3),
    },
    {
        "_id": TASK_IDS[2],
        "team_id": str(TEAM_ID),
        "github_issue_id": 3,
        "github_issue_url": "https://github.com/techclub-ai/studybuddy-ai/issues/3",
        "title": "Build AI flashcard generation service",
        "description": "Integrate OpenAI API to generate flashcards from uploaded content. Include question-answer pairs and key concepts extraction.",
        "status": "completed",
        "assigned_to": str(USER_IDS[1]),
        "priority": 1,
        "estimated_hours": 8,
        "ai_generated": True,
        "completed_at": datetime.now(timezone.utc) - timedelta(days=1),
    },
    {
        "_id": TASK_IDS[3],
        "team_id": str(TEAM_ID),
        "github_issue_id": 4,
        "github_issue_url": "https://github.com/techclub-ai/studybuddy-ai/issues/4",
        "title": "Create flashcard review UI with spaced repetition",
        "description": "Build interactive flashcard component with flip animation, implement SM-2 spaced repetition algorithm, and track review history.",
        "status": "in_progress",
        "assigned_to": str(USER_IDS[0]),
        "priority": 2,
        "estimated_hours": 6,
        "ai_generated": True,
    },
    {
        "_id": TASK_IDS[4],
        "team_id": str(TEAM_ID),
        "github_issue_id": 5,
        "github_issue_url": "https://github.com/techclub-ai/studybuddy-ai/issues/5",
        "title": "Implement adaptive quiz generation",
        "description": "Create quiz engine that generates questions based on weak areas identified from flashcard performance. Include multiple choice and short answer formats.",
        "status": "todo",
        "assigned_to": str(USER_IDS[2]),
        "priority": 2,
        "estimated_hours": 8,
        "ai_generated": True,
    },
    {
        "_id": TASK_IDS[5],
        "team_id": str(TEAM_ID),
        "github_issue_id": 6,
        "github_issue_url": "https://github.com/techclub-ai/studybuddy-ai/issues/6",
        "title": "Build progress dashboard with gamification",
        "description": "Create dashboard showing study streaks, XP points, achievements, and learning analytics. Include charts for progress over time.",
        "status": "todo",
        "assigned_to": None,
        "priority": 3,
        "estimated_hours": 5,
        "ai_generated": True,
    },
]


async def seed_database():
    """Seed the database with demo data."""
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Clear existing data
    print("Clearing existing data...")
    await db.users.delete_many({})
    await db.teams.delete_many({})
    await db.tasks.delete_many({})
    
    # Insert demo users
    print("Inserting demo users...")
    for user in DEMO_USERS:
        user["created_at"] = datetime.now(timezone.utc)
        user["updated_at"] = datetime.now(timezone.utc)
        await db.users.insert_one(user)
        print(f"  [OK] Created user: {user['name']}")
    
    # Insert demo team
    print("Inserting demo team...")
    DEMO_TEAM["created_at"] = datetime.now(timezone.utc)
    DEMO_TEAM["updated_at"] = datetime.now(timezone.utc)
    await db.teams.insert_one(DEMO_TEAM)
    print(f"  [OK] Created team: {DEMO_TEAM['name']} with project '{DEMO_TEAM['project_name']}'")
    
    # Insert demo tasks
    print("Inserting demo tasks...")
    for task in DEMO_TASKS:
        task["created_at"] = datetime.now(timezone.utc)
        await db.tasks.insert_one(task)
        status_icon = "[DONE]" if task["status"] == "completed" else "[    ]"
        print(f"  {status_icon} Task: {task['title'][:50]}...")
    
    # Create indexes
    print("Creating indexes...")
    await db.users.create_index("github_id", unique=True)
    await db.users.create_index("email", unique=True, sparse=True)
    await db.users.create_index("session_token", sparse=True)
    await db.teams.create_index("repo_url", unique=True, sparse=True)
    await db.tasks.create_index("team_id")
    await db.tasks.create_index("github_issue_id")
    
    print("")
    print("=" * 60)
    print("  DATABASE SEEDED SUCCESSFULLY!")
    print("=" * 60)
    print("")
    print("  USERS CREATED: 6")
    print("    - Alex Chen (Team Lead)")
    print("    - Sarah Kim (ML Expert)")
    print("    - Marcus Johnson (Junior Dev)")
    print("    - Priya Patel (Backend)")
    print("    - James Wilson (AI PhD)")
    print("    - Emma Rodriguez (Designer)")
    print("")
    print("  TEAM CREATED: AI Innovators")
    print("    - Members: Alex, Sarah, Marcus")
    print("    - Project: StudyBuddy AI")
    print("    - Tasks: 6 (3 completed, 1 in progress, 2 todo)")
    print("")
    print("  TO START THE APP:")
    print("    1. Backend: python run.py")
    print("    2. Frontend: cd ../frontend && npm run dev")
    print("    3. Open: http://localhost:3000")
    print("    4. Click 'Try Demo' to login as Alex Chen")
    print("")
    print("=" * 60)
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
