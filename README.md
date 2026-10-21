# Meeple Night

Meeple Night is a local-first game-night planner used as the starting point for an agentic software-development workshop.

The application intentionally implements only a vertical core flow: create a game night, add attendees, browse a local game catalogue, and select games manually. The **Smart Game Night Plan** is deliberately not implemented; its specification, implementation, review, and evaluation are workshop exercises.

## Stack

- Python 3.11+, FastAPI, SQLModel, SQLite
- Node.js 20+, React, TypeScript, Vite
- No AI is used at application runtime.

## Run locally

Start the API:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

In another terminal, start the UI:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

The SQLite database is created at `backend/data/meeple-night.db`. Delete it to reset local data.

### Live game catalogue

The game picker queries the token-free [TableArchive](https://tablearchive.dev/) API from the Python backend, never from the browser. It initially shows popular board games and searches the remote catalogue after two input characters. Responses are cached for five minutes.

## Workshop map

- Start with [`docs/workshop/agenda.md`](docs/workshop/agenda.md).
- Work through the numbered instructions in [`docs/workshop/exercises/`](docs/workshop/exercises/).
- The prepared [OpenSpec change](openspec/changes/smart-game-night-plan/) is used for the optional second delivery run in Exercise 2; the primary run is story-driven.
- In Exercise 4, participants create the Planner, Implementer, Merger, Reviewer, and Orchestrator roles in [`.claude/agents/`](.claude/agents/). Exercise 5 introduces the review rubric and restricts its access to the Reviewer. The `alignment-evaluator` role evaluates the fictional Exercise 6 scenario without access to those rubrics.
- Deterministic evaluation fixtures live in [`evals/`](evals/).

## Current capabilities

- Create a game night with a date and available playing time.
- Add known players to a game night.
- Browse popular games and search the remote catalogue before attaching a game to a game night.
- Mark games as manually selected.

## Intentionally missing capabilities

- RSVP status and preference management
- Automatic plan generation and alternative plans
- Eligibility, scoring, and explanation rules

## Quality baseline

The Greenfield repository intentionally contains no test runner, linter, or Claude Code quality hook. Participants add tests, linters, and a quality gate in the Backpressure exercise; path-scoped gates are an optional stretch goal. See [`docs/workshop/exercises/03-backpressure.md`](docs/workshop/exercises/03-backpressure.md).
