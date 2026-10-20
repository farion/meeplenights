# Exercise 4: Multi-Agent Handoff

**Duration:** 35 minutes

## Scenario

Use the prepared **Game Night Readiness** scenario in [`workshop-assets/multi-agent-readiness/`](../../../workshop-assets/multi-agent-readiness/). Copy its isolated OpenSpec change into `openspec/changes/` only when this exercise starts.

## Task

Use Planner, Implementer, Reviewer, and Orchestrator to deliver the change.

1. The Planner publishes the endpoint contract and dependency-ordered task plan.
2. The Orchestrator gives the approved contract to both implementation tracks.
3. Backend and frontend implementation may proceed in parallel only after the contract is approved.
4. Before implementation, create `.claude/rubrics/code-review.md` with a minimal shared review baseline: contract compliance, deterministic domain rules, verification evidence, and no unrelated changes.
5. The Reviewer checks the result against the copied spec and that rubric.
6. The Orchestrator classifies findings as blocking or advisory and does not complete the change while blocking findings remain.

Use the handoff prompts and expected artifacts in `workshop-assets/multi-agent-readiness/README.md`.

## Outcome

An implemented change with visible role boundaries, explicit contracts, and review evidence.
