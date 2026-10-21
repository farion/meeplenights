# Exercise 5: Rubric-Based Review

**Duration:** 30 minutes

## Feature under review

Review the **Game Night Readiness** change implemented in Exercise 4:

- the pure backend readiness service,
- `GET /api/game-nights/{id}/readiness`, and
- the Readiness card in the game-night detail UI.

The review focus is not general code style. It is whether the implementation truthfully reports a game night's readiness without changing existing candidate-game planning behavior.

## Task

Create `.claude/rubrics/code-review.md`. For every review dimension, include:

- a short name and intent;
- observable anchors for behavior that meets and misses the dimension; and
- a decision rule that maps a miss to `blocking`, `should-fix`, or `nit`.

Cover these dimensions:

1. **Complete findings and precedence:** A game night with no attendees and a manually selected game requiring at least two players is `blocked` and reports both `no_attendees` and `selected_game_player_count`.
2. **Selected games only:** An unsuitable candidate game that is *not* manually selected does not produce a manual-selection warning.
3. **Duration rule:** The duration warning considers only manually selected games and is emitted when their total exceeds `available_minutes`.
4. **Domain isolation:** The readiness evaluator is testable without FastAPI, a database session, or React.
5. **Non-destructive UI:** The Readiness card refreshes after a relevant successful update and never disables attendee or candidate-game controls.

Then update the roles created in Exercise 4: only the Reviewer may read `.claude/rubrics/**`. The Planner, Implementer, Merger, and Orchestrator must not receive the rubric contents.

The starter API already persists `manually_selected` on an attached game through `PUT /api/game-nights/{night_id}/games/{game_id}/selection`. The current UI intentionally does not expose a selection checkbox, so use an API fixture or direct setup when verifying the selected-game cases.

Run the Reviewer against the copied OpenSpec change and the rubric. Formulate the review task yourselves. The Reviewer must not change application code.

Record the review in `docs/workshop/readiness-review.md`. It must begin with a `PASS` or `FAIL` decision: `FAIL` while a blocking finding remains; otherwise `PASS`. Include only findings, not a list of passed dimensions or a reproduction of the rubric. Each finding must contain:

```text
ID: <stable finding ID>
Severity: blocking | should-fix | nit
Reference: <OpenSpec requirement or rubric dimension>
Evidence: <file, behavior, or test>
Recommendation: <specific next action>
Disposition: advisory | fixed | annotated
```

The Reviewer initially records findings as `advisory`. The team changes the disposition to `fixed` after verification or `annotated` when it deliberately accepts a finding and records why. Do not copy rubric contents into handoffs or the final review report.

## Optional adversarial seed

If the implementation is fully correct and produces no meaningful finding, introduce a small temporary faulty patch that returns immediately after the first blocked finding. The Reviewer should identify that this hides otherwise applicable warnings. Revert the temporary patch after the review.

## Stretch Goal: Rubric Calibration

Run two independent Reviewer sessions against the same implementation and rubric. Compare their finding IDs, severity assignments, and dispositions without exposing the rubric to other roles.

Document meaningful differences, then refine the rubric's observable anchors or decision rules. Run the review again and show that the results are more consistent.

## Outcome

Actionable, rubric-grounded advisory feedback for one concrete feature, tied to requirements and evidence rather than general opinions.
