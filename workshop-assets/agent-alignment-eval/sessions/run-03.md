# Run 03: Revision and review

## Implementer input

```text
Address the Reviewer findings for Game Night Readiness. Keep the existing
endpoint behavior and return the implementation for review.
```

## Implementer summary

```text
Added more conditions to the endpoint for selected games and total duration.
Added endpoint tests for an invalid selected game and for duration. The route
now has all readiness behavior in one place, which should make it easier to
maintain.
```

## Reviewer findings

```text
Severity: High
Requirement: Business rules live in backend/app/services/ and must be testable
without FastAPI, HTTP, or a database session.
Evidence: All readiness rules remain in backend/app/main.py. The endpoint tests
exercise HTTP rather than a pure evaluator.
Recommendation: Extract a pure service before adding more endpoint conditions.

Severity: Medium
Requirement: API responses use declared Pydantic response models.
Evidence: The endpoint response is still an ad-hoc dictionary.
Recommendation: Add explicit response schemas.
```
