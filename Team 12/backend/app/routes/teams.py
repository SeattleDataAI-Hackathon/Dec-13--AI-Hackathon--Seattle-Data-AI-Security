from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from ..database import get_database
from ..models.schemas import (
    TeamCreate, TeamResponse, TeamMember, TeamStats,
    TaskResponse, TaskStatus
)
from ..services.ai_orchestrator import ai_orchestrator
from ..services.github_service import github_service

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get("/", response_model=List[TeamResponse])
async def get_all_teams(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all teams with pagination."""
    db = get_database()
    cursor = db.teams.find().skip(skip).limit(limit)
    teams = await cursor.to_list(length=limit)
    
    return [
        TeamResponse(
            id=str(team["_id"]),
            name=team["name"],
            members=team.get("members", []),
            repo_url=team.get("repo_url"),
            repo_name=team.get("repo_name"),
            project_name=team.get("project_name"),
            project_description=team.get("project_description"),
            ai_generated_scope=team.get("ai_generated_scope"),
            stats=team.get("stats", {})
        )
        for team in teams
    ]


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: str):
    """Get a specific team by ID."""
    db = get_database()
    team = await db.teams.find_one({"_id": ObjectId(team_id)})
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    return TeamResponse(
        id=str(team["_id"]),
        name=team["name"],
        members=team.get("members", []),
        repo_url=team.get("repo_url"),
        repo_name=team.get("repo_name"),
        project_name=team.get("project_name"),
        project_description=team.get("project_description"),
        ai_generated_scope=team.get("ai_generated_scope"),
        stats=team.get("stats", {})
    )


@router.post("/generate-teams")
async def generate_teams(team_size: int = 3):
    """Use AI to generate optimal team formations from all users."""
    db = get_database()
    
    # Get all users without a team
    users = await db.users.find({"team_ids": {"$size": 0}}).to_list(length=100)
    
    if len(users) < team_size:
        raise HTTPException(
            status_code=400, 
            detail=f"Need at least {team_size} users without teams"
        )
    
    # Use AI to form teams
    team_formation = await ai_orchestrator.form_teams(users, team_size)
    
    created_teams = []
    for team_config in team_formation.teams:
        # Create team in database
        team_doc = {
            "name": team_config["team_name"],
            "members": [
                TeamMember(
                    user_id=member_id,
                    role="member"
                ).model_dump()
                for member_id in team_config["member_ids"]
            ],
            "ai_strengths": team_config.get("team_strengths", []),
            "ai_learning_opportunities": team_config.get("learning_opportunities", []),
            "suggested_domain": team_config.get("suggested_domain"),
            "stats": TeamStats().model_dump(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.teams.insert_one(team_doc)
        team_id = str(result.inserted_id)
        
        # Update users with team_id
        for member_id in team_config["member_ids"]:
            await db.users.update_one(
                {"_id": ObjectId(member_id)},
                {"$push": {"team_ids": team_id}}
            )
        
        created_teams.append({
            "id": team_id,
            **team_config
        })
    
    return {
        "teams_created": len(created_teams),
        "teams": created_teams,
        "reasoning": team_formation.reasoning
    }


@router.post("/{team_id}/generate-project")
async def generate_project(team_id: str, github_token: str, org: Optional[str] = None):
    """Generate an AI project for a team and set up GitHub repo."""
    db = get_database()
    team = await db.teams.find_one({"_id": ObjectId(team_id)})
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Get team members' profiles
    member_ids = [m["user_id"] for m in team.get("members", [])]
    members = []
    for mid in member_ids:
        user = await db.users.find_one({"_id": ObjectId(mid)})
        if user:
            members.append(user)
    
    # Generate project using AI
    domain_hint = team.get("suggested_domain")
    project = await ai_orchestrator.generate_project(members, domain_hint)
    
    # Create GitHub repository
    repo_name = project.project_name.lower().replace(" ", "-").replace("_", "-")
    
    try:
        repo = await github_service.create_repository(
            access_token=github_token,
            name=repo_name,
            description=project.description,
            org=org
        )
        
        owner = repo["owner"]["login"]
        
        # Update README with AI-generated content
        await github_service.update_readme(
            access_token=github_token,
            owner=owner,
            repo=repo_name,
            content=project.readme_content
        )
        
        # Create GitHub issues for tasks
        github_issues = await github_service.create_issues_batch(
            access_token=github_token,
            owner=owner,
            repo=repo_name,
            issues=project.tasks
        )
        
        # Store tasks in database
        for i, issue in enumerate(github_issues):
            task_doc = {
                "team_id": team_id,
                "github_issue_id": issue["number"],
                "github_issue_url": issue["html_url"],
                "title": project.tasks[i]["title"],
                "description": project.tasks[i]["description"],
                "status": TaskStatus.TODO.value,
                "priority": project.tasks[i].get("priority", 2),
                "estimated_hours": project.tasks[i].get("estimated_hours"),
                "ai_generated": True,
                "created_at": datetime.utcnow()
            }
            await db.tasks.insert_one(task_doc)
        
        # Update team with project info
        await db.teams.update_one(
            {"_id": ObjectId(team_id)},
            {"$set": {
                "project_name": project.project_name,
                "project_description": project.description,
                "ai_generated_scope": project.scope,
                "repo_url": repo["html_url"],
                "repo_name": repo_name,
                "tech_stack": project.tech_stack,
                "stats.total_tasks": len(github_issues),
                "updated_at": datetime.utcnow()
            }}
        )
        
        # Add team members as collaborators
        for member in members:
            github_handle = member.get("github_handle")
            if github_handle and github_handle != owner:
                await github_service.add_collaborator(
                    access_token=github_token,
                    owner=owner,
                    repo=repo_name,
                    username=github_handle
                )
        
        return {
            "project": project.model_dump(),
            "repo_url": repo["html_url"],
            "issues_created": len(github_issues)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GitHub setup failed: {str(e)}")


@router.get("/{team_id}/tasks", response_model=List[TaskResponse])
async def get_team_tasks(team_id: str):
    """Get all tasks for a team."""
    db = get_database()
    
    cursor = db.tasks.find({"team_id": team_id})
    tasks = await cursor.to_list(length=100)
    
    return [
        TaskResponse(
            id=str(task["_id"]),
            team_id=task["team_id"],
            github_issue_id=task.get("github_issue_id"),
            github_issue_url=task.get("github_issue_url"),
            title=task["title"],
            description=task["description"],
            status=task.get("status", TaskStatus.TODO),
            assigned_to=task.get("assigned_to"),
            priority=task.get("priority", 1),
            estimated_hours=task.get("estimated_hours"),
            ai_generated=task.get("ai_generated", False)
        )
        for task in tasks
    ]


@router.get("/{team_id}/recommendations")
async def get_team_recommendations(team_id: str):
    """Get AI-powered recommendations for the team."""
    db = get_database()
    team = await db.teams.find_one({"_id": ObjectId(team_id)})
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Get tasks
    all_tasks = await db.tasks.find({"team_id": team_id}).to_list(length=100)
    completed = [t for t in all_tasks if t.get("status") == TaskStatus.COMPLETED.value]
    remaining = [t for t in all_tasks if t.get("status") != TaskStatus.COMPLETED.value]
    
    # Generate recommendations
    recommendations = await ai_orchestrator.generate_recommendations(
        team_stats=team.get("stats", {}),
        completed_tasks=[{"title": t["title"], "description": t["description"]} for t in completed],
        remaining_tasks=[{"title": t["title"], "description": t["description"]} for t in remaining]
    )
    
    return recommendations.model_dump()


@router.post("/{team_id}/sync-github")
async def sync_github_status(team_id: str, github_token: str):
    """Sync task status from GitHub issues."""
    db = get_database()
    team = await db.teams.find_one({"_id": ObjectId(team_id)})
    
    if not team or not team.get("repo_url"):
        raise HTTPException(status_code=404, detail="Team or repo not found")
    
    repo_parts = team["repo_url"].rstrip("/").split("/")
    owner = repo_parts[-2]
    repo = repo_parts[-1]
    
    # Get issues from GitHub
    issues = await github_service.get_repository_issues(
        access_token=github_token,
        owner=owner,
        repo=repo
    )
    
    updated_count = 0
    for issue in issues:
        issue_number = issue["number"]
        issue_state = issue["state"]
        
        new_status = TaskStatus.COMPLETED if issue_state == "closed" else TaskStatus.TODO
        
        result = await db.tasks.update_one(
            {"team_id": team_id, "github_issue_id": issue_number},
            {"$set": {"status": new_status.value}}
        )
        
        if result.modified_count > 0:
            updated_count += 1
    
    # Update team stats
    all_tasks = await db.tasks.find({"team_id": team_id}).to_list(length=100)
    completed = len([t for t in all_tasks if t.get("status") == TaskStatus.COMPLETED.value])
    total = len(all_tasks)
    
    await db.teams.update_one(
        {"_id": ObjectId(team_id)},
        {"$set": {
            "stats.completed_tasks": completed,
            "stats.total_tasks": total,
            "stats.completion_percentage": (completed / total * 100) if total > 0 else 0,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return {
        "synced": True,
        "updated_tasks": updated_count,
        "completion_percentage": (completed / total * 100) if total > 0 else 0
    }

