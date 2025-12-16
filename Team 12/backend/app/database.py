from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database import Database
from typing import Optional
from .config import settings

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[Database] = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Create database connection."""
    mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
    mongodb.db = mongodb.client[settings.DATABASE_NAME]
    
    # Create indexes
    await mongodb.db.users.create_index("github_id", unique=True)
    await mongodb.db.users.create_index("email", unique=True, sparse=True)
    await mongodb.db.teams.create_index("repo_url", unique=True, sparse=True)
    await mongodb.db.tasks.create_index("github_issue_id")
    
    print(f"Connected to MongoDB: {settings.DATABASE_NAME}")

async def close_mongo_connection():
    """Close database connection."""
    if mongodb.client:
        mongodb.client.close()
        print("Closed MongoDB connection")

def get_database() -> Database:
    """Get database instance."""
    return mongodb.db

