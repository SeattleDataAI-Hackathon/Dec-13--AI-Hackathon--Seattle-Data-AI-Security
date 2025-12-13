from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from ..database import get_database
from ..models.schemas import (
    UserResponse, UserUpdate, GrowthCard, SkillEntry, 
    GrowthCardStats
)
from ..services.ai_orchestrator import ai_orchestrator

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all users with pagination."""
    db = get_database()
    cursor = db.users.find().skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)
    
    return [
        UserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user.get("email"),
            github_handle=user["github_handle"],
            github_id=user["github_id"],
            avatar_url=user.get("avatar_url"),
            degree=user.get("degree"),
            major=user.get("major"),
            experience_years=user.get("experience_years", 0),
            bio=user.get("bio"),
            growth_card=user.get("growth_card", {}),
            team_ids=user.get("team_ids", [])
        )
        for user in users
    ]


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get a specific user by ID."""
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user.get("email"),
        github_handle=user["github_handle"],
        github_id=user["github_id"],
        avatar_url=user.get("avatar_url"),
        degree=user.get("degree"),
        major=user.get("major"),
        experience_years=user.get("experience_years", 0),
        bio=user.get("bio"),
        growth_card=user.get("growth_card", {}),
        team_ids=user.get("team_ids", [])
    )


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserUpdate):
    """Update user profile."""
    db = get_database()
    
    update_data = {k: v for k, v in user_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return await get_user(user_id)


@router.put("/{user_id}/growth-card", response_model=UserResponse)
async def update_growth_card(user_id: str, growth_card: GrowthCard):
    """Update user's Growth Card."""
    db = get_database()
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "growth_card": growth_card.model_dump(),
            "updated_at": datetime.utcnow()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return await get_user(user_id)


@router.post("/{user_id}/parse-project-ideas")
async def parse_project_ideas(user_id: str, project_ideas_text: str):
    """Parse free-text project ideas using AI and update Growth Card."""
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Use AI to parse project ideas
    parsed = await ai_orchestrator.parse_project_ideas(project_ideas_text)
    
    # Update growth card with parsed data
    growth_card = user.get("growth_card", {})
    growth_card["project_ideas"] = parsed.get("parsed_ideas", [])
    growth_card["parsed_categories"] = parsed.get("categories", [])
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "growth_card": growth_card,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return {
        "parsed": parsed,
        "message": "Project ideas parsed and Growth Card updated"
    }


@router.post("/{user_id}/add-skill")
async def add_skill(user_id: str, skill: SkillEntry):
    """Add a skill to user's Growth Card."""
    db = get_database()
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$push": {"growth_card.skills": skill.model_dump()},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Skill added successfully"}


@router.get("/{user_id}/stats")
async def get_user_stats(user_id: str):
    """Get detailed stats for a user."""
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    growth_card = user.get("growth_card", {})
    stats = growth_card.get("stats", {})
    
    # Get team contributions
    team_ids = user.get("team_ids", [])
    teams = []
    for team_id in team_ids:
        team = await db.teams.find_one({"_id": ObjectId(team_id)})
        if team:
            teams.append({
                "id": str(team["_id"]),
                "name": team.get("name"),
                "project_name": team.get("project_name"),
                "stats": team.get("stats", {})
            })
    
    return {
        "user_stats": stats,
        "teams": teams,
        "skills_count": len(growth_card.get("skills", [])),
        "interests": growth_card.get("interests", [])
    }

