# Cricket Scorer App - Backend Requirements

## 📋 Overview
This document outlines the backend API requirements for the Cricket Scorer App. The backend should provide RESTful APIs for match management, live scoring, player statistics, and data persistence.

## 🛠️ Technology Stack Recommendations
- **Framework**: Node.js with Express.js / Python with FastAPI / Java Spring Boot
- **Database**: PostgreSQL or MongoDB
- **Real-time**: WebSocket support for live score updates
- **Authentication**: JWT tokens (optional for multi-user)
- **Documentation**: OpenAPI/Swagger
- **Deployment**: Docker containers

## 🗄️ Database Schema

### 1. Matches Table
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_team VARCHAR(100) NOT NULL,
    visitor_team VARCHAR(100) NOT NULL,
    overs INTEGER NOT NULL,
    toss_winner VARCHAR(100) NOT NULL,
    decision VARCHAR(10) CHECK (decision IN ('bat', 'bowl')),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    current_runs INTEGER DEFAULT 0,
    current_wickets INTEGER DEFAULT 0,
    current_overs INTEGER DEFAULT 0,
    current_balls INTEGER DEFAULT 0,
    batting_team VARCHAR(100),
    bowling_team VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Players Table
```sql
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    team VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Batting Stats Table
```sql
CREATE TABLE batting_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id),
    runs INTEGER DEFAULT 0,
    balls INTEGER DEFAULT 0,
    fours INTEGER DEFAULT 0,
    sixes INTEGER DEFAULT 0,
    is_out BOOLEAN DEFAULT FALSE,
    dismissal_type VARCHAR(100),
    not_out BOOLEAN DEFAULT FALSE,
    strike_rate DECIMAL(5,2) DEFAULT 0.00
);
```

### 4. Bowling Stats Table
```sql
CREATE TABLE bowling_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id),
    overs DECIMAL(3,1) DEFAULT 0.0,
    maidens INTEGER DEFAULT 0,
    runs INTEGER DEFAULT 0,
    wickets INTEGER DEFAULT 0,
    economy DECIMAL(4,2) DEFAULT 0.00
);
```

### 5. Ball by Ball Table
```sql
CREATE TABLE ball_by_ball (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    over_number INTEGER NOT NULL,
    ball_number INTEGER NOT NULL,
    batsman_id UUID REFERENCES players(id),
    bowler_id UUID REFERENCES players(id),
    runs INTEGER DEFAULT 0,
    is_wicket BOOLEAN DEFAULT FALSE,
    extra_type VARCHAR(20) CHECK (extra_type IN ('wide', 'noBall', 'bye', 'legBye')),
    dismissal_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Fall of Wickets Table
```sql
CREATE TABLE fall_of_wickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    wicket_number INTEGER NOT NULL,
    runs INTEGER NOT NULL,
    over_number DECIMAL(3,1) NOT NULL,
    batsman_id UUID REFERENCES players(id),
    dismissal_type VARCHAR(100)
);
```

## 🔌 API Endpoints

### Base URL: `http://localhost:8000/api/v1`

### 1. Match Management

#### Create New Match
```http
POST /matches
Content-Type: application/json

{
  "hostTeam": "West Indies",
  "visitorTeam": "India",
  "overs": 20,
  "tossWinner": "West Indies",
  "decision": "bat"
}

Response: 201 Created
{
  "id": "uuid",
  "hostTeam": "West Indies",
  "visitorTeam": "India",
  "overs": 20,
  "tossWinner": "West Indies",
  "decision": "bat",
  "status": "in_progress",
  "currentScore": {
    "runs": 0,
    "wickets": 0,
    "overs": 0,
    "balls": 0
  },
  "battingTeam": "West Indies",
  "bowlingTeam": "India",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Get All Matches
```http
GET /matches?status=in_progress&limit=20&offset=0

Response: 200 OK
{
  "matches": [
    {
      "id": "uuid",
      "hostTeam": "West Indies",
      "visitorTeam": "India",
      "status": "in_progress",
      "totalRuns": 22,
      "wickets": 2,
      "overs": 3.5,
      "createdAt": "17/08/2019 - 02:49 PM"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

#### Get Match by ID
```http
GET /matches/{matchId}

Response: 200 OK
{
  "id": "uuid",
  "hostTeam": "West Indies",
  "visitorTeam": "India",
  "overs": 20,
  "tossWinner": "West Indies",
  "decision": "bat",
  "status": "in_progress",
  "currentScore": {
    "runs": 22,
    "wickets": 2,
    "overs": 3,
    "balls": 5
  },
  "battingTeam": "West Indies",
  "bowlingTeam": "India",
  "createdAt": "17/08/2019 - 02:49 PM"
}
```

#### Resume Match
```http
PUT /matches/{matchId}/resume

Response: 200 OK
{
  "message": "Match resumed successfully",
  "match": { /* match object */ }
}
```

### 2. Live Scoring

#### Update Score (Ball by Ball)
```http
POST /matches/{matchId}/ball
Content-Type: application/json

{
  "run": 4,
  "isWicket": false,
  "extraType": null,
  "batsmanId": "uuid",
  "bowlerId": "uuid"
}

Response: 200 OK
{
  "message": "Score updated successfully",
  "currentScore": {
    "runs": 26,
    "wickets": 2,
    "overs": 4,
    "balls": 0
  }
}
```

#### Undo Last Ball
```http
DELETE /matches/{matchId}/ball/last

Response: 200 OK
{
  "message": "Last ball undone successfully",
  "currentScore": {
    "runs": 22,
    "wickets": 2,
    "overs": 3,
    "balls": 5
  }
}
```

### 3. Scoreboard & Statistics

#### Get Match Scoreboard
```http
GET /matches/{matchId}/scoreboard

Response: 200 OK
{
  "batting": [
    {
      "playerId": "uuid",
      "playerName": "Nicholas Pooran",
      "runs": 14,
      "balls": 12,
      "fours": 1,
      "sixes": 1,
      "strikeRate": 116.67,
      "isOut": false,
      "dismissalType": null,
      "notOut": true
    }
  ],
  "bowling": [
    {
      "playerId": "uuid",
      "playerName": "Washington Sundar",
      "overs": 2.0,
      "maidens": 0,
      "runs": 18,
      "wickets": 1,
      "economy": 9.00
    }
  ],
  "totalRuns": 22,
  "wickets": 2,
  "overs": 3,
  "balls": 5,
  "extras": {
    "wides": 0,
    "noBalls": 0,
    "byes": 0,
    "legByes": 6,
    "penalties": 0,
    "total": 6
  },
  "fallOfWickets": [
    {
      "wicket": 1,
      "runs": 1,
      "over": 0.2,
      "batsman": "John Campbell",
      "dismissalType": "c Krunal Pandya b Washington Sundar"
    }
  ]
}
```

#### Get Current Over
```http
GET /matches/{matchId}/current-over

Response: 200 OK
{
  "overNumber": 4,
  "balls": [0, 2, 0, 0, 0],
  "bowler": {
    "id": "uuid",
    "name": "Washington Sundar"
  }
}
```

### 4. Player Management

#### Get All Players
```http
GET /players?team=India&search=dhawan&limit=20&offset=0

Response: 200 OK
{
  "players": [
    {
      "id": "uuid",
      "name": "Shikhar Dhawan",
      "team": "India",
      "battingStats": {
        "matches": 3,
        "runs": 36,
        "average": 18.00,
        "strikeRate": 112.50
      },
      "bowlingStats": null,
      "fieldingStats": {
        "catches": 2,
        "runOuts": 1
      }
    }
  ],
  "total": 1
}
```

#### Get Player Statistics
```http
GET /players/{playerId}/stats

Response: 200 OK
{
  "player": {
    "id": "uuid",
    "name": "Shikhar Dhawan",
    "team": "India"
  },
  "battingStats": {
    "matches": 3,
    "innings": 3,
    "runs": 36,
    "notOuts": 1,
    "bestScore": 26,
    "strikeRate": 112.50,
    "average": 18.00,
    "fours": 2,
    "sixes": 1,
    "thirties": 0,
    "fifties": 0,
    "hundreds": 0
  },
  "bowlingStats": {
    "matches": 0,
    "overs": 0,
    "wickets": 0,
    "economy": 0.00,
    "bestFigures": null
  },
  "fieldingStats": {
    "catches": 2,
    "runOuts": 1,
    "stumpings": 0
  }
}
```

#### Create/Update Player
```http
POST /players
Content-Type: application/json

{
  "name": "Virat Kohli",
  "team": "India"
}

Response: 201 Created
{
  "id": "uuid",
  "name": "Virat Kohli",
  "team": "India",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 5. Match Analytics

#### Get Match Summary
```http
GET /matches/{matchId}/summary

Response: 200 OK
{
  "match": { /* match details */ },
  "partnerships": [
    {
      "wicket": 1,
      "runs": 15,
      "balls": 18,
      "batsman1": "John Campbell",
      "batsman2": "Evin Lewis"
    }
  ],
  "powerplayStats": {
    "runs": 45,
    "wickets": 2,
    "runRate": 7.5
  },
  "milestones": [
    {
      "type": "fifty",
      "player": "Nicholas Pooran",
      "over": 8.3
    }
  ]
}
```

## 🔄 Real-time Features (WebSocket)

### WebSocket Endpoint: `ws://localhost:8000/ws/matches/{matchId}`

#### Events to Emit:
```javascript
// Score Update
{
  "type": "SCORE_UPDATE",
  "data": {
    "runs": 26,
    "wickets": 2,
    "overs": 4,
    "balls": 0,
    "lastBall": {
      "runs": 4,
      "type": "boundary"
    }
  }
}

// Wicket Fall
{
  "type": "WICKET",
  "data": {
    "batsman": "John Campbell",
    "dismissalType": "caught",
    "runs": 22,
    "wickets": 3
  }
}

// Over Complete
{
  "type": "OVER_COMPLETE",
  "data": {
    "overNumber": 4,
    "runs": 8,
    "wickets": 0,
    "bowler": "Washington Sundar"
  }
}
```

## 🔐 Authentication (Optional)

### JWT Token-based Authentication
```http
POST /auth/login
Content-Type: application/json

{
  "username": "scorer1",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "scorer1",
    "role": "scorer"
  }
}
```

## 📊 Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "code": "MATCH_NOT_FOUND",
    "message": "Match with ID 'uuid' not found",
    "details": null,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## 🧪 Testing Requirements

### Unit Tests
- Service layer functions
- Database operations
- Validation logic

### Integration Tests
- API endpoint testing
- Database integration
- WebSocket connections

### Performance Tests
- Load testing for concurrent scoring
- Database query optimization
- Real-time update latency

## 📦 Deployment Requirements

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cricket_scorer
DATABASE_POOL_SIZE=10

# Server
PORT=8000
NODE_ENV=production
JWT_SECRET=your-secret-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker Configuration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

### Health Check Endpoint
```http
GET /health

Response: 200 OK
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "database": "connected",
  "uptime": 3600
}
```

## 🔧 Additional Features

### Data Export
```http
GET /matches/{matchId}/export?format=json|csv|pdf

Response: File download with match data
```

### Backup & Restore
```http
POST /admin/backup
GET /admin/backup/{backupId}
POST /admin/restore
```

### Analytics Dashboard
```http
GET /analytics/matches/summary?from=2024-01-01&to=2024-01-31
GET /analytics/players/top-performers?metric=runs|wickets|economy
```

## 📋 Implementation Priority

### Phase 1 (MVP)
1. Basic match CRUD operations
2. Live scoring API
3. Simple scoreboard
4. Player management

### Phase 2 (Enhanced)
1. Real-time WebSocket updates
2. Advanced statistics
3. Match analytics
4. Data export

### Phase 3 (Advanced)
1. Authentication system
2. Multi-tournament support
3. Advanced analytics dashboard
4. Mobile app API optimization

---

## 📞 Support & Documentation

- **API Documentation**: Implement OpenAPI/Swagger at `/docs`
- **Postman Collection**: Provide complete API collection
- **Database Migrations**: Include SQL migration scripts
- **Seed Data**: Provide sample data for testing

This backend will provide a robust foundation for the Cricket Scorer App with room for future enhancements and scalability.