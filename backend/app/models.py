from datetime import date
from enum import Enum

from sqlmodel import Field, SQLModel


class AttendanceStatus(str, Enum):
    CONFIRMED = "confirmed"
    TENTATIVE = "tentative"
    DECLINED = "declined"


class Player(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True, min_length=1, max_length=80)


class BoardGame(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    catalogue_id: str | None = Field(default=None, index=True)
    name: str = Field(index=True, min_length=1, max_length=120)
    min_players: int = Field(ge=1)
    max_players: int = Field(ge=1)
    duration_minutes: int = Field(ge=1)
    complexity: int = Field(ge=1, le=5)
    categories: str = ""


class GameNight(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=120)
    scheduled_for: date
    available_minutes: int = Field(ge=30, le=720)


class GameNightAttendee(SQLModel, table=True):
    game_night_id: int = Field(foreign_key="gamenight.id", primary_key=True)
    player_id: int = Field(foreign_key="player.id", primary_key=True)
    # The field is present in the data model, but RSVP editing is a workshop task.
    status: AttendanceStatus = Field(default=AttendanceStatus.CONFIRMED)


class GameNightGame(SQLModel, table=True):
    game_night_id: int = Field(foreign_key="gamenight.id", primary_key=True)
    game_id: int = Field(foreign_key="boardgame.id", primary_key=True)
    manually_selected: bool = False
