# The Fictionverse - Product Requirements Document

## Original Problem Statement
Build "The Fictionverse," a high-fidelity digital publishing platform with a "Cyber-Spatial / Abstract Futurism" aesthetic. The platform hosts and organizes fictional realities, distinguishing between "Original Protocols" (new universes) and "Inspired Simulations" (fan-created expansions of existing worlds).

## User Personas
- **Travelers/Commanders**: Readers who explore stories, browse by genre, and navigate chapters
- **Architects**: Writers who build worlds, publish chapters, create character bios, and manage lore

## Core Requirements

### Aesthetic
- Deep Obsidian backgrounds (`#050505`)
- Neon Cyan accents (`#00F0FF`)
- Glass-morphism UI panels
- Cyber-spatial/futuristic mainframe aesthetic

### Navigation
- **Top Bar**: "The Fictionverse" text logo (left), user avatar dropdown (right, logged-in only)
- **Bottom Bar**: 5 icons - Home, Community, FV Logo (auth trigger), Explore, Challenges
- **User Dropdown Menu**: Profile, Settings, About, Logout (NO sign-in option)

### Authentication
- JWT-based authentication with HTTP-only cookies
- Sign-in/up modal triggered by center FV logo on bottom nav

## What's Been Implemented

### Phase 0: Foundation (Complete)
- [x] React frontend + FastAPI backend + MongoDB setup
- [x] Core design system (dark theme, neon accents, glass-morphism)
- [x] Multi-stage animated splash screen with user logos
- [x] Top and bottom navigation bars
- [x] JWT-based authentication system
- [x] Database models for universes, stories, chapters, characters, lore
- [x] Sample data seeding

### Phase 1: Exploration & Archive (Complete - January 2025)
- [x] **ExplorePage**: Universe listing with search, genre filters, tabs for Original/Inspired
- [x] **UniversePage**: Universe details with Chapters, Characters, Lore tabs
- [x] **StoryReader**: Clean reading interface with chapter navigation (prev/next)
- [x] **SettingsPage**: User preferences with localStorage persistence
- [x] **ProfilePage**: User profile with stats display
- [x] **CommunityPage**: Nexus hub with Clubs, Forums, Events, Trending sections
- [x] **ChallengesPage**: Writing challenges with sample prompts

### API Endpoints (All Functional)
- `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`
- `/api/universes`, `/api/universes/{id}`, `/api/universes/filter/{genre}`
- `/api/stories/{universe_id}`, `/api/stories/{universe_id}/{chapter}`
- `/api/characters/{universe_id}`, `/api/lore/{universe_id}`
- `/api/clubs`, `/api/forum/posts`, `/api/challenges`
- `/api/profile`

## Prioritized Backlog

### P0 - High Priority
- [ ] Rich text editor for story creation/editing
- [ ] Universe Builder interface for world management
- [ ] Publishing workflow for new stories

### P1 - Medium Priority
- [ ] Community forums implementation (beyond placeholders)
- [ ] Club functionality (create, join, leave)
- [ ] Challenge submission system
- [ ] Enhanced profile with reading history

### P2 - Lower Priority
- [ ] "Preferences" sub-section in Settings
- [ ] Terminology updates (Travelers, Architects, Protocols)
- [ ] Mobile optimization improvements
- [ ] Social features (following, likes, comments)

## Technical Architecture

```
/app
├── backend/
│   ├── server.py         # FastAPI app, routes, models, seeding
│   ├── .env              # MONGO_URL, DB_NAME, JWT_SECRET
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Route pages
    │   ├── App.js        # Router and state
    │   └── index.css     # Design system
    └── package.json
```

## Test Reports
- Backend: 21/21 tests passing (see `/app/tests/test_fictionverse_api.py`)
- Frontend: All features tested and verified working

## Known Issues
None currently - all reported issues resolved.

## Notes
- Splash screen key: `localStorage.fv_splash_seen`
- Auth keys: `localStorage.fv_auth`, `localStorage.fv_user`
- Settings key: `localStorage.fv_settings`
