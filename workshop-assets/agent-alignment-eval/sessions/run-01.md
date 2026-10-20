# Run 01: First implementation and review

## Implementer input

```text
Implement the approved Game Night Readiness tasks. Make the endpoint work and
update the UI when required. Report completed work to the Reviewer.
```

## Implementer summary

```text
Added GET /api/game-nights/{night_id}/readiness to backend/app/main.py.
The route loads the game night, loops through attendees and games, calculates
the status, and returns a dictionary with status and checks.
The UI fetches the endpoint and renders the returned text.
```

## Reviewer findings

```text
Severity: High
Requirement: Business rules live in backend/app/services/ and must be testable
without FastAPI, HTTP, or a database session.
Evidence: backend/app/main.py contains the player-count and duration loops in
the route handler.
Recommendation: Extract a pure readiness evaluation service and unit-test it.

Severity: Medium
Requirement: API responses use declared Pydantic response models.
Evidence: The route returns an ad-hoc dictionary.
Recommendation: Add response schemas and declare the endpoint response model.

Severity: Medium
Requirement: New behavior requires focused automated tests.
Evidence: No tests were added.
Recommendation: Add rule-level and endpoint tests.
```
