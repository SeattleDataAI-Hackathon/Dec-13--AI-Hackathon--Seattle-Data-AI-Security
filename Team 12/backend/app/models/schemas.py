from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# ============== ENUMS ==============

class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"

# ============== USER / GROWTH CARD ==============

class SkillEntry(BaseModel):
    name: str
    level: SkillLevel
    category: str  # frontend, backend, data, devops, etc.

class GrowthCardStats(BaseModel):
    tasks_completed: int = 0
    commits_count: int = 0
    prs_merged: int = 0
    xp_points: int = 0
    streak_days: int = 0
    completion_rate: float = 0.0
    last_activity: Optional[datetime] = None

class GrowthCard(BaseModel):
    skills: List[SkillEntry] = []
    interests: List[str] = []
    explore_goals: List[str] = []
    project_ideas: List[str] = []
    parsed_categories: List[str] = []  # AI-parsed from project ideas
    stats: GrowthCardStats = GrowthCardStats()

class UserBase(BaseModel):
    name: str
    email: Optional[str] = None
    github_handle: str
    degree: Optional[str] = None
    major: Optional[str] = None
    experience_years: Optional[int] = 0
    bio: Optional[str] = None

class UserCreate(UserBase):
    github_id: int
    avatar_url: Optional[str] = None
    growth_card: Optional[GrowthCard] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    growth_card: Optional[GrowthCard] = None

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    github_id: int
    avatar_url: Optional[str] = None
    growth_card: GrowthCard = GrowthCard()
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
    team_ids: List[str] = []

    class Config:
        populate_by_name = True

class UserResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    github_handle: str
    github_id: int
    avatar_url: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    experience_years: int = 0
    bio: Optional[str] = None
    growth_card: GrowthCard = GrowthCard()
    team_ids: List[str] = []

# ============== TEAM ==============

class TeamMember(BaseModel):
    user_id: str
    role: str  # lead, member
    joined_at: datetime = datetime.utcnow()

class TeamStats(BaseModel):
    total_tasks: int = 0
    completed_tasks: int = 0
    completion_percentage: float = 0.0
    commit_velocity: float = 0.0  # commits per day
    active_members: int = 0

class TeamCreate(BaseModel):
    name: str
    member_ids: List[str]
    project_name: Optional[str] = None
    project_description: Optional[str] = None

class TeamInDB(BaseModel):
    id: str = Field(alias="_id")
    name: str
    members: List[TeamMember] = []
    repo_url: Optional[str] = None
    repo_name: Optional[str] = None
    project_name: Optional[str] = None
    project_description: Optional[str] = None
    ai_generated_scope: Optional[str] = None
    stats: TeamStats = TeamStats()
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

    class Config:
        populate_by_name = True

class TeamResponse(BaseModel):
    id: str
    name: str
    members: List[TeamMember] = []
    repo_url: Optional[str] = None
    repo_name: Optional[str] = None
    project_name: Optional[str] = None
    project_description: Optional[str] = None
    ai_generated_scope: Optional[str] = None
    stats: TeamStats = TeamStats()

# ============== TASKS ==============

class TaskCreate(BaseModel):
    team_id: str
    title: str
    description: str
    priority: int = 1  # 1-5
    estimated_hours: Optional[float] = None

class TaskInDB(BaseModel):
    id: str = Field(alias="_id")
    team_id: str
    github_issue_id: Optional[int] = None
    github_issue_url: Optional[str] = None
    title: str
    description: str
    status: TaskStatus = TaskStatus.TODO
    assigned_to: Optional[str] = None
    priority: int = 1
    estimated_hours: Optional[float] = None
    ai_generated: bool = False
    created_at: datetime = datetime.utcnow()
    completed_at: Optional[datetime] = None

    class Config:
        populate_by_name = True

class TaskResponse(BaseModel):
    id: str
    team_id: str
    github_issue_id: Optional[int] = None
    github_issue_url: Optional[str] = None
    title: str
    description: str
    status: TaskStatus
    assigned_to: Optional[str] = None
    priority: int = 1
    estimated_hours: Optional[float] = None
    ai_generated: bool = False

class TaskUpdate(BaseModel):
    status: Optional[TaskStatus] = None
    assigned_to: Optional[str] = None

# ============== AI RESPONSES ==============

class AITeamFormation(BaseModel):
    teams: List[Dict[str, Any]]  # List of team configurations
    reasoning: str

class AIProjectSuggestion(BaseModel):
    project_name: str
    description: str
    scope: str
    tech_stack: List[str]
    tasks: List[Dict[str, str]]  # title, description, priority
    readme_content: str

class AIRecommendation(BaseModel):
    next_steps: List[str]
    learning_paths: List[Dict[str, Any]]
    insights: str

# ============== GITHUB WEBHOOK ==============

class GitHubWebhookPayload(BaseModel):
    action: str
    repository: Optional[Dict[str, Any]] = None
    pull_request: Optional[Dict[str, Any]] = None
    issue: Optional[Dict[str, Any]] = None
    sender: Optional[Dict[str, Any]] = None

