from datetime import date

from pydantic import BaseModel, Field

from app.models import AttendanceStatus


class PlayerCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)


class PlayerRead(PlayerCreate):
    id: int


class BoardGameRead(BaseModel):
    id: int
    name: str
    min_players: int
    max_players: int
    duration_minutes: int
    complexity: int
    categories: list[str]


class CatalogueGameRead(BaseModel):
    catalogue_id: str
    name: str
    min_players: int
    max_players: int
    duration_minutes: int


class GameNightCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    scheduled_for: date
    available_minutes: int = Field(ge=30, le=720)


class GameNightUpdate(GameNightCreate):
    pass


class AttendeeRead(BaseModel):
    id: int
    name: str
    status: AttendanceStatus


class NightGameRead(BoardGameRead):
    manually_selected: bool


class GameNightRead(BaseModel):
    id: int
    title: str
    scheduled_for: date
    available_minutes: int
    attendees: list[AttendeeRead] = []
    games: list[NightGameRead] = []
