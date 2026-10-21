# Exercise 7: Loop Intelligence

**Duration:** 20 minutes

## Task

Use the Exercise 6 scorecard as input to a local improvement loop.

1. Identify the highest-impact failed or `should-fix` grader. Use the scorecard evidence to explain whether its cause is in agent context, a handoff, a quality gate, or another part of the harness.
2. Propose the smallest harness change that addresses that cause. Record the hypothesis, affected harness component, expected effect, and possible regression in `evals/agent-alignment/proposed-harness-change.md`.
3. Define a representative fourth, post-change simulated run. Keep the product task comparable to the earlier runs and change only the proposed harness element.
4. Grade the proposed run with the same Exercise 6 graders. Compare the affected grader results with runs 01–03 and record both improvement and regressions.
5. Require human approval before applying the proposed change to configured agent definitions, shared repository guidance, or quality gates.

## Outcome

A measured, reversible harness-improvement proposal: a team derives a minimal change from eval evidence, verifies its intended effect and regressions, then obtains human approval before applying it.
