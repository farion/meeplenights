# Exercise 4: Multi-Agent Handoff

## Scenario

Use the prepared **Game Night Readiness** scenario in [`workshop-assets/multi-agent-readiness/`](../../../workshop-assets/multi-agent-readiness/). Copy its isolated OpenSpec change into `openspec/changes/` only when this exercise starts.

## Task

Create five Claude Code agent definitions in `.claude/agents/`: Planner, Implementer, Merger, Reviewer, and Orchestrator. Define the instructions, available tools, delegation permissions, and handoffs yourselves. Keep the roles small and separate.

### Run and verify the roles

Copy the scenario, then start your coordinating agent. Save its definition as `.claude/agents/orchestrator.md`; Claude Code addresses the agent by this filename (without `.md`). Run the command from the repository root:

```bash
cp -R workshop-assets/multi-agent-readiness/openspec/changes/game-night-readiness \
  openspec/changes/
```

Implement the feature using your orchestrator.

```
claude --agent orchestrator
```

## Stretch Goal: Enforced Handoffs

Define a compact handoff protocol that every role must use. It must record at least the sender, recipient, status, changed files, decisions or contract, verification evidence, and open risks.

Configure the coordinating agent to reject incomplete handoffs. A role may not begin dependent work until it receives a complete handoff, and the integration role must escalate contradictory contracts or missing verification evidence instead of guessing.
