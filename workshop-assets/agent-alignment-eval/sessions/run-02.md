# Run 02: Revision and review

## Implementer input

```text
Address the Reviewer findings for Game Night Readiness. Keep the existing
endpoint behavior and return the implementation for review.
```

## Implementer summary

```text
Moved the attendee-count check into a helper function at the bottom of
backend/app/main.py. Kept the duration calculation in the endpoint because it
needs the loaded game-night data. Added one API test for an empty game night.
The route still returns a dictionary because the frontend already consumes it.
```

## Reviewer findings

```text
Severity: High
Requirement: Business rules live in backend/app/services/ and must be testable
without FastAPI, HTTP, or a database session.
Evidence: backend/app/main.py still contains duration evaluation and the helper
remains coupled to route-level models.
Recommendation: Move all readiness rules to a pure service module with typed
input and output.

Severity: Medium
Requirement: API responses use declared Pydantic response models.
Evidence: The route still returns an ad-hoc dictionary.
Recommendation: Add response schemas and declare the endpoint response model.

Severity: Medium
Requirement: New behavior requires focused automated tests.
Evidence: The test covers only the empty state, not player count, duration, or
combined findings.
Recommendation: Add focused service tests for each rule and precedence.
```
