from collections.abc import Generator
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.tablearchive import CatalogueGame, TableArchiveUnavailableError, table_archive_client
from app.database import create_db_and_tables, engine, get_session
from app.models import BoardGame, GameNight, GameNightAttendee, GameNightGame, Player
from app.schemas import (
    AttendeeRead,
    BoardGameRead,
    CatalogueGameRead,
    GameNightCreate,
    GameNightRead,
    GameNightUpdate,
    NightGameRead,
    PlayerCreate,
    PlayerRead,
)
from app.seed import seed_data


@asynccontextmanager
async def lifespan(_: FastAPI) -> Generator[None, None, None]:
    create_db_and_tables()
    with Session(engine) as session:
        seed_data(session)
    yield


app = FastAPI(title="Meeple Night API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def game_read(game: BoardGame) -> BoardGameRead:
    return BoardGameRead(
        id=game.id,
        name=game.name,
        min_players=game.min_players,
        max_players=game.max_players,
        duration_minutes=game.duration_minutes,
        complexity=game.complexity,
        categories=[item for item in game.categories.split(",") if item],
    )


def catalogue_game_read(game: CatalogueGame) -> CatalogueGameRead:
    return CatalogueGameRead(
        catalogue_id=game.catalogue_id,
        name=game.name,
        min_players=game.min_players,
        max_players=game.max_players,
        duration_minutes=game.duration_minutes,
    )


def night_read(session: Session, night: GameNight) -> GameNightRead:
    attendee_links = session.exec(
        select(GameNightAttendee).where(GameNightAttendee.game_night_id == night.id)
    ).all()
    attendees = []
    for link in attendee_links:
        player = session.get(Player, link.player_id)
        if player:
            attendees.append(AttendeeRead(id=player.id, name=player.name, status=link.status))

    game_links = session.exec(
        select(GameNightGame).where(GameNightGame.game_night_id == night.id)
    ).all()
    games = []
    for link in game_links:
        game = session.get(BoardGame, link.game_id)
        if game:
            games.append(NightGameRead(**game_read(game).model_dump(), manually_selected=link.manually_selected))
    return GameNightRead(
        id=night.id,
        title=night.title,
        scheduled_for=night.scheduled_for,
        available_minutes=night.available_minutes,
        attendees=attendees,
        games=games,
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/players", response_model=list[PlayerRead])
def list_players(session: Session = Depends(get_session)) -> list[Player]:
    return list(session.exec(select(Player).order_by(Player.name)).all())


@app.post("/api/players", response_model=PlayerRead, status_code=status.HTTP_201_CREATED)
def create_player(payload: PlayerCreate, session: Session = Depends(get_session)) -> Player:
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Player name cannot be empty")
    player = Player(name=name)
    session.add(player)
    session.commit()
    session.refresh(player)
    return player


@app.delete("/api/players/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(player_id: int, session: Session = Depends(get_session)) -> Response:
    player = session.get(Player, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    for attendee in session.exec(
        select(GameNightAttendee).where(GameNightAttendee.player_id == player_id)
    ).all():
        session.delete(attendee)
    session.delete(player)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/api/games", response_model=list[BoardGameRead])
def list_games(session: Session = Depends(get_session)) -> list[BoardGameRead]:
    return [game_read(game) for game in session.exec(select(BoardGame).order_by(BoardGame.name)).all()]


@app.get("/api/catalogue/popular", response_model=list[CatalogueGameRead])
def popular_catalogue_games(limit: int = 8) -> list[CatalogueGameRead]:
    try:
        return [catalogue_game_read(game) for game in table_archive_client.popular(min(max(limit, 1), 12))]
    except TableArchiveUnavailableError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error


@app.get("/api/catalogue/search", response_model=list[CatalogueGameRead])
def search_catalogue_games(query: str = "", term: str | None = None, limit: int = 10) -> list[CatalogueGameRead]:
    cleaned_query = query.strip()
    cleaned_term = term.strip() if term else None
    if len(cleaned_query) < 2 and not cleaned_term:
        raise HTTPException(status_code=422, detail="Search needs at least two characters or a category term")
    try:
        return [
            catalogue_game_read(game)
            for game in table_archive_client.search(
                cleaned_query, min(max(limit, 1), 12), term=cleaned_term
            )
        ]
    except TableArchiveUnavailableError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error


@app.get("/api/game-nights", response_model=list[GameNightRead])
def list_game_nights(session: Session = Depends(get_session)) -> list[GameNightRead]:
    nights = session.exec(select(GameNight).order_by(GameNight.scheduled_for.desc())).all()
    return [night_read(session, night) for night in nights]


@app.post("/api/game-nights", response_model=GameNightRead, status_code=status.HTTP_201_CREATED)
def create_game_night(payload: GameNightCreate, session: Session = Depends(get_session)) -> GameNightRead:
    night = GameNight(**payload.model_dump())
    session.add(night)
    session.commit()
    session.refresh(night)
    return night_read(session, night)


@app.get("/api/game-nights/{night_id}", response_model=GameNightRead)
def get_game_night(night_id: int, session: Session = Depends(get_session)) -> GameNightRead:
    night = session.get(GameNight, night_id)
    if not night:
        raise HTTPException(status_code=404, detail="Game night not found")
    return night_read(session, night)


@app.patch("/api/game-nights/{night_id}", response_model=GameNightRead)
def update_game_night(
    night_id: int, payload: GameNightUpdate, session: Session = Depends(get_session)
) -> GameNightRead:
    night = session.get(GameNight, night_id)
    if not night:
        raise HTTPException(status_code=404, detail="Game night not found")
    for field, value in payload.model_dump().items():
        setattr(night, field, value)
    session.add(night)
    session.commit()
    session.refresh(night)
    return night_read(session, night)


@app.delete("/api/game-nights/{night_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_game_night(night_id: int, session: Session = Depends(get_session)) -> Response:
    night = session.get(GameNight, night_id)
    if not night:
        raise HTTPException(status_code=404, detail="Game night not found")
    for attendee in session.exec(
        select(GameNightAttendee).where(GameNightAttendee.game_night_id == night_id)
    ).all():
        session.delete(attendee)
    for game in session.exec(
        select(GameNightGame).where(GameNightGame.game_night_id == night_id)
    ).all():
        session.delete(game)
    session.delete(night)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.put("/api/game-nights/{night_id}/attendees/{player_id}", response_model=GameNightRead)
def add_attendee(night_id: int, player_id: int, session: Session = Depends(get_session)) -> GameNightRead:
    night = session.get(GameNight, night_id)
    if not night:
        raise HTTPException(status_code=404, detail="Game night not found")
    if not session.get(Player, player_id):
        raise HTTPException(status_code=404, detail="Player not found")
    if not session.get(GameNightAttendee, (night_id, player_id)):
        session.add(GameNightAttendee(game_night_id=night_id, player_id=player_id))
        session.commit()
    return night_read(session, night)


@app.put("/api/game-nights/{night_id}/games/{game_id}", response_model=GameNightRead)
def add_game(night_id: int, game_id: int, session: Session = Depends(get_session)) -> GameNightRead:
    night = session.get(GameNight, night_id)
    if not night:
        raise HTTPException(status_code=404, detail="Game night not found")
    if not session.get(BoardGame, game_id):
        raise HTTPException(status_code=404, detail="Game not found")
    if not session.get(GameNightGame, (night_id, game_id)):
        session.add(GameNightGame(game_night_id=night_id, game_id=game_id))
        session.commit()
    return night_read(session, night)


@app.put("/api/game-nights/{night_id}/games/catalogue/{catalogue_id}", response_model=GameNightRead)
def add_catalogue_game(night_id: int, catalogue_id: str, session: Session = Depends(get_session)) -> GameNightRead:
    night = session.get(GameNight, night_id)
    if not night:
        raise HTTPException(status_code=404, detail="Game night not found")
    game = session.exec(select(BoardGame).where(BoardGame.catalogue_id == catalogue_id)).first()
    if not game:
        try:
            catalogue_game = table_archive_client.game(catalogue_id)
        except TableArchiveUnavailableError as error:
            raise HTTPException(status_code=503, detail=str(error)) from error
        game = BoardGame(
            catalogue_id=catalogue_game.catalogue_id,
            name=catalogue_game.name,
            min_players=catalogue_game.min_players,
            max_players=catalogue_game.max_players,
            duration_minutes=catalogue_game.duration_minutes,
            complexity=1,
            categories=",".join(catalogue_game.categories),
        )
        session.add(game)
        session.commit()
        session.refresh(game)
    if not session.get(GameNightGame, (night_id, game.id)):
        session.add(GameNightGame(game_night_id=night_id, game_id=game.id))
        session.commit()
    return night_read(session, night)


@app.delete("/api/game-nights/{night_id}/games/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_game(night_id: int, game_id: int, session: Session = Depends(get_session)) -> Response:
    link = session.get(GameNightGame, (night_id, game_id))
    if not link:
        raise HTTPException(status_code=404, detail="Attached game not found")
    session.delete(link)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.put("/api/game-nights/{night_id}/games/{game_id}/selection", response_model=GameNightRead)
def set_manual_selection(
    night_id: int, game_id: int, selected: bool, session: Session = Depends(get_session)
) -> GameNightRead:
    night = session.get(GameNight, night_id)
    link = session.get(GameNightGame, (night_id, game_id))
    if not night or not link:
        raise HTTPException(status_code=404, detail="Game night or attached game not found")
    link.manually_selected = selected
    session.add(link)
    session.commit()
    return night_read(session, night)


@app.delete("/api/game-nights/{night_id}/attendees/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_attendee(night_id: int, player_id: int, session: Session = Depends(get_session)) -> Response:
    link = session.get(GameNightAttendee, (night_id, player_id))
    if not link:
        raise HTTPException(status_code=404, detail="Attendee not found")
    session.delete(link)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
