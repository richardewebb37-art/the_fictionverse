from fastapi import FastAPI, APIRouter, HTTPException, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.environ.get('JWT_SECRET', 'fictionverse-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ========== MODELS ==========

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    username: str
    email: EmailStr
    role: str = "user"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Universe(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    description: str
    type: str  # "Original" or "Inspired"
    author: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UniverseCreate(BaseModel):
    title: str
    description: str
    type: str
    author: str


# ========== HELPER FUNCTIONS ==========

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# ========== AUTH ROUTES ==========

@api_router.post("/auth/signup")
async def signup(user_data: UserCreate, response: Response):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = {
        "username": user_data.username,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_dict)
    
    # Create JWT token
    token = create_access_token({"email": user_data.email, "username": user_data.username})
    
    # Set HTTP-Only cookie
    response.set_cookie(
        key="fv_token",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax"
    )
    
    return {
        "message": "User created successfully",
        "user": {
            "username": user_data.username,
            "email": user_data.email,
            "role": "user"
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin, response: Response):
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    token = create_access_token({"email": user["email"], "username": user["username"]})
    
    # Set HTTP-Only cookie
    response.set_cookie(
        key="fv_token",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax"
    )
    
    return {
        "message": "Login successful",
        "user": {
            "username": user["username"],
            "email": user["email"],
            "role": user.get("role", "user")
        }
    }

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("fv_token")
    return {"message": "Logged out successfully"}


# ========== UNIVERSES ROUTES ==========

@api_router.get("/universes")
async def get_universes():
    # Fetch all universes
    universes = await db.universes.find({}, {"_id": 0}).to_list(1000)
    
    # Separate by type
    original = [u for u in universes if u.get("type") == "Original"]
    inspired = [u for u in universes if u.get("type") == "Inspired"]
    
    return {
        "original": original,
        "inspired": inspired
    }

@api_router.post("/universes")
async def create_universe(universe: UniverseCreate):
    universe_dict = universe.model_dump()
    universe_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.universes.insert_one(universe_dict)
    universe_dict["_id"] = str(result.inserted_id)
    
    return universe_dict


# ========== BASIC ROUTES ==========

@api_router.get("/")
async def root():
    return {"message": "The Fictionverse API", "status": "operational"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Seed some sample data on startup
@app.on_event("startup")
async def seed_data():
    # Check if universes collection is empty
    count = await db.universes.count_documents({})
    if count == 0:
        sample_universes = [
            {
                "title": "Chronicles of Aether",
                "description": "A mystical realm where magic and technology intertwine. Follow heroes as they navigate floating cities and ancient mysteries.",
                "type": "Original",
                "author": "Nova Starweaver",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Neon Shadows",
                "description": "In a cyberpunk dystopia, hackers fight against corporate overlords. High-tech thrills meet underground resistance.",
                "type": "Original",
                "author": "Cipher Echo",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "The Last Garden",
                "description": "After Earth's collapse, survivors discover a hidden sanctuary. Hope blooms in the most unexpected places.",
                "type": "Original",
                "author": "Eden Bloom",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Wizards United",
                "description": "Expanding on the magical world we love, new students discover hidden chambers and forgotten spells at Hogwarts.",
                "type": "Inspired",
                "author": "Mystic Quill",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Middle Earth: The Fourth Age",
                "description": "Long after the Ring was destroyed, new threats emerge. Descendants of heroes must rise once more.",
                "type": "Inspired",
                "author": "Ranger's Tale",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Starfleet Academy Chronicles",
                "description": "Before the Enterprise, cadets learn what it means to explore strange new worlds and seek out new life.",
                "type": "Inspired",
                "author": "Commander Stellar",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.universes.insert_many(sample_universes)
        logger.info("Sample universes seeded successfully")
