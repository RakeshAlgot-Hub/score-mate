from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class BatsmanStats(BaseModel):
    name: Optional[str] = None
    runs: Optional[int] = None
    balls: Optional[int] = None
    fours: Optional[int] = None
    sixes: Optional[int] = None
    strikeRate: Optional[float] = None
    isOut: Optional[bool] = None
    dismissal: Optional[str] = None


class BowlerStats(BaseModel):
    name: Optional[str] = None
    overs: Optional[float] = None
    maidens: Optional[int] = None
    runs: Optional[int] = None
    wickets: Optional[int] = None
    economyRate: Optional[float] = None


class Extras(BaseModel):
    byes: Optional[int] = 0
    legByes: Optional[int] = 0
    wides: Optional[int] = 0
    noBalls: Optional[int] = 0
    penalties: Optional[int] = 0
    total: Optional[int] = 0


class FallOfWicket(BaseModel):
    wicket: Optional[int] = None
    runs: Optional[int] = None
    over: Optional[float] = None
    batsman: Optional[str] = None


class Scoreboard(BaseModel):
    matchId: Optional[str] = None
    hostTeam: Optional[str] = None
    visitorTeam: Optional[str] = None
    currentInnings: Optional[int] = None
    battingTeam: Optional[str] = None
    bowlingTeam: Optional[str] = None
    score: Optional[int] = 0
    wickets: Optional[int] = 0
    overs: Optional[int] = 0
    balls: Optional[int] = 0
    target: Optional[int] = 0
    currentBatsmen: Optional[List[BatsmanStats]] = Field(default_factory=list)
    currentBowler: Optional[BowlerStats] = None
    allBatsmen: Optional[List[BatsmanStats]] = Field(default_factory=list)
    allBowlers: Optional[List[BowlerStats]] = Field(default_factory=list)
    extras: Optional[Extras] = Field(default_factory=Extras)
    fallOfWickets: Optional[List[FallOfWicket]] = Field(default_factory=list)
    isComplete: Optional[bool] = False
    result: Optional[str] = None
    lastUpdated: Optional[datetime] = None
