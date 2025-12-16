import json
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from ..config import settings
from ..models.schemas import (
    UserResponse, AITeamFormation, AIProjectSuggestion, 
    AIRecommendation, GrowthCard
)

class AIOrchestrator:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4o-mini"
    
    async def parse_project_ideas(self, free_text: str) -> Dict[str, Any]:
        """Parse free-text project ideas and categorize them using NLP."""
        prompt = f"""Analyze the following project ideas submitted by a user and extract structured information.

User's Project Ideas (free text):
{free_text}

Extract and return a JSON object with:
1. "parsed_ideas": List of distinct project ideas identified
2. "categories": List of technology/domain categories (e.g., "web development", "machine learning", "mobile app", "data visualization", "IoT", "blockchain", etc.)
3. "skills_needed": List of specific technical skills that would be needed
4. "complexity_level": Overall complexity assessment ("beginner", "intermediate", "advanced")

Return ONLY valid JSON, no additional text."""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)

    async def form_teams(self, users: List[Dict[str, Any]], team_size: int = 3) -> AITeamFormation:
        """Analyze all Growth Cards and form optimal teams based on complementary skills."""
        
        user_profiles = []
        for user in users:
            gc = user.get("growth_card", {})
            profile = {
                "id": str(user.get("_id", user.get("id", ""))),
                "name": user.get("name", "Unknown"),
                "skills": gc.get("skills", []),
                "interests": gc.get("interests", []),
                "explore_goals": gc.get("explore_goals", []),
                "experience_years": user.get("experience_years", 0)
            }
            user_profiles.append(profile)
        
        prompt = f"""You are an AI team formation specialist for a tech learning club. Analyze these user profiles and form optimal teams of approximately {team_size} members each.

USER PROFILES:
{json.dumps(user_profiles, indent=2)}

TEAM FORMATION RULES:
1. Balance skills - pair experts with learners in complementary areas (e.g., backend expert with frontend learner)
2. Match shared interests - team members should have overlapping domain interests
3. Consider explore_goals - help members learn what they want to explore
4. Ensure diversity - mix experience levels within each team

Return a JSON object with:
{{
    "teams": [
        {{
            "team_name": "Creative team name",
            "member_ids": ["id1", "id2", "id3"],
            "team_strengths": ["strength1", "strength2"],
            "learning_opportunities": ["what junior members can learn"],
            "suggested_domain": "primary domain for this team"
        }}
    ],
    "reasoning": "Brief explanation of the team formation logic"
}}

Return ONLY valid JSON."""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        return AITeamFormation(**result)

    async def generate_project(self, team_members: List[Dict[str, Any]], domain_hint: Optional[str] = None) -> AIProjectSuggestion:
        """Generate a project suggestion for a team based on their combined skills and interests."""
        
        combined_skills = []
        combined_interests = []
        explore_goals = []
        
        for member in team_members:
            gc = member.get("growth_card", {})
            combined_skills.extend(gc.get("skills", []))
            combined_interests.extend(gc.get("interests", []))
            explore_goals.extend(gc.get("explore_goals", []))
        
        prompt = f"""Generate a learning project for this tech club team.

TEAM COMPOSITION:
- Skills available: {json.dumps(combined_skills)}
- Shared interests: {list(set(combined_interests))}
- Learning goals: {list(set(explore_goals))}
{f'- Preferred domain: {domain_hint}' if domain_hint else ''}

Create a project that:
1. Is achievable in 2-4 weeks
2. Uses team strengths while creating learning opportunities
3. Has clear, measurable milestones
4. Results in a deployable/demonstrable product

Return a JSON object:
{{
    "project_name": "Catchy project name",
    "description": "2-3 sentence description",
    "scope": "Detailed scope document with features and requirements",
    "tech_stack": ["technology1", "technology2"],
    "tasks": [
        {{"title": "Task 1", "description": "Details", "priority": "high/medium/low", "estimated_hours": 4}},
        ...
    ],
    "readme_content": "Full README.md content in markdown format including: Project Title, Description, Features, Tech Stack, Setup Instructions, Team Members section (placeholder), and Contributing guidelines"
}}

Return ONLY valid JSON."""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        return AIProjectSuggestion(**result)

    async def generate_recommendations(
        self, 
        team_stats: Dict[str, Any], 
        completed_tasks: List[Dict[str, Any]],
        remaining_tasks: List[Dict[str, Any]],
        code_summary: Optional[str] = None
    ) -> AIRecommendation:
        """Generate adaptive recommendations based on team progress."""
        
        prompt = f"""Analyze this team's progress and provide recommendations.

TEAM STATS:
{json.dumps(team_stats, indent=2)}

COMPLETED TASKS:
{json.dumps(completed_tasks, indent=2)}

REMAINING TASKS:
{json.dumps(remaining_tasks, indent=2)}

{f'CODE ANALYSIS SUMMARY: {code_summary}' if code_summary else ''}

Provide:
1. Immediate next steps for the current sprint
2. Long-term learning path recommendations
3. Insights on team velocity and patterns

Return JSON:
{{
    "next_steps": ["Step 1", "Step 2", "Step 3"],
    "learning_paths": [
        {{"member_focus": "area to improve", "resources": ["resource1"], "reason": "why this matters"}}
    ],
    "insights": "Analysis of team performance and suggestions"
}}

Return ONLY valid JSON."""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        return AIRecommendation(**result)

    async def analyze_code_contribution(self, diff_content: str, file_paths: List[str]) -> Dict[str, Any]:
        """Analyze code changes from a PR to understand contribution quality."""
        
        prompt = f"""Analyze this code contribution:

FILES CHANGED: {file_paths}

CODE DIFF (truncated if long):
{diff_content[:3000]}

Provide a brief analysis:
{{
    "complexity_score": 1-10,
    "areas_touched": ["frontend", "backend", etc.],
    "skills_demonstrated": ["skill1", "skill2"],
    "quality_notes": "Brief quality assessment",
    "xp_suggestion": 10-100 (XP points to award)
}}

Return ONLY valid JSON."""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)


# Singleton instance
ai_orchestrator = AIOrchestrator()

