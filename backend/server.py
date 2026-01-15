from fastapi import FastAPI, APIRouter, HTTPException, Response, Cookie, Depends
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
    role: str = "traveler"  # traveler, architect, commander
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
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
    genre: str  # "Sci-Fi", "Noir", "Fantasy", "Cyberpunk", "Mystery"
    author: str
    author_email: str
    cover_image: Optional[str] = None
    status: str = "active"  # active, draft, archived
    is_premium: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UniverseCreate(BaseModel):
    title: str
    description: str
    type: str
    genre: str
    cover_image: Optional[str] = None
    is_premium: bool = False

class Story(BaseModel):
    model_config = ConfigDict(extra="ignore")
    universe_id: str
    title: str
    content: str
    chapter_number: int
    author: str
    author_email: str
    status: str = "published"  # draft, published, archived
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StoryCreate(BaseModel):
    universe_id: str
    title: str
    content: str
    chapter_number: int
    status: str = "published"

class Character(BaseModel):
    model_config = ConfigDict(extra="ignore")
    universe_id: str
    name: str
    description: str
    role: str  # protagonist, antagonist, supporting
    image_url: Optional[str] = None
    traits: List[str] = []
    backstory: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CharacterCreate(BaseModel):
    universe_id: str
    name: str
    description: str
    role: str
    image_url: Optional[str] = None
    traits: List[str] = []
    backstory: Optional[str] = None

class LoreEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    universe_id: str
    title: str
    content: str
    category: str  # history, technology, culture, geography
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoreEntryCreate(BaseModel):
    universe_id: str
    title: str
    content: str
    category: str

class Club(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    description: str
    type: str  # reading, writing, discussion
    creator: str
    members: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ClubCreate(BaseModel):
    name: str
    description: str
    type: str

class ForumPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    content: str
    author: str
    author_email: str
    category: str  # theory, critique, general, announcement
    tags: List[str] = []
    replies_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ForumPostCreate(BaseModel):
    title: str
    content: str
    category: str
    tags: List[str] = []

class ForumReply(BaseModel):
    model_config = ConfigDict(extra="ignore")
    post_id: str
    content: str
    author: str
    author_email: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ForumReplyCreate(BaseModel):
    post_id: str
    content: str

class Challenge(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    description: str
    prompt: str
    type: str  # writing, worldbuilding, character
    deadline: Optional[datetime] = None
    submissions: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChallengeCreate(BaseModel):
    title: str
    description: str
    prompt: str
    type: str
    deadline: Optional[datetime] = None


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

def get_current_user(token: str = Cookie(None, alias="fv_token")):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email, "username": payload.get("username")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


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
        "role": "traveler",
        "bio": None,
        "avatar_url": None,
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
            "role": "traveler"
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
async def create_universe(universe: UniverseCreate, current_user: dict = Depends(get_current_user)):
    universe_dict = universe.model_dump()
    universe_dict["author"] = current_user["username"]
    universe_dict["author_email"] = current_user["email"]
    universe_dict["status"] = "active"
    universe_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.universes.insert_one(universe_dict)
    universe_dict["_id"] = str(result.inserted_id)
    
    return universe_dict

@api_router.get("/universes/{universe_id}")
async def get_universe(universe_id: str):
    universe = await db.universes.find_one({"title": universe_id}, {"_id": 0})
    if not universe:
        raise HTTPException(status_code=404, detail="Universe not found")
    return universe

@api_router.get("/universes/filter/{genre}")
async def filter_universes_by_genre(genre: str):
    universes = await db.universes.find({"genre": genre}, {"_id": 0}).to_list(1000)
    return universes


# ========== STORIES/CHAPTERS ROUTES ==========

@api_router.get("/stories/{universe_id}")
async def get_stories_by_universe(universe_id: str):
    stories = await db.stories.find({"universe_id": universe_id}, {"_id": 0}).sort("chapter_number", 1).to_list(1000)
    return stories

@api_router.get("/stories/{universe_id}/{chapter_number}")
async def get_story_chapter(universe_id: str, chapter_number: int):
    story = await db.stories.find_one({"universe_id": universe_id, "chapter_number": chapter_number}, {"_id": 0})
    if not story:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return story

@api_router.post("/stories")
async def create_story(story: StoryCreate, current_user: dict = Depends(get_current_user)):
    story_dict = story.model_dump()
    story_dict["author"] = current_user["username"]
    story_dict["author_email"] = current_user["email"]
    story_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.stories.insert_one(story_dict)
    story_dict["_id"] = str(result.inserted_id)
    
    return story_dict

@api_router.put("/stories/{story_id}")
async def update_story(story_id: str, story: StoryCreate, current_user: dict = Depends(get_current_user)):
    # Update story
    await db.stories.update_one(
        {"_id": story_id, "author_email": current_user["email"]},
        {"$set": story.model_dump()}
    )
    return {"message": "Story updated"}


# ========== CHARACTERS ROUTES ==========

@api_router.get("/characters/{universe_id}")
async def get_characters(universe_id: str):
    characters = await db.characters.find({"universe_id": universe_id}, {"_id": 0}).to_list(1000)
    return characters

@api_router.post("/characters")
async def create_character(character: CharacterCreate, current_user: dict = Depends(get_current_user)):
    character_dict = character.model_dump()
    character_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.characters.insert_one(character_dict)
    character_dict["_id"] = str(result.inserted_id)
    
    return character_dict


# ========== LORE ROUTES ==========

@api_router.get("/lore/{universe_id}")
async def get_lore(universe_id: str):
    lore_entries = await db.lore.find({"universe_id": universe_id}, {"_id": 0}).to_list(1000)
    return lore_entries

@api_router.post("/lore")
async def create_lore(lore: LoreEntryCreate, current_user: dict = Depends(get_current_user)):
    lore_dict = lore.model_dump()
    lore_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.lore.insert_one(lore_dict)
    lore_dict["_id"] = str(result.inserted_id)
    
    return lore_dict


# ========== CLUBS ROUTES ==========

@api_router.get("/clubs")
async def get_clubs():
    clubs = await db.clubs.find({}, {"_id": 0}).to_list(1000)
    return clubs

@api_router.post("/clubs")
async def create_club(club: ClubCreate, current_user: dict = Depends(get_current_user)):
    club_dict = club.model_dump()
    club_dict["creator"] = current_user["username"]
    club_dict["members"] = [current_user["email"]]
    club_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.clubs.insert_one(club_dict)
    club_dict["_id"] = str(result.inserted_id)
    
    return club_dict

@api_router.post("/clubs/{club_id}/join")
async def join_club(club_id: str, current_user: dict = Depends(get_current_user)):
    await db.clubs.update_one(
        {"_id": club_id},
        {"$addToSet": {"members": current_user["email"]}}
    )
    return {"message": "Joined club successfully"}


# ========== FORUM ROUTES ==========

@api_router.get("/forum/posts")
async def get_forum_posts(category: Optional[str] = None):
    query = {"category": category} if category else {}
    posts = await db.forum_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return posts

@api_router.get("/forum/posts/{post_id}")
async def get_forum_post(post_id: str):
    post = await db.forum_posts.find_one({"_id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Get replies
    replies = await db.forum_replies.find({"post_id": post_id}, {"_id": 0}).sort("created_at", 1).to_list(1000)
    post["replies"] = replies
    
    return post

@api_router.post("/forum/posts")
async def create_forum_post(post: ForumPostCreate, current_user: dict = Depends(get_current_user)):
    post_dict = post.model_dump()
    post_dict["author"] = current_user["username"]
    post_dict["author_email"] = current_user["email"]
    post_dict["replies_count"] = 0
    post_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.forum_posts.insert_one(post_dict)
    post_dict["_id"] = str(result.inserted_id)
    
    return post_dict

@api_router.post("/forum/replies")
async def create_forum_reply(reply: ForumReplyCreate, current_user: dict = Depends(get_current_user)):
    reply_dict = reply.model_dump()
    reply_dict["author"] = current_user["username"]
    reply_dict["author_email"] = current_user["email"]
    reply_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.forum_replies.insert_one(reply_dict)
    
    # Increment reply count on post
    await db.forum_posts.update_one(
        {"_id": reply.post_id},
        {"$inc": {"replies_count": 1}}
    )
    
    reply_dict["_id"] = str(result.inserted_id)
    return reply_dict


# ========== CHALLENGES ROUTES ==========

@api_router.get("/challenges")
async def get_challenges():
    challenges = await db.challenges.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return challenges

@api_router.post("/challenges")
async def create_challenge(challenge: ChallengeCreate, current_user: dict = Depends(get_current_user)):
    challenge_dict = challenge.model_dump()
    challenge_dict["submissions"] = []
    challenge_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.challenges.insert_one(challenge_dict)
    challenge_dict["_id"] = str(result.inserted_id)
    
    return challenge_dict


# ========== USER PROFILE ROUTES ==========

@api_router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"email": current_user["email"]}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.put("/profile")
async def update_profile(bio: Optional[str] = None, avatar_url: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    update_data = {}
    if bio is not None:
        update_data["bio"] = bio
    if avatar_url is not None:
        update_data["avatar_url"] = avatar_url
    
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": update_data}
    )
    
    return {"message": "Profile updated successfully"}


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
    # Seed universes if empty
    universes_count = await db.universes.count_documents({})
    if universes_count == 0:
        sample_universes = [
            {
                "title": "Chronicles of Aether",
                "description": "A mystical realm where magic and technology intertwine. Follow heroes as they navigate floating cities and ancient mysteries.",
                "type": "Original",
                "genre": "Fantasy",
                "author": "Nova Starweaver",
                "author_email": "nova@fictionverse.io",
                "status": "active",
                "is_premium": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Neon Shadows",
                "description": "In a cyberpunk dystopia, hackers fight against corporate overlords. High-tech thrills meet underground resistance.",
                "type": "Original",
                "genre": "Cyberpunk",
                "author": "Cipher Echo",
                "author_email": "cipher@fictionverse.io",
                "status": "active",
                "is_premium": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "The Last Garden",
                "description": "After Earth's collapse, survivors discover a hidden sanctuary. Hope blooms in the most unexpected places.",
                "type": "Original",
                "genre": "Sci-Fi",
                "author": "Eden Bloom",
                "author_email": "eden@fictionverse.io",
                "status": "active",
                "is_premium": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Wizards United",
                "description": "Expanding on the magical world we love, new students discover hidden chambers and forgotten spells at Hogwarts.",
                "type": "Inspired",
                "genre": "Fantasy",
                "author": "Mystic Quill",
                "author_email": "mystic@fictionverse.io",
                "status": "active",
                "is_premium": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Middle Earth: The Fourth Age",
                "description": "Long after the Ring was destroyed, new threats emerge. Descendants of heroes must rise once more.",
                "type": "Inspired",
                "genre": "Fantasy",
                "author": "Ranger's Tale",
                "author_email": "ranger@fictionverse.io",
                "status": "active",
                "is_premium": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Starfleet Academy Chronicles",
                "description": "Before the Enterprise, cadets learn what it means to explore strange new worlds and seek out new life.",
                "type": "Inspired",
                "genre": "Sci-Fi",
                "author": "Commander Stellar",
                "author_email": "stellar@fictionverse.io",
                "status": "active",
                "is_premium": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.universes.insert_many(sample_universes)
        logger.info("Sample universes seeded successfully")
    
    # Seed stories if empty
    stories_count = await db.stories.count_documents({})
    if stories_count == 0:
        # Seed sample stories for Neon Shadows
        sample_stories = [
            {
                "universe_id": "Neon Shadows",
                "title": "Chapter 1: The Network Breach",
                "content": "The city never sleeps, and neither do its digital ghosts. Rain cascaded down the neon-lit streets of Neo-Tokyo as Kira pulled her hood tighter, her neural implant buzzing with encrypted data streams. Tonight's job was supposed to be simple: breach the Omnicorp mainframe, extract the files, disappear into the digital fog. But nothing in the shadows is ever simple.\n\nHer fingers danced across the holographic interface, code flowing like liquid light. The corporation's firewall was a beast—adaptive, learning, almost alive. Almost. Kira had faced worse. In the underworld of cyber-warfare, she was known as Ghost Protocol, a whisper in the machine, impossible to trace.\n\n'You're in,' came the voice through her earpiece. Jax, her partner, monitoring from a safe house across the city. 'But there's movement. Corp security is mobilizing.'\n\n'Let them come,' Kira muttered, her eyes reflecting the cascading data. She had thirty seconds before the trace completed. Thirty seconds to change everything.",
                "chapter_number": 1,
                "author": "Cipher Echo",
                "author_email": "cipher@fictionverse.io",
                "status": "published",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "universe_id": "Neon Shadows",
                "title": "Chapter 2: Corporate Shadows",
                "content": "The extraction went sideways faster than Kira anticipated. Omnicorp wasn't just another megacorp—they had something new, something dangerous. As the data flooded her neural interface, fragmented images flashed: black sites, human experiments, a project codenamed 'Eclipse.'\n\n'Ghost, you need to abort!' Jax's voice cracked with static. 'They're using hunter-drones. Military grade!'\n\nKira's heart raced as she severed the connection, yanking the data spike from the terminal. The warehouse erupted in crimson warning lights. Through the grimy windows, she saw them: sleek, spider-like drones descending from the perpetual smog, their optical sensors scanning for heat signatures.\n\nShe bolted for the fire escape, her augmented legs propelling her up the rusted ladder. Behind her, plasma rounds scorched the metal, melting through decades of corrosion. The city sprawled beneath her, a labyrinth of light and shadow. Somewhere in that maze, answers waited. And so did the people who wanted her dead.",
                "chapter_number": 2,
                "author": "Cipher Echo",
                "author_email": "cipher@fictionverse.io",
                "status": "published",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.stories.insert_many(sample_stories)
        logger.info("Sample stories seeded successfully")
    
    # Seed characters if empty
    characters_count = await db.characters.count_documents({})
    if characters_count == 0:
        # Seed sample characters
        sample_characters = [
            {
                "universe_id": "Neon Shadows",
                "name": "Kira 'Ghost Protocol' Chen",
                "description": "Elite hacker and data thief operating in Neo-Tokyo's underbelly",
                "role": "protagonist",
                "traits": ["Brilliant", "Resourceful", "Haunted by past", "Loyal"],
                "backstory": "Once a corporate security analyst, Kira witnessed Omnicorp's dark experiments firsthand. She faked her death and emerged as Ghost Protocol, dedicated to exposing corporate corruption one breach at a time.",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "universe_id": "Neon Shadows",
                "name": "Jax Rivera",
                "description": "Former military tech specialist and Kira's trusted partner",
                "role": "supporting",
                "traits": ["Tactical", "Protective", "Tech-savvy", "Cynical"],
                "backstory": "Discharged after questioning orders, Jax found purpose in the underground resistance. His military connections provide invaluable intel.",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.characters.insert_many(sample_characters)
        logger.info("Sample characters seeded successfully")
    
    # Seed lore if empty
    lore_count = await db.lore.count_documents({})
    if lore_count == 0:
        # Seed sample lore
        sample_lore = [
            {
                "universe_id": "Neon Shadows",
                "title": "Neo-Tokyo Overview",
                "content": "Neo-Tokyo rose from the ashes of the old world, a vertical city of impossible scale. Three hundred million souls packed into megastructures that pierce the perpetual smog. The upper levels belong to the elite, bathed in artificial sunlight. The lower levels—the Undercity—exist in eternal twilight, where the law is whatever the corps say it is.",
                "category": "geography",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "universe_id": "Neon Shadows",
                "title": "Neural Implants",
                "content": "Every citizen above Level 50 has neural implants—direct brain-computer interfaces that allow seamless interaction with the digital world. But the corps control the firmware. Every thought, every transaction, monitored. In the Undercity, hackers trade in black-market mods that promise freedom. At a price.",
                "category": "technology",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.lore.insert_many(sample_lore)
        logger.info("Sample lore seeded successfully")
    
    # Seed clubs if empty
    clubs_count = await db.clubs.count_documents({})
    if clubs_count == 0:
        # Seed sample clubs
        sample_clubs = [
            {
                "name": "Cyberpunk Writers Circle",
                "description": "A community for architects crafting dystopian futures and neon-soaked narratives",
                "type": "writing",
                "creator": "System",
                "members": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Fantasy Realm Readers",
                "description": "Travelers who explore magical universes and epic quests together",
                "type": "reading",
                "creator": "System",
                "members": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.clubs.insert_many(sample_clubs)
        logger.info("Sample clubs seeded successfully")
        
        # Seed sample forum posts
        sample_forum_posts = [
            {
                "title": "Theory: Is Project Eclipse connected to the old world governments?",
                "content": "I've been reading through the Neon Shadows chapters and noticed some interesting details about Project Eclipse. The timing of the experiments coincides with the fall of the UN. Anyone else notice this pattern?",
                "author": "DataHunter",
                "author_email": "hunter@fictionverse.io",
                "category": "theory",
                "tags": ["Neon Shadows", "Eclipse", "Theory"],
                "replies_count": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "Writing Critique: How to write better dialogue in cyberpunk settings?",
                "content": "Fellow architects, I'm working on my own cyber-noir universe and struggling with authentic-feeling dialogue. It either sounds too modern or too forced. Any tips from experienced writers here?",
                "author": "NoviceArchitect",
                "author_email": "novice@fictionverse.io",
                "category": "critique",
                "tags": ["Writing Tips", "Cyberpunk", "Dialogue"],
                "replies_count": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.forum_posts.insert_many(sample_forum_posts)
        logger.info("Sample forum posts seeded successfully")
        
        # Seed sample challenge
        sample_challenges = [
            {
                "title": "The 100-Word Universe Challenge",
                "description": "Create an entire universe in exactly 100 words. Show us a world worth exploring.",
                "prompt": "In 100 words, describe a unique fictional universe. Include: setting, one character, one conflict, and the rules that make your world distinct. Make every word count.",
                "type": "worldbuilding",
                "deadline": None,
                "submissions": [],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.challenges.insert_many(sample_challenges)
        logger.info("Sample challenges seeded successfully")
