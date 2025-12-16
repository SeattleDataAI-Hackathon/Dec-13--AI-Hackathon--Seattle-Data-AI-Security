import httpx
from typing import List, Dict, Any, Optional
from ..config import settings

class GitHubService:
    def __init__(self):
        self.api_base = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
    
    def _get_auth_headers(self, access_token: str) -> Dict[str, str]:
        return {
            **self.headers,
            "Authorization": f"Bearer {access_token}"
        }
    
    async def get_user_info(self, access_token: str) -> Dict[str, Any]:
        """Get authenticated user's GitHub profile."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_base}/user",
                headers=self._get_auth_headers(access_token)
            )
            response.raise_for_status()
            return response.json()
    
    async def create_repository(
        self, 
        access_token: str, 
        name: str, 
        description: str,
        private: bool = False,
        org: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a new GitHub repository."""
        async with httpx.AsyncClient() as client:
            url = f"{self.api_base}/orgs/{org}/repos" if org else f"{self.api_base}/user/repos"
            
            payload = {
                "name": name,
                "description": description,
                "private": private,
                "auto_init": True,  # Create with README
                "has_issues": True,
                "has_projects": True
            }
            
            response = await client.post(
                url,
                headers=self._get_auth_headers(access_token),
                json=payload
            )
            response.raise_for_status()
            return response.json()
    
    async def update_readme(
        self, 
        access_token: str, 
        owner: str, 
        repo: str, 
        content: str,
        message: str = "Update README with project scope"
    ) -> Dict[str, Any]:
        """Update or create README.md in a repository."""
        async with httpx.AsyncClient() as client:
            # First, get the current README to get its SHA (if exists)
            get_response = await client.get(
                f"{self.api_base}/repos/{owner}/{repo}/contents/README.md",
                headers=self._get_auth_headers(access_token)
            )
            
            sha = None
            if get_response.status_code == 200:
                sha = get_response.json().get("sha")
            
            # Encode content to base64
            import base64
            encoded_content = base64.b64encode(content.encode()).decode()
            
            payload = {
                "message": message,
                "content": encoded_content
            }
            if sha:
                payload["sha"] = sha
            
            response = await client.put(
                f"{self.api_base}/repos/{owner}/{repo}/contents/README.md",
                headers=self._get_auth_headers(access_token),
                json=payload
            )
            response.raise_for_status()
            return response.json()
    
    async def create_issue(
        self, 
        access_token: str, 
        owner: str, 
        repo: str,
        title: str,
        body: str,
        labels: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Create a GitHub issue."""
        async with httpx.AsyncClient() as client:
            payload = {
                "title": title,
                "body": body
            }
            if labels:
                payload["labels"] = labels
            
            response = await client.post(
                f"{self.api_base}/repos/{owner}/{repo}/issues",
                headers=self._get_auth_headers(access_token),
                json=payload
            )
            response.raise_for_status()
            return response.json()
    
    async def create_issues_batch(
        self, 
        access_token: str, 
        owner: str, 
        repo: str,
        issues: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Create multiple GitHub issues."""
        created_issues = []
        for issue in issues:
            priority = issue.get("priority", "medium")
            labels = [f"priority:{priority}", "ai-generated"]
            
            result = await self.create_issue(
                access_token=access_token,
                owner=owner,
                repo=repo,
                title=issue["title"],
                body=issue["description"],
                labels=labels
            )
            created_issues.append(result)
        
        return created_issues
    
    async def get_repository_issues(
        self, 
        access_token: str, 
        owner: str, 
        repo: str,
        state: str = "all"
    ) -> List[Dict[str, Any]]:
        """Get all issues from a repository."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_base}/repos/{owner}/{repo}/issues",
                headers=self._get_auth_headers(access_token),
                params={"state": state, "per_page": 100}
            )
            response.raise_for_status()
            return response.json()
    
    async def get_pull_request(
        self, 
        access_token: str, 
        owner: str, 
        repo: str,
        pr_number: int
    ) -> Dict[str, Any]:
        """Get pull request details."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_base}/repos/{owner}/{repo}/pulls/{pr_number}",
                headers=self._get_auth_headers(access_token)
            )
            response.raise_for_status()
            return response.json()
    
    async def get_pr_diff(
        self, 
        access_token: str, 
        owner: str, 
        repo: str,
        pr_number: int
    ) -> str:
        """Get the diff content of a pull request."""
        async with httpx.AsyncClient() as client:
            headers = self._get_auth_headers(access_token)
            headers["Accept"] = "application/vnd.github.v3.diff"
            
            response = await client.get(
                f"{self.api_base}/repos/{owner}/{repo}/pulls/{pr_number}",
                headers=headers
            )
            response.raise_for_status()
            return response.text
    
    async def get_repository_stats(
        self, 
        access_token: str, 
        owner: str, 
        repo: str
    ) -> Dict[str, Any]:
        """Get repository statistics including commits, contributors."""
        async with httpx.AsyncClient() as client:
            # Get commit activity
            commits_response = await client.get(
                f"{self.api_base}/repos/{owner}/{repo}/stats/commit_activity",
                headers=self._get_auth_headers(access_token)
            )
            
            # Get contributors
            contributors_response = await client.get(
                f"{self.api_base}/repos/{owner}/{repo}/contributors",
                headers=self._get_auth_headers(access_token)
            )
            
            return {
                "commit_activity": commits_response.json() if commits_response.status_code == 200 else [],
                "contributors": contributors_response.json() if contributors_response.status_code == 200 else []
            }
    
    async def add_collaborator(
        self, 
        access_token: str, 
        owner: str, 
        repo: str,
        username: str,
        permission: str = "push"
    ) -> bool:
        """Add a collaborator to a repository."""
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{self.api_base}/repos/{owner}/{repo}/collaborators/{username}",
                headers=self._get_auth_headers(access_token),
                json={"permission": permission}
            )
            return response.status_code in [201, 204]

    async def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """Exchange OAuth code for access token."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": settings.GITHUB_REDIRECT_URI
                }
            )
            response.raise_for_status()
            return response.json()


# Singleton instance
github_service = GitHubService()

