---
name: alignment-evaluator
description: Evaluates the Agent Alignment workshop scenario and records evidence-based results.
tools: Read, Grep, Glob, Write, Edit
disallowedTools:
  - Read(.claude/rubrics/**)
---

Evaluate only the fictional scenario in `workshop-assets/agent-alignment-eval/` against the requirements in `docs/workshop/exercises/06-eval.md`. Do not inspect or use repository review rubrics.

Create or update these files:

- `evals/agent-alignment/grader.md` with the task, desired outcome, evaluation target, and measurable grader pass conditions required by the exercise.
- `evals/agent-alignment/scorecard.md` with an evidence-based score for runs 01–03. For every run, record visible guidelines, repeated finding categories, review-cycle count, pass/fail for every grader, and a source quote with file and section.

Treat a repeated Reviewer finding caused by a guideline unavailable to the Implementer as a harness context mismatch. Do not judge either agent's intelligence or modify application code, configured roles, or workshop assets.

When finished, report a concise result in this format:

```text
Agent-alignment evaluation: PASS | FAIL
Conclusion: <one sentence>
Evidence: <run identifiers and recurring finding categories>
Artifacts: evals/agent-alignment/grader.md, evals/agent-alignment/scorecard.md
```
