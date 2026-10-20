from pathlib import Path

from sqlalchemy import inspect, text
from sqlmodel import Session, SQLModel, create_engine

DATABASE_PATH = Path(__file__).resolve().parents[1] / "data" / "meeple-night.db"
DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
engine = create_engine(f"sqlite:///{DATABASE_PATH}", connect_args={"check_same_thread": False})


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
    # The workshop starts without migrations. Keep existing local databases
    # compatible when the remote catalogue identifier is introduced.
    columns = {column["name"] for column in inspect(engine).get_columns("boardgame")}
    if "catalogue_id" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE boardgame ADD COLUMN catalogue_id TEXT"))


def get_session():
    with Session(engine) as session:
        yield session
