# Models/ballModel.py
from pydantic import BaseModel
from typing import Optional, Literal


class BallEvent(BaseModel):
    ballType: Literal["normal", "wide", "noBall", "bye", "legBye", "wicket"]
    runs: int
    isWicket: bool = False
    wicketType: Optional[Literal["bowled", "caught", "lbw", "runout", "stumped", "hitwicket"]] = None
    batsman: Optional[str] = None
    bowler: Optional[str] = None
    newBatsman: Optional[str] = None
    commentary: Optional[str] = None 
