from sqlmodel import Session, select

from app.models import BoardGame

GAMES = [
    ("Azul", 2, 4, 45, 2, "Abstract,Family"),
    ("Cascadia", 1, 4, 45, 2, "Nature,Puzzle,Strategy"),
    ("Wingspan", 1, 5, 70, 3, "Nature,Engine Building,Strategy"),
    ("The Crew", 2, 5, 25, 2, "Cooperative,Trick Taking"),
    ("Codenames", 2, 8, 20, 1, "Party,Word"),
    ("Betrayal at House on the Hill", 3, 6, 90, 3, "Horror,Exploration"),
    ("Spirit Island", 1, 4, 120, 5, "Cooperative,Strategy"),
    ("Ticket to Ride", 2, 5, 60, 2, "Family,Route Building"),
]
def seed_data(session: Session) -> None:
    if not session.exec(select(BoardGame)).first():
        session.add_all(
            [
                BoardGame(
                    name=name,
                    min_players=min_players,
                    max_players=max_players,
                    duration_minutes=duration,
                    complexity=complexity,
                    categories=categories,
                )
                for name, min_players, max_players, duration, complexity, categories in GAMES
            ]
        )
    session.commit()
