from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import RedirectResponse
from datetime import datetime
from typing import Optional
from ..config import settings
from ..database import get_database
from ..services.github_service import github_service
from ..models.schemas import UserResponse, GrowthCard
from bson import ObjectId
import secrets

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/github/login")
async def github_login():
    """Redirect to GitHub OAuth login."""
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
        f"&scope=user:email,repo,read:org"
    )
    return {"auth_url": github_auth_url}


@router.get("/github/callback")
async def github_callback(code: str):
    """Handle GitHub OAuth callback."""
    try:
        # Exchange code for access token
        token_data = await github_service.exchange_code_for_token(code)
        
        if "error" in token_data:
            raise HTTPException(status_code=400, detail=token_data.get("error_description", "OAuth failed"))
        
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token received")
        
        # Get user info from GitHub
        github_user = await github_service.get_user_info(access_token)
        
        db = get_database()
        
        # Generate a simple session token
        session_token = secrets.token_urlsafe(32)
        
        # Check if user exists
        existing_user = await db.users.find_one({"github_id": github_user["id"]})
        
        if existing_user:
            # Update tokens
            await db.users.update_one(
                {"_id": existing_user["_id"]},
                {"$set": {
                    "github_access_token": access_token,
                    "session_token": session_token,
                    "updated_at": datetime.utcnow()
                }}
            )
            user_id = str(existing_user["_id"])
        else:
            # Create new user
            new_user = {
                "name": github_user.get("name") or github_user["login"],
                "email": github_user.get("email"),
                "github_handle": github_user["login"],
                "github_id": github_user["id"],
                "avatar_url": github_user.get("avatar_url"),
                "bio": github_user.get("bio"),
                "github_access_token": access_token,
                "session_token": session_token,
                "growth_card": GrowthCard().model_dump(),
                "team_ids": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            result = await db.users.insert_one(new_user)
            user_id = str(result.inserted_id)
        
        # Redirect to frontend with session token
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/auth/callback?token={session_token}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_current_user_from_token(token: str):
    """Helper to get user from session token."""
    db = get_database()
    user = await db.users.find_one({"session_token": token})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str):
    """Get current authenticated user."""
    user = await get_current_user_from_token(token)
    
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


@router.post("/logout")
async def logout(token: str):
    """Logout - invalidate session token."""
    db = get_database()
    
    result = await db.users.update_one(
        {"session_token": token},
        {"$unset": {"session_token": ""}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return {"message": "Logged out successfully"}


# ============== DEV/DEMO ROUTES ==============

@router.post("/demo/login")
async def demo_login(github_id: int = 1001):
    """
    Demo login - creates a session for a seed user.
    Use github_id 1001-1006 after running seed_data.
    """
    db = get_database()
    user = await db.users.find_one({"github_id": github_id})
    
    if not user:
        raise HTTPException(
            status_code=404, 
            detail="Demo user not found. Run 'python -m app.seed_data' first."
        )
    
    # Generate session token
    session_token = secrets.token_urlsafe(32)
    
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {
            "session_token": session_token,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return {
        "token": session_token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "github_handle": user["github_handle"]
        },
        "message": "Demo login successful. Use this token for API calls."
    }
