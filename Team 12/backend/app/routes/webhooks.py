from fastapi import APIRouter, HTTPException, Request, Header
from datetime import datetime
from bson import ObjectId
import hmac
import hashlib
from ..database import get_database
from ..models.schemas import TaskStatus, GrowthCardStats
from ..services.ai_orchestrator import ai_orchestrator
from ..config import settings

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


def verify_github_signature(payload: bytes, signature: str, secret: str) -> bool:
    """Verify GitHub webhook signature."""
    if not signature:
        return False
    
    expected = "sha256=" + hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected, signature)


@router.post("/github")
async def github_webhook(
    request: Request,
    x_github_event: str = Header(None),
    x_hub_signature_256: str = Header(None)
):
    """Handle GitHub webhooks for PR and issue events."""
    payload = await request.json()
    
    db = get_database()
    
    # Handle different event types
    if x_github_event == "pull_request":
        return await handle_pull_request(db, payload)
    elif x_github_event == "issues":
        return await handle_issue_event(db, payload)
    elif x_github_event == "push":
        return await handle_push_event(db, payload)
    
    return {"status": "ignored", "event": x_github_event}


async def handle_pull_request(db, payload: dict):
    """Handle pull request events - especially merged PRs."""
    action = payload.get("action")
    pr = payload.get("pull_request", {})
    
    if action == "closed" and pr.get("merged"):
        repo = payload.get("repository", {})
        repo_url = repo.get("html_url")
        
        # Find the team by repo URL
        team = await db.teams.find_one({"repo_url": repo_url})
        
        if not team:
            return {"status": "team_not_found"}
        
        team_id = str(team["_id"])
        
        # Check if PR closes any issues
        body = pr.get("body", "") or ""
        
        # Parse "Closes #X" or "Fixes #X" patterns
        import re
        issue_numbers = re.findall(r'(?:closes|fixes|resolves)\s+#(\d+)', body.lower())
        
        for issue_num in issue_numbers:
            # Mark task as completed
            await db.tasks.update_one(
                {"team_id": team_id, "github_issue_id": int(issue_num)},
                {"$set": {
                    "status": TaskStatus.COMPLETED.value,
                    "completed_at": datetime.utcnow()
                }}
            )
        
        # Update user stats (PR author)
        author = pr.get("user", {}).get("login")
        if author:
            user = await db.users.find_one({"github_handle": author})
            if user:
                # Increment PR count and XP
                await db.users.update_one(
                    {"_id": user["_id"]},
                    {
                        "$inc": {
                            "growth_card.stats.prs_merged": 1,
                            "growth_card.stats.xp_points": 50
                        },
                        "$set": {
                            "growth_card.stats.last_activity": datetime.utcnow()
                        }
                    }
                )
        
        # Update team stats
        all_tasks = await db.tasks.find({"team_id": team_id}).to_list(length=100)
        completed = len([t for t in all_tasks if t.get("status") == TaskStatus.COMPLETED.value])
        total = len(all_tasks)
        
        await db.teams.update_one(
            {"_id": team["_id"]},
            {"$set": {
                "stats.completed_tasks": completed,
                "stats.completion_percentage": (completed / total * 100) if total > 0 else 0,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {
            "status": "pr_merged",
            "issues_closed": issue_numbers,
            "author": author
        }
    
    return {"status": "pr_not_merged"}


async def handle_issue_event(db, payload: dict):
    """Handle issue events."""
    action = payload.get("action")
    issue = payload.get("issue", {})
    repo = payload.get("repository", {})
    
    repo_url = repo.get("html_url")
    team = await db.teams.find_one({"repo_url": repo_url})
    
    if not team:
        return {"status": "team_not_found"}
    
    team_id = str(team["_id"])
    issue_number = issue.get("number")
    
    if action == "closed":
        # Mark task as completed
        result = await db.tasks.update_one(
            {"team_id": team_id, "github_issue_id": issue_number},
            {"$set": {
                "status": TaskStatus.COMPLETED.value,
                "completed_at": datetime.utcnow()
            }}
        )
        
        if result.modified_count > 0:
            # Update completion stats
            all_tasks = await db.tasks.find({"team_id": team_id}).to_list(length=100)
            completed = len([t for t in all_tasks if t.get("status") == TaskStatus.COMPLETED.value])
            total = len(all_tasks)
            
            await db.teams.update_one(
                {"_id": team["_id"]},
                {"$set": {
                    "stats.completed_tasks": completed,
                    "stats.completion_percentage": (completed / total * 100) if total > 0 else 0
                }}
            )
            
            # Award XP to assignee if present
            assignee = issue.get("assignee", {})
            if assignee:
                await db.users.update_one(
                    {"github_handle": assignee.get("login")},
                    {
                        "$inc": {
                            "growth_card.stats.tasks_completed": 1,
                            "growth_card.stats.xp_points": 25
                        },
                        "$set": {
                            "growth_card.stats.last_activity": datetime.utcnow()
                        }
                    }
                )
        
        return {"status": "issue_closed", "issue_number": issue_number}
    
    elif action == "assigned":
        assignee = issue.get("assignee", {})
        if assignee:
            user = await db.users.find_one({"github_handle": assignee.get("login")})
            if user:
                await db.tasks.update_one(
                    {"team_id": team_id, "github_issue_id": issue_number},
                    {"$set": {
                        "status": TaskStatus.IN_PROGRESS.value,
                        "assigned_to": str(user["_id"])
                    }}
                )
        
        return {"status": "issue_assigned", "assignee": assignee.get("login")}
    
    return {"status": "ignored", "action": action}


async def handle_push_event(db, payload: dict):
    """Handle push events to track commit activity."""
    repo = payload.get("repository", {})
    repo_url = repo.get("html_url")
    
    team = await db.teams.find_one({"repo_url": repo_url})
    if not team:
        return {"status": "team_not_found"}
    
    commits = payload.get("commits", [])
    pusher = payload.get("pusher", {}).get("name")
    
    # Update commit counts
    if pusher:
        await db.users.update_one(
            {"github_handle": pusher},
            {
                "$inc": {
                    "growth_card.stats.commits_count": len(commits),
                    "growth_card.stats.xp_points": len(commits) * 5
                },
                "$set": {
                    "growth_card.stats.last_activity": datetime.utcnow()
                }
            }
        )
    
    return {
        "status": "push_recorded",
        "commits": len(commits),
        "pusher": pusher
    }

