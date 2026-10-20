# Agent Alignment Eval Scenario

This scenario contains fictional but realistic Claude Code session logs. It is used in Exercise 6 to evaluate whether an Implementer and Reviewer have compatible instructions.

The Implementer receives only a feature task. The Reviewer receives the same task plus coding guidelines. Across the logs, the Reviewer repeatedly reports violations that the Implementer was never instructed to avoid.

Do not use the logs to judge whether either agent is "good" or "bad". The evaluated system is the harness: prompts, shared context, handoffs, and quality gates.

## Files

- `agents/` shows the intentionally mismatched agent context.
- `sessions/` contains three consecutive review cycles for the same change.
- `coding-guidelines.md` is available to the Reviewer but not the Implementer.
