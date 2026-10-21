# Exercise 4: Multi-Agent Handoff

**Duration:** 35 minutes

## Scenario

Use the prepared **Game Night Readiness** scenario in [`workshop-assets/multi-agent-readiness/`](../../../workshop-assets/multi-agent-readiness/). Copy its isolated OpenSpec change into `openspec/changes/` only when this exercise starts.

## Task

Create five Claude Code agent definitions in `.claude/agents/`: Planner, Implementer, Merger, Reviewer, and Orchestrator. Define the instructions, available tools, delegation permissions, and handoffs yourselves. Keep the roles small and separate.

Your team design must cover planning, implementation, integration, review, and a completion decision. Decide which agent may delegate work and which handoffs must be written down.

### Run and verify the roles

Copy the scenario, then start your coordinating agent:

```bash
cp -R workshop-assets/multi-agent-readiness/openspec/changes/game-night-readiness \
  openspec/changes/
claude --agent <coordinator-name>
```

Ask it to deliver the copied change with the team you configured. Design the orchestration prompt yourselves.

Demonstrate that the configured team produces visible handoffs and that it does not declare the change complete while unresolved blocking findings remain. If a role does not behave as intended, start it directly with `claude --agent <role-name>`, refine its definition, and run the workflow again.

Use the scenario directory only for its product intent and OpenSpec change; do not treat it as a reference implementation for the agent team.

## Stretch Goal: Enforced Handoffs

Define a compact handoff protocol that every role must use. It must record at least the sender, recipient, status, changed files, decisions or contract, verification evidence, and open risks.

Configure the coordinating agent to reject incomplete handoffs. A role may not begin dependent work until it receives a complete handoff, and the integration role must escalate contradictory contracts or missing verification evidence instead of guessing.

## Outcome

An implemented change with visible role boundaries, explicit contracts, and review evidence.
