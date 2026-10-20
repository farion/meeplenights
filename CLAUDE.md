# Meeple Night development guidance

## Product boundary

Meeple Night is a local game-night planner. Runtime behavior must remain deterministic: do not introduce an LLM, an AI API, or an external service as a dependency for planning logic.

## Before changing code

1. Read the relevant OpenSpec change and its `tasks.md`.
2. Ask for clarification when product behavior is ambiguous.
3. Keep domain rules in the backend, separately testable from HTTP and React.

## Engineering conventions

- Backend: FastAPI routes should remain thin; put business rules in service modules.
- Frontend: use TypeScript types for API payloads and keep API calls in `src/api.ts`.
- Keep TableArchive calls isolated from core planning behavior and persist selected games locally in SQLite.
- Add tests for changed backend behavior when a test framework has been introduced.
- The Backpressure workshop exercise asks participants to introduce scoped quality gates. Do not assume a hook, linter, or test runner is configured in the starting project.

## Do not

- Mark tasks complete if their acceptance criteria are not verified.
- Silently choose behavior when a specification is contradictory.
- Turn soft scoring preferences into hard exclusions unless the spec says so.
