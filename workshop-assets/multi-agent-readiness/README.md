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

## Delivery

This directory provides the scenario and its OpenSpec change only. Design the
agent roles, their instructions, their handoffs, and the orchestration prompt
in Exercise 4.
