from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PlayerBase(BaseModel):
    name: str
    team: str

class PlayerCreate(PlayerBase):
    pass

class PlayerUpdate(BaseModel):
    name: Optional[str]
    team: Optional[str]

class PlayerResponse(PlayerBase):
    id: str
    createdAt: datetime
