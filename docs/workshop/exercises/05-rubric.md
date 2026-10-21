# Exercise 5: Rubric-Based Review

## Feature under review

Review the **Game Night Readiness** change implemented in Exercise 4:

- the pure backend readiness service,
- `GET /api/game-nights/{id}/readiness`, and
- the Readiness card in the game-night detail UI.

The review focus is not general code style. It is whether the implementation truthfully reports a game night's readiness without changing existing candidate-game planning behavior.

## Task

Create `.claude/rubrics/code-review.md`. For every review criterion, include:

- a short name and intent;
- observable anchors for behavior that meets and misses the criterion; and
- a decision rule that maps a miss to `blocking`, `should-fix`, or `nit`.

Then update the roles created in Exercise 4: only the Reviewer may read `.claude/rubrics/**`. The Planner, Implementer, Merger, and Orchestrator must not receive the rubric contents.

Run the Reviewer against the copied OpenSpec change and the rubric. Formulate the review task yourselves. The Reviewer must not change application code.

Record the review in `docs/workshop/readiness-review.md`. It must begin with a `PASS` or `FAIL` decision: `FAIL` while a blocking finding remains; otherwise `PASS`. Include only findings, not a list of passed criteria or a reproduction of the rubric. Each finding must contain:

```text
ID: <stable finding ID>
Severity: blocking | should-fix | nit
Reference: <OpenSpec requirement or review criterion>
Evidence: <file, behavior, or test>
Recommendation: <specific next action>
Disposition: advisory | fixed | annotated
```

## Stretch Goal: Rubric Calibration

Run two independent Reviewer sessions against the same implementation and rubric. Compare their finding IDs, severity assignments, and dispositions without exposing the rubric to other roles.

Document meaningful differences, then refine the rubric's observable anchors or decision rules. Run the review again and show that the results are more consistent.