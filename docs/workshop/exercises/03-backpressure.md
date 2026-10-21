# Exercise 3: Backpressure — Quality Gate

**Duration:** 35 minutes

## Starting point

The repository deliberately has **no** test runner, linter, or Claude Code hook. Your team must introduce all three. You may use `pytest`, Ruff, and ESLint, but selecting equivalent tools is acceptable if you document the choice.

## Required behavior

- Backend changes can be checked with a Python linter and automated tests.
- Frontend changes can be checked with a TypeScript/React linter and a production build.
- A project-level Claude Code `Stop` hook runs the configured quality suite after source changes. It must exit with code `2` when a check fails, so Claude Code continues with the failure feedback instead of ending the turn.

## Task

1. Add a backend test framework and write at least two API tests for an existing core flow: create a game night, then add an attendee or game.
2. Add a Python linter and a frontend TypeScript/React linter. Add package scripts or documented commands for them.
3. Create a project-level Claude Code `Stop` hook that runs the configured quality suite after source changes.
4. Store a successful source fingerprint outside version control. If relevant source files have not changed since the last successful run, skip the suite.
5. Introduce a deliberate backend lint or test failure. Confirm that the Stop hook blocks completion.
6. Fix the failure and confirm that the hook records a passing result.

## Definition of done

- At least two API tests cover an existing backend flow.
- Backend linting and tests have documented commands.
- Frontend linting and a production build have documented commands.
- A failing quality check prevents a Claude Code turn from completing.
- An unchanged follow-up turn does not rerun the suite.
- Generated hook state is ignored by Git.

## Stretch Goal: Scoped Quality Gates

Extend the required quality gate so it selects only the checks relevant to changed paths instead of running the complete suite every time.

| Changed area | Required checks |
| --- | --- |
| `backend/` Python, dependencies, or test configuration | `ruff check .` and `python -m pytest` from `backend/` |
| `frontend/src/` or frontend build/lint configuration | `npm run lint` and `npm run build` from `frontend/` |
| Docs, OpenSpec, eval fixtures, or agent instructions only | No quality suite |

1. Update the `Stop` hook to use the decision table.
2. Change only backend code and confirm that only backend linting and tests run.
3. Change only frontend code and confirm that only frontend linting and the build run.
4. Submit a documentation-only prompt. Confirm that no test suite runs.
5. Extend the hook with one new relevant input path, such as a future `shared/` package, and add it to the decision table.

### Stretch definition of done

- A passing backend change runs backend linting and tests.
- A passing frontend change runs frontend linting and a TypeScript/build check.
- Docs-only changes run no quality suite.

## Debrief

- Why must a failing quality gate return a blocking code rather than merely print feedback?
- Which checks are cheap enough for every source-changing turn?
- When should a full integration or end-to-end suite run instead?
