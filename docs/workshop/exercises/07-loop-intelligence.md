# Exercise 7: Loop Intelligence

**Duration:** 20 minutes

## Task

Use the failed Agent Alignment eval from Exercise 6 as input to a local improvement loop.

1. Classify the repeated Reviewer findings as a **harness context mismatch**, not as three independent implementation defects.
2. Propose the smallest change that gives the Implementer the same blocking coding expectations as the Reviewer. For example: extract shared rules into a repository instruction file, reference it in both agents, and add an Implementer pre-review checklist.
3. Update a copy of the Implementer context in `evals/agent-alignment/proposed-implementer-context.md`.
4. Define a fourth, post-improvement simulated run. It must show the Implementer acknowledging the shared rules before coding and the Reviewer no longer repeating service-isolation or response-schema findings.
5. Regrade runs 01–03 and the proposed run 04 with the Exercise 6 graders. Record whether repeated-finding rate and review-cycle count improve.
6. Require human approval before applying the proposed context change to the configured Implementer agent file (for example `.claude/agents/implementer.md`) or shared repository guidance.

## Outcome

A measured harness improvement: the team changes agent context based on eval evidence, then verifies that the specific failure mode no longer recurs.
