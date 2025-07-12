from pydantic import BaseModel
from typing import List, Literal, Optional
from datetime import datetime

class TeamInfo(BaseModel):
    name: str
    players: List[str] = []

class NoBallRule(BaseModel):
    reball: bool
    runs: int

class WideBallRule(BaseModel):
    reball: bool
    runs: int

class MatchSettings(BaseModel):
    playersPerTeam: int
    noBall: NoBallRule
    wideBall: WideBallRule

class OpeningPlayers(BaseModel):
    striker: Optional[str] = None
    nonStriker: Optional[str] = None
    bowler: Optional[str] = None

class Match(BaseModel):
    hostTeam: TeamInfo
    visitorTeam: TeamInfo
    tossWonBy: Literal["host", "visitor"]
    optedTo: Literal["bat", "bowl"]
    overs: int
    settings: MatchSettings
    openingPlayers: Optional[OpeningPlayers] = OpeningPlayers()

    currentInnings: int = 1
    battingTeam: Optional[str] = None
    bowlingTeam: Optional[str] = None
    status: Literal["active", "completed", "abandoned"] = "active"
