# Exercise 5: Rubric-Based Review

**Duration:** 30 minutes

## Feature under review

Review the **Game Night Readiness** change implemented in Exercise 4:

- the pure backend readiness service,
- `GET /api/game-nights/{id}/readiness`, and
- the Readiness card in the game-night detail UI.

The review focus is not general code style. It is whether the implementation truthfully reports a game night's readiness without changing existing manual-planning behavior.

## Task

Extend `.claude/rubrics/code-review.md` with these concrete checks:

1. **Complete findings and precedence:** If a game night has no attendees and a manually selected game requiring at least two players, the result is `blocked` and contains both `no_attendees` and `selected_game_player_count`.
2. **Selected games only:** An unsuitable candidate game that is *not* manually selected must not produce a manual-selection warning.
3. **Duration rule:** The duration warning uses only manually selected games and is emitted when their total exceeds `available_minutes`.
4. **Domain isolation:** The readiness evaluator can be tested without FastAPI, a database session, or React.
5. **Non-destructive UI:** The Readiness card refreshes after a relevant successful update and never disables manual-planning controls.

Then ask the Reviewer agent:

```text
Review the Game Night Readiness implementation against the copied OpenSpec
change and the added rubric checks. Verify the five named cases with source
evidence and tests where available. Report both failed and passed checks.
Do not change code.
```

Each finding must use this format:

```text
Severity: High | Medium | Low
Requirement: <specification or rubric rule>
Evidence: <file, behavior, or test>
Recommendation: <specific next action>
```

Record the review in `docs/workshop/readiness-review.md`.

## Optional adversarial seed

If the implementation is fully correct and produces no meaningful finding, ask the Implementer to create a small temporary faulty patch: return immediately after the first blocked finding. The Reviewer should identify that this hides otherwise applicable warnings. Revert the temporary patch after the review.

## Outcome

Actionable advisory feedback for one concrete feature, tied to requirements and evidence rather than general opinions.
