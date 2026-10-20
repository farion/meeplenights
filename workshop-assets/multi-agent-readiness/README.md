# Multi-agent scenario: Game Night Readiness

This is a self-contained, implementation-ready OpenSpec change for the multi-agent exercise. It is deliberately stored outside `openspec/changes/` so it does not affect the earlier Spec Driven Development exercise.

## Setup

At the start of the multi-agent block, copy the prepared change into the active OpenSpec workspace:

```bash
cp -R workshop-assets/multi-agent-readiness/openspec/changes/game-night-readiness \
  openspec/changes/
```

## Intent

```text
As a host, I want to see whether my game night is ready,
so that I can resolve missing or invalid planning data before inviting people.
```

## Suggested orchestration prompt

```text
Deliver the approved `game-night-readiness` OpenSpec change using the
Planner, Implementer, Reviewer, and Orchestrator agents.

The Planner must publish the API contract before implementation starts.
Backend and frontend work may proceed in parallel only after that contract
is approved. The Reviewer must evaluate the result against the copied spec
and the code-review rubric. Do not mark the change complete until all
selected quality checks pass.
```

## Expected handoffs

1. **Planner → all roles:** confirmed API response shape and dependency-ordered tasks.
2. **Backend Implementer → Frontend Implementer:** endpoint and response contract, including empty `checks` behavior.
3. **Implementers → Reviewer:** changed files, verification evidence, and intentionally unimplemented items.
4. **Reviewer → Orchestrator:** findings classified as blocking or advisory.
5. **Orchestrator → team:** final completion decision with evidence.
