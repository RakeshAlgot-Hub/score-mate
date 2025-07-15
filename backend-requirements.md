# Cricket Scoring Backend Requirements
## FastAPI + MongoDB Implementation

### Technology Stack
- **Framework**: FastAPI 0.104+
- **Database**: MongoDB 6.0+
- **ODM**: Motor (async MongoDB driver) + Pydantic
- **Authentication**: Optional JWT (for multi-user support)
- **CORS**: FastAPI CORS middleware
- **Validation**: Pydantic v2 models

---

## Environment Configuration

```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=cricket_scoremate

# API Configuration
API_HOST=0.0.0.0
API_PORT=9000
DEBUG=true

# CORS Origins (Frontend URLs)
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000", "https://your-frontend-domain.com"]

# Optional: JWT Secret for authentication
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
```

---

## Database Schema

### 1. `matches` Collection
```json
{
  "_id": "ObjectId",
  "hostTeam": {
    "name": "string",
    "players": ["string"] // Optional: pre-defined player list
  },
  "visitorTeam": {
    "name": "string",
    "players": ["string"]
  },
  "tossWonBy": "host | visitor",
  "optedTo": "bat | bowl",
  "overs": "number", // Total overs for the match
  "settings": {
    "playersPerTeam": "number", // Default: 11
    "noBall": {
      "reball": "boolean", // Default: true
      "runs": "number" // Default: 1
    },
    "wideBall": {
      "reball": "boolean", // Default: true
      "runs": "number" // Default: 1
    }
  },
  "openingPlayers": {
    "striker": "string",
    "nonStriker": "string",
    "bowler": "string"
  },
  "currentInnings": "number", // 1 or 2
  "battingTeam": "string", // "host" or "visitor"
  "bowlingTeam": "string", // "host" or "visitor"
  "status": "active | completed | abandoned",
  "createdAt": "datetime",
  "lastUpdated": "datetime"
}
```

### 2. `balls` Collection (Ball-by-Ball Data)
```json
{
  "_id": "ObjectId",
  "matchId": "ObjectId", // Reference to matches collection
  "innings": "number", // 1 or 2
  "over": "number", // 0-based over number
  "ball": "number", // 1-6 (legal balls only)
  "ballSequence": "number", // Global sequence including extras
  "ballType": "normal | wide | noBall | bye | legBye | wicket",
  "runs": "number", // Runs scored on this ball
  "isWicket": "boolean",
  "wicketType": "bowled | caught | lbw | runout | stumped | hitwicket | null",
  "batsman": "string", // Batsman on strike
  "bowler": "string", // Current bowler
  "newBatsman": "string | null", // If wicket, new batsman name
  "commentary": "string | null", // Optional commentary
  "timestamp": "datetime",
  "isLegalBall": "boolean" // false for wides, no-balls
}
```

### 3. `scoreboards` Collection (Computed/Cached Data)
```json
{
  "_id": "ObjectId",
  "matchId": "ObjectId",
  "hostTeam": "string",
  "visitorTeam": "string",
  "currentInnings": "number",
  "battingTeam": "string", // Team name currently batting
  "bowlingTeam": "string", // Team name currently bowling
  "score": "number", // Total runs
  "wickets": "number", // Wickets fallen
  "balls": "number", // Total balls bowled (including extras)
  "legalBalls": "number", // Only legal balls (for over calculation)
  "overs": "number", // Completed overs (legalBalls / 6)
  "target": "number | null", // Target for 2nd innings
  "currentBatsmen": [
    {
      "name": "string",
      "runs": "number",
      "balls": "number", // Balls faced
      "fours": "number",
      "sixes": "number",
      "strikeRate": "number", // Calculated: (runs/balls) * 100
      "isOut": "boolean",
      "dismissal": "string | null" // How they got out
    }
  ],
  "currentBowler": {
    "name": "string",
    "overs": "number", // Total balls bowled by this bowler
    "maidens": "number",
    "runs": "number", // Runs conceded
    "wickets": "number",
    "economyRate": "number" // Calculated: runs / (overs/6)
  },
  "allBatsmen": [
    {
      "name": "string",
      "runs": "number",
      "balls": "number",
      "fours": "number",
      "sixes": "number",
      "strikeRate": "number",
      "isOut": "boolean",
      "dismissal": "string | null"
    }
  ],
  "allBowlers": [
    {
      "name": "string",
      "overs": "number", // Total balls bowled
      "maidens": "number",
      "runs": "number",
      "wickets": "number",
      "economyRate": "number"
    }
  ],
  "extras": {
    "byes": "number",
    "legByes": "number",
    "wides": "number",
    "noBalls": "number",
    "penalties": "number",
    "total": "number"
  },
  "fallOfWickets": [
    {
      "wicket": "number", // 1st wicket, 2nd wicket, etc.
      "runs": "number", // Team score when wicket fell
      "over": "number", // Over number (in balls)
      "batsman": "string" // Batsman who got out
    }
  ],
  "ballHistory": [
    {
      "ballType": "string",
      "runs": "number",
      "isWicket": "boolean",
      "wicketType": "string | null",
      "commentary": "string | null"
    }
  ],
  "isComplete": "boolean",
  "result": "string | null", // Match result description
  "lastUpdated": "datetime"
}
```

---

## API Endpoints

### Match Management

#### `POST /matches`
**Create New Match**
```json
Request Body:
{
  "hostTeam": {
    "name": "Team A",
    "players": [] // Optional
  },
  "visitorTeam": {
    "name": "Team B",
    "players": []
  },
  "tossWonBy": "host",
  "optedTo": "bat",
  "overs": 20,
  "settings": {
    "playersPerTeam": 11,
    "noBall": {
      "reball": true,
      "runs": 1
    },
    "wideBall": {
      "reball": true,
      "runs": 1
    }
  }
}

Response:
{
  "code": 201,
  "message": "Match created successfully",
  "result": {
    "id": "match_id_string",
    "scoreboard": {
      // Initial scoreboard object
      "matchId": "match_id",
      "hostTeam": "Team A",
      "visitorTeam": "Team B",
      "currentInnings": 1,
      "battingTeam": "Team A", // Based on toss
      "bowlingTeam": "Team B",
      "score": 0,
      "wickets": 0,
      "balls": 0,
      "legalBalls": 0,
      "overs": 0,
      "target": null,
      "currentBatsmen": [],
      "currentBowler": null,
      "allBatsmen": [],
      "allBowlers": [],
      "extras": {
        "byes": 0,
        "legByes": 0,
        "wides": 0,
        "noBalls": 0,
        "penalties": 0,
        "total": 0
      },
      "fallOfWickets": [],
      "ballHistory": [],
      "isComplete": false,
      "result": null
    }
  }
}
```

#### `GET /matches/{id}`
**Get Match Details**
```json
Response:
{
  "code": 200,
  "message": "Match retrieved successfully",
  "result": {
    "id": "match_id",
    "hostTeam": {
      "name": "Team A",
      "players": []
    },
    "visitorTeam": {
      "name": "Team B", 
      "players": []
    },
    "tossWonBy": "host",
    "optedTo": "bat",
    "overs": 20,
    "settings": {
      "playersPerTeam": 11,
      "noBall": {
        "reball": true,
        "runs": 1
      },
      "wideBall": {
        "reball": true,
        "runs": 1
      }
    },
    "openingPlayers": {
      "striker": "Player1",
      "nonStriker": "Player2",
      "bowler": "Bowler1"
    },
    "currentInnings": 1,
    "battingTeam": "Team A",
    "bowlingTeam": "Team B",
    "status": "active",
    "createdAt": "2024-01-01T10:00:00Z",
    "lastUpdated": "2024-01-01T10:30:00Z"
  }
}
```

#### `PUT /matches/{id}/settings`
**Update Match Settings**
```json
Request Body:
{
  "playersPerTeam": 11,
  "noBall": {
    "reball": true,
    "runs": 1
  },
  "wideBall": {
    "reball": true,
    "runs": 1
  }
}

Response:
{
  "code": 200,
  "message": "Settings updated successfully",
  "result": null
}
```

#### `PUT /matches/{id}/opening-players`
**Set Opening Players**
```json
Request Body:
{
  "striker": "Player1",
  "nonStriker": "Player2",
  "bowler": "Bowler1"
}

Response:
{
  "code": 200,
  "message": "Opening players set successfully",
  "result": null
}
```

### Live Scoring

#### `POST /matches/{id}/ball`
**Submit Ball Data**
```json
Request Body:
{
  "ballType": "normal", // "normal" | "wide" | "noBall" | "bye" | "legBye" | "wicket"
  "runs": 4,
  "isWicket": false,
  "wicketType": null, // Required if isWicket: true
  "batsman": "Player1", // Current striker
  "bowler": "Bowler1", // Current bowler
  "newBatsman": null, // Required if isWicket: true
  "commentary": "Beautiful cover drive for four"
}

Response:
{
  "code": 200,
  "message": "Ball recorded successfully",
  "result": {
    "scoreboard": {
      // Updated scoreboard object with new totals
      "matchId": "match_id",
      "score": 24,
      "wickets": 0,
      "balls": 15, // Total balls including extras
      "legalBalls": 14, // Only legal deliveries
      "overs": 2, // legalBalls / 6
      "currentBatsmen": [
        {
          "name": "Player1",
          "runs": 18,
          "balls": 12,
          "fours": 3,
          "sixes": 1,
          "strikeRate": 150.0,
          "isOut": false,
          "dismissal": null
        }
      ],
      "currentBowler": {
        "name": "Bowler1",
        "overs": 12, // Total balls bowled
        "maidens": 0,
        "runs": 18,
        "wickets": 0,
        "economyRate": 9.0
      },
      // ... rest of scoreboard
    }
  }
}
```

#### `POST /matches/{id}/undo`
**Undo Last Ball**
```json
Response:
{
  "code": 200,
  "message": "Last ball undone successfully",
  "result": {
    "scoreboard": {
      // Reverted scoreboard state
    }
  }
}
```

### Scoreboard

#### `GET /matches/{id}/scoreboard`
**Get Current Scoreboard**
```json
Response:
{
  "code": 200,
  "message": "Scoreboard retrieved successfully",
  "result": {
    "id": "scoreboard_id",
    "matchId": "match_id",
    "hostTeam": "Team A",
    "visitorTeam": "Team B",
    "currentInnings": 1,
    "battingTeam": "Team A",
    "bowlingTeam": "Team B",
    "score": 145,
    "wickets": 3,
    "balls": 78, // Total balls including extras
    "legalBalls": 72, // Legal balls only (for overs: 72/6 = 12.0)
    "overs": 12,
    "target": null,
    "currentBatsmen": [
      {
        "name": "Player3",
        "runs": 45,
        "balls": 32,
        "fours": 6,
        "sixes": 1,
        "strikeRate": 140.6,
        "isOut": false,
        "dismissal": null
      },
      {
        "name": "Player4",
        "runs": 23,
        "balls": 18,
        "fours": 3,
        "sixes": 0,
        "strikeRate": 127.8,
        "isOut": false,
        "dismissal": null
      }
    ],
    "currentBowler": {
      "name": "Bowler2",
      "overs": 18, // Total balls bowled by this bowler
      "maidens": 1,
      "runs": 32,
      "wickets": 1,
      "economyRate": 10.67
    },
    "allBatsmen": [
      {
        "name": "Player1",
        "runs": 34,
        "balls": 28,
        "fours": 4,
        "sixes": 1,
        "strikeRate": 121.4,
        "isOut": true,
        "dismissal": "c Fielder1 b Bowler1"
      }
      // ... more batsmen
    ],
    "allBowlers": [
      {
        "name": "Bowler1",
        "overs": 24, // 4 overs bowled (24 balls)
        "maidens": 0,
        "runs": 42,
        "wickets": 2,
        "economyRate": 10.5
      }
      // ... more bowlers
    ],
    "extras": {
      "byes": 2,
      "legByes": 1,
      "wides": 3,
      "noBalls": 0,
      "penalties": 0,
      "total": 6
    },
    "fallOfWickets": [
      {
        "wicket": 1,
        "runs": 23,
        "over": 18, // Over in balls (18 balls = 3.0 overs)
        "batsman": "Player1"
      }
    ],
    "ballHistory": [
      {
        "ballType": "normal",
        "runs": 4,
        "isWicket": false,
        "wicketType": null,
        "commentary": "Driven through covers"
      }
      // Last 20-30 balls for display
    ],
    "isComplete": false,
    "result": null,
    "lastUpdated": "2024-01-01T11:30:00Z"
  }
}
```

---

## Business Logic Requirements

### 1. Match Creation & Initialization
```python
async def create_match(match_data: MatchConfig):
    # 1. Create match document
    match_id = await matches_collection.insert_one(match_data)
    
    # 2. Initialize empty scoreboard
    initial_scoreboard = create_initial_scoreboard(match_data)
    await scoreboards_collection.insert_one(initial_scoreboard)
    
    # 3. Return match ID and initial scoreboard
    return {"id": match_id, "scoreboard": initial_scoreboard}
```

### 2. Ball Processing Logic
```python
async def process_ball(match_id: str, ball_data: BallData):
    # 1. Validate ball data
    validate_ball_data(ball_data)
    
    # 2. Get current match and scoreboard
    match = await get_match(match_id)
    scoreboard = await get_scoreboard(match_id)
    
    # 3. Process ball based on type
    if ball_data.ball_type == "normal":
        process_normal_ball(ball_data, scoreboard)
    elif ball_data.ball_type in ["wide", "noBall"]:
        process_extra_ball(ball_data, scoreboard, match.settings)
    elif ball_data.is_wicket:
        process_wicket(ball_data, scoreboard)
    
    # 4. Update running totals
    update_team_score(scoreboard, ball_data)
    update_batsman_stats(scoreboard, ball_data)
    update_bowler_stats(scoreboard, ball_data)
    
    # 5. Check for over completion
    if is_over_complete(scoreboard, ball_data):
        handle_over_completion(scoreboard)
    
    # 6. Check for innings/match completion
    if is_innings_complete(scoreboard, match):
        handle_innings_completion(scoreboard, match)
    
    # 7. Save ball and update scoreboard
    await balls_collection.insert_one(ball_data)
    await scoreboards_collection.replace_one(
        {"matchId": match_id}, scoreboard
    )
    
    return {"scoreboard": scoreboard}
```

### 3. Key Calculations

#### Strike Rate Calculation
```python
def calculate_strike_rate(runs: int, balls: int) -> float:
    return (runs / balls * 100) if balls > 0 else 0.0
```

#### Economy Rate Calculation
```python
def calculate_economy_rate(runs: int, balls_bowled: int) -> float:
    overs = balls_bowled / 6
    return (runs / overs) if overs > 0 else 0.0
```

#### Over Format Conversion
```python
def format_overs(total_balls: int) -> str:
    """Convert total balls to overs.balls format"""
    overs = total_balls // 6
    remaining_balls = total_balls % 6
    return f"{overs}.{remaining_balls}" if remaining_balls > 0 else str(overs)
```

### 4. Over Completion Logic
```python
def is_over_complete(scoreboard: dict, ball_data: dict) -> bool:
    """Check if over is complete (6 legal balls bowled)"""
    # Only count legal balls for over completion
    if ball_data["ballType"] in ["wide", "noBall"]:
        return False
    
    legal_balls_in_over = scoreboard["legalBalls"] % 6
    return legal_balls_in_over == 0 and scoreboard["legalBalls"] > 0

def handle_over_completion(scoreboard: dict):
    """Handle end of over - switch strike, check for maiden"""
    # Switch strike between batsmen
    if len(scoreboard["currentBatsmen"]) == 2:
        scoreboard["currentBatsmen"].reverse()
    
    # Check for maiden over
    current_bowler = scoreboard["currentBowler"]
    if current_bowler["runs_this_over"] == 0:
        current_bowler["maidens"] += 1
    
    # Reset over-specific counters
    current_bowler["runs_this_over"] = 0
```

### 5. Innings Transition
```python
def is_innings_complete(scoreboard: dict, match: dict) -> bool:
    """Check if current innings is complete"""
    max_overs = match["overs"]
    max_balls = max_overs * 6
    
    # All out or overs completed
    if (scoreboard["wickets"] >= 10 or 
        scoreboard["legalBalls"] >= max_balls):
        return True
    
    # Target achieved in 2nd innings
    if (scoreboard["currentInnings"] == 2 and 
        scoreboard["target"] and 
        scoreboard["score"] >= scoreboard["target"]):
        return True
    
    return False

async def handle_innings_completion(scoreboard: dict, match: dict):
    """Handle end of innings"""
    if scoreboard["currentInnings"] == 1:
        # Start 2nd innings
        scoreboard["currentInnings"] = 2
        scoreboard["target"] = scoreboard["score"] + 1
        
        # Switch batting/bowling teams
        scoreboard["battingTeam"], scoreboard["bowlingTeam"] = \
            scoreboard["bowlingTeam"], scoreboard["battingTeam"]
        
        # Reset scoreboard for 2nd innings
        reset_scoreboard_for_new_innings(scoreboard)
    else:
        # Match complete
        scoreboard["isComplete"] = True
        scoreboard["result"] = calculate_match_result(scoreboard)
        
        # Update match status
        await matches_collection.update_one(
            {"_id": match["_id"]},
            {"$set": {"status": "completed"}}
        )
```

### 6. Undo Functionality
```python
async def undo_last_ball(match_id: str):
    """Undo the last ball bowled"""
    # 1. Get last ball from balls collection
    last_ball = await balls_collection.find_one(
        {"matchId": match_id},
        sort=[("timestamp", -1)]
    )
    
    if not last_ball:
        raise HTTPException(400, "No balls to undo")
    
    # 2. Remove last ball
    await balls_collection.delete_one({"_id": last_ball["_id"]})
    
    # 3. Recalculate scoreboard from all remaining balls
    scoreboard = await recalculate_scoreboard(match_id)
    
    # 4. Update scoreboard
    await scoreboards_collection.replace_one(
        {"matchId": match_id}, scoreboard
    )
    
    return {"scoreboard": scoreboard}
```

---

## Database Indexes

```javascript
// Recommended MongoDB indexes for performance
db.matches.createIndex({ "status": 1, "createdAt": -1 })
db.matches.createIndex({ "createdAt": -1 })

db.balls.createIndex({ "matchId": 1, "innings": 1, "ballSequence": 1 })
db.balls.createIndex({ "matchId": 1, "timestamp": -1 })

db.scoreboards.createIndex({ "matchId": 1 })
db.scoreboards.createIndex({ "lastUpdated": -1 })
```

---

## FastAPI Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── config.py            # Environment configuration
│   ├── database.py          # MongoDB connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── match.py         # Pydantic models for matches
│   │   ├── ball.py          # Ball data models
│   │   └── scoreboard.py    # Scoreboard models
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── matches.py       # Match CRUD endpoints
│   │   ├── scoring.py       # Ball submission endpoints
│   │   └── scoreboard.py    # Scoreboard endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── match_service.py # Match business logic
│   │   ├── ball_service.py  # Ball processing logic
│   │   └── scoreboard_service.py # Scoreboard calculations
│   └── utils/
│       ├── __init__.py
│       ├── calculations.py  # Cricket calculations
│       └── validators.py    # Data validation
├── requirements.txt
├── .env
└── README.md
```

---

## Sample FastAPI Implementation

### main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

from app.routes import matches, scoring, scoreboard
from app.config import settings

load_dotenv()

app = FastAPI(
    title="Cricket ScoreMate API",
    description="Professional Cricket Scoring Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
    app.mongodb = app.mongodb_client[settings.DATABASE_NAME]
    
    # Create indexes
    await create_indexes(app.mongodb)

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

# Include routers
app.include_router(matches.router, prefix="/matches", tags=["matches"])
app.include_router(scoring.router, prefix="/matches", tags=["scoring"])
app.include_router(scoreboard.router, prefix="/matches", tags=["scoreboard"])

@app.get("/")
async def root():
    return {"message": "Cricket ScoreMate API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}
```

### models/ball.py
```python
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class BallData(BaseModel):
    ballType: Literal["normal", "wide", "noBall", "bye", "legBye", "wicket"]
    runs: int = Field(ge=0, le=6)
    isWicket: bool = False
    wicketType: Optional[Literal["bowled", "caught", "lbw", "runout", "stumped", "hitwicket"]] = None
    batsman: str
    bowler: str
    newBatsman: Optional[str] = None
    commentary: Optional[str] = None

class BallRecord(BallData):
    id: Optional[str] = Field(alias="_id")
    matchId: str
    innings: int
    over: int
    ball: int
    ballSequence: int
    timestamp: datetime
    isLegalBall: bool
    
    class Config:
        populate_by_name = True
```

---

## Error Handling

```python
from fastapi import HTTPException

class CricketAPIException(HTTPException):
    def __init__(self, status_code: int, message: str, details: dict = None):
        super().__init__(status_code, detail={
            "message": message,
            "details": details or {}
        })

# Usage examples
raise CricketAPIException(400, "Invalid ball data", {"field": "runs", "value": 7})
raise CricketAPIException(404, "Match not found", {"matchId": match_id})
raise CricketAPIException(409, "Match already completed")
```

---

## Required Dependencies

```txt
fastapi==0.104.1
motor==3.3.2
pydantic==2.5.0
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-dotenv==1.0.0
pymongo==4.6.0
```

---

## Development Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 9000

# Run with environment variables
python -m uvicorn app.main:app --reload --port 9000
```

This backend implementation provides all the necessary endpoints and business logic to support the React frontend, with proper cricket scoring rules, real-time scoreboard updates, and robust error handling.