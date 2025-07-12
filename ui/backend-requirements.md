# Score Mate Backend Requirements
## FastAPI + MongoDB Implementation

### Technology Stack
- **Framework**: FastAPI
- **Database**: MongoDB
- **ODM**: Motor (async MongoDB driver) or Beanie
- **Validation**: Pydantic models
- **CORS**: FastAPI CORS middleware for frontend integration

---

## Environment Configuration

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=score_mate
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

---

## Database Collections

### 1. `matches` Collection
```json
{
  "_id": "ObjectId",
  "hostTeam": {
    "name": "string",
    "players": ["string"]
  },
  "visitorTeam": {
    "name": "string", 
    "players": ["string"]
  },
  "tossWonBy": "host | visitor",
  "optedTo": "bat | bowl",
  "overs": "number",
  "settings": {
    "playersPerTeam": "number",
    "noBall": {
      "reball": "boolean",
      "runs": "number"
    },
    "wideBall": {
      "reball": "boolean", 
      "runs": "number"
    }
  },
  "openingPlayers": {
    "striker": "string",
    "nonStriker": "string",
    "bowler": "string"
  },
  "currentInnings": "number",
  "battingTeam": "string",
  "bowlingTeam": "string",
  "status": "active | completed | abandoned",
  "createdAt": "datetime",
  "lastUpdated": "datetime"
}
```

### 2. `balls` Collection
```json
{
  "_id": "ObjectId",
  "matchId": "ObjectId",
  "innings": "number",
  "over": "number",
  "ball": "number",
  "ballType": "normal | wide | noBall | bye | legBye | wicket",
  "runs": "number",
  "isWicket": "boolean",
  "wicketType": "bowled | caught | lbw | runout | stumped | hitwicket",
  "batsman": "string",
  "bowler": "string",
  "newBatsman": "string",
  "commentary": "string",
  "timestamp": "datetime"
}
```

### 3. `scoreboards` Collection (Computed/Cached)
```json
{
  "_id": "ObjectId",
  "matchId": "ObjectId",
  "hostTeam": "string",
  "visitorTeam": "string", 
  "currentInnings": "number",
  "battingTeam": "string",
  "bowlingTeam": "string",
  "score": "number",
  "wickets": "number",
  "overs": "number",
  "balls": "number",
  "target": "number",
  "currentBatsmen": [
    {
      "name": "string",
      "runs": "number",
      "balls": "number",
      "fours": "number",
      "sixes": "number",
      "strikeRate": "number",
      "isOut": "boolean",
      "dismissal": "string"
    }
  ],
  "currentBowler": {
    "name": "string",
    "overs": "number",
    "maidens": "number", 
    "runs": "number",
    "wickets": "number",
    "economyRate": "number"
  },
  "allBatsmen": "Array<PlayerStats>",
  "allBowlers": "Array<BowlerStats>",
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
      "wicket": "number",
      "runs": "number",
      "over": "number",
      "batsman": "string"
    }
  ],
  "isComplete": "boolean",
  "result": "string",
  "lastUpdated": "datetime"
}
```

---

## API Endpoints

### Match Management

#### `POST /api/matches`
**Create New Match**
```json
Request Body:
{
  "hostTeam": {
    "name": "string",
    "players": []
  },
  "visitorTeam": {
    "name": "string", 
    "players": []
  },
  "tossWonBy": "host | visitor",
  "optedTo": "bat | bowl",
  "overs": "number",
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
  "id": "string",
  "message": "Match created successfully",
  "scoreboard": "InitialScoreboardObject"
}
```

#### `GET /api/matches`
**Get All Matches**
```json
Response:
[
  {
    "id": "string",
    "hostTeam": "string",
    "visitorTeam": "string", 
    "tossWonBy": "string",
    "optedTo": "string",
    "overs": "number",
    "currentScore": "22/2 (3.5)",
    "status": "active | completed | abandoned",
    "createdAt": "datetime",
    "lastUpdated": "datetime"
  }
]
```

#### `GET /api/matches/{id}`
**Get Match Details**
```json
Response:
{
  "id": "string",
  "hostTeam": "TeamObject",
  "visitorTeam": "TeamObject",
  "tossWonBy": "string",
  "optedTo": "string", 
  "overs": "number",
  "settings": "MatchSettingsObject",
  "openingPlayers": "OpeningPlayersObject",
  "status": "string",
  "createdAt": "datetime",
  "lastUpdated": "datetime"
}
```

### Match Configuration

#### `PUT /api/matches/{id}/settings`
**Update Match Settings**
```json
Request Body:
{
  "playersPerTeam": "number",
  "noBall": {
    "reball": "boolean",
    "runs": "number"
  },
  "wideBall": {
    "reball": "boolean",
    "runs": "number"
  }
}

Response:
{
  "message": "Settings updated successfully"
}
```

#### `PUT /api/matches/{id}/opening-players`
**Set Opening Players**
```json
Request Body:
{
  "striker": "string",
  "nonStriker": "string", 
  "bowler": "string"
}

Response:
{
  "message": "Opening players set successfully"
}
```

### Live Scoring

#### `POST /api/matches/{id}/ball`
**Submit Ball Data**
```json
Request Body:
{
  "ballType": "normal | wide | noBall | bye | legBye | wicket",
  "runs": "number",
  "isWicket": "boolean",
  "wicketType": "bowled | caught | lbw | runout | stumped | hitwicket",
  "newBatsman": "string",
  "commentary": "string"
}

Response:
{
  "message": "Ball recorded successfully",
  "scoreboard": "UpdatedScoreboardObject"
}
```

### Scoreboard

#### `GET /api/matches/{id}/scoreboard`
**Get Current Scoreboard**
```json
Response:
{
  "id": "string",
  "hostTeam": "string",
  "visitorTeam": "string",
  "currentInnings": "number",
  "battingTeam": "string", 
  "bowlingTeam": "string",
  "score": "number",
  "wickets": "number",
  "overs": "number",
  "balls": "number",
  "target": "number",
  "currentBatsmen": [
    {
      "name": "string",
      "runs": "number",
      "balls": "number", 
      "fours": "number",
      "sixes": "number",
      "strikeRate": "number",
      "isOut": "boolean",
      "dismissal": "string"
    }
  ],
  "currentBowler": {
    "name": "string",
    "overs": "number",
    "maidens": "number",
    "runs": "number", 
    "wickets": "number",
    "economyRate": "number"
  },
  "allBatsmen": "Array<PlayerStats>",
  "allBowlers": "Array<BowlerStats>", 
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
      "wicket": "number",
      "runs": "number", 
      "over": "number",
      "batsman": "string"
    }
  ],
  "isComplete": "boolean",
  "result": "string"
}
```

---

## Business Logic Requirements

### 1. Match Creation
- Generate unique match ID
- Initialize empty scoreboard
- Set batting/bowling teams based on toss
- Create initial player stats objects

### 2. Ball Processing
- Validate ball data against match rules
- Update running totals (score, wickets, overs, balls)
- Calculate strike rates, economy rates
- Handle extras (wides, no-balls, byes, leg-byes)
- Process wickets and player changes
- Handle over completion and bowler changes
- Update fall of wickets
- Check for innings/match completion

### 3. Scoreboard Calculations
- **Strike Rate**: (runs/balls) * 100
- **Economy Rate**: runs/overs
- **Overs Format**: Complete overs + remaining balls (e.g., 3.4)
- **Required Run Rate**: (target - current_score) / remaining_overs
- **Current Run Rate**: current_score / overs_completed

### 4. Match State Management
- Track current batsmen (striker/non-striker)
- Track current bowler
- Handle strike rotation after odd runs
- Handle bowler changes at over end
- Handle innings transitions
- Determine match completion and results

### 5. Data Validation
- Ensure valid ball types and run values
- Validate player names exist in team
- Check overs don't exceed match limit
- Validate wicket types are appropriate
- Ensure proper match state transitions

### 6. Error Handling
- Invalid match ID
- Match already completed
- Invalid ball data
- Player not found
- Database connection errors
- Concurrent update conflicts

---

## Performance Considerations

### 1. Database Indexing
```javascript
// Recommended MongoDB indexes
db.matches.createIndex({ "status": 1, "createdAt": -1 })
db.balls.createIndex({ "matchId": 1, "innings": 1, "over": 1, "ball": 1 })
db.scoreboards.createIndex({ "matchId": 1 })
```

### 2. Caching Strategy
- Cache scoreboard data in separate collection
- Update scoreboard on each ball submission
- Use MongoDB change streams for real-time updates

### 3. Aggregation Pipelines
- Use MongoDB aggregation for complex statistics
- Pre-calculate common queries
- Optimize for frequent scoreboard requests

---

## Sample FastAPI Structure

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from routes import matches, scoring, scoreboard

app = FastAPI(title="Score Mate API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017")
    app.mongodb = app.mongodb_client["score_mate"]

@app.on_event("shutdown") 
async def shutdown_db_client():
    app.mongodb_client.close()

# Include routers
app.include_router(matches.router, prefix="/api")
app.include_router(scoring.router, prefix="/api") 
app.include_router(scoreboard.router, prefix="/api")
```

---

## Required Python Dependencies

```txt
fastapi==0.104.1
motor==3.3.2
pydantic==2.5.0
uvicorn==0.24.0
python-multipart==0.0.6
python-jose==3.3.0
passlib==1.7.4
```

---

## Testing Requirements

### 1. Unit Tests
- Test all calculation functions
- Test data validation
- Test error handling

### 2. Integration Tests  
- Test complete match flow
- Test API endpoints
- Test database operations

### 3. Performance Tests
- Test concurrent ball submissions
- Test large match data handling
- Test database query performance

---

This backend implementation should provide all the functionality needed for the Score Mate frontend application to work seamlessly with proper cricket scoring logic and real-time updates.