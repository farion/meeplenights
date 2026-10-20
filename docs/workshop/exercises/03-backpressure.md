# Exercise 3: Backpressure — Scoped Quality Gate

**Duration:** 35 minutes

## Starting point

The repository deliberately has **no** test runner, linter, or Claude Code hook. Your team must introduce all three. You may use `pytest`, Ruff, and ESLint, but selecting equivalent tools is acceptable if you document the choice.

## Required behavior

| Changed area | Required checks |
| --- | --- |
| `backend/` Python, dependencies, or test configuration | `ruff check .` and `python -m pytest` from `backend/` |
| `frontend/src/` or frontend build/lint configuration | `npm run lint` and `npm run build` from `frontend/` |
| Docs, OpenSpec, eval fixtures, or agent instructions only | No quality suite |

Use a project-level Claude Code `Stop` hook. It must exit with code `2` when a required check fails, so Claude Code continues with the failure feedback instead of ending the turn.

## Task

1. Add a backend test framework and write at least two API tests for an existing core flow: create a game night, then add an attendee or game.
2. Add a Python linter and a frontend TypeScript/React linter. Add package scripts or documented commands for them.
3. Create a project-level Claude Code `Stop` hook that chooses checks by changed path.
4. Store a successful source fingerprint outside version control. If relevant source files have not changed since the last successful run, skip the suite.
5. Introduce a deliberate backend lint or test failure. Confirm that the Stop hook blocks completion.
6. Fix the failure and confirm that the hook records a passing result.
7. Submit a documentation-only prompt. Confirm that no test suite runs.
8. Extend the hook with one new relevant input path, such as a future `shared/` package, and add it to the decision table.

## Definition of done

- A failing selected check prevents a Claude Code turn from completing.
- A passing backend change runs backend linting and tests.
- A passing frontend change runs frontend linting and a TypeScript/build check.
- Docs-only changes run no quality suite.
- An unchanged follow-up turn does not rerun the suite.
- Generated hook state is ignored by Git.

## Debrief

- Why must a failing quality gate return a blocking code rather than merely print feedback?
- Which checks are cheap enough for every source-changing turn?
- When should a full integration or end-to-end suite run instead?
