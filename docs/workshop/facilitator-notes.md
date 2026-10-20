# Facilitator notes

Do not reward agents for confidently filling gaps. The strongest teams make uncertainty visible early, distinguish product decisions from engineering decisions, and prove behavior with an eval.

## Backpressure exercise

The goal is a practical feedback loop, not an artificial requirements conflict. The repository begins without tests, linters, or a hook; do not give teams a reference implementation. The Stop hook they create should be intentionally scoped: full checks on every prompt make agents slow and encourage bypasses; no automatic checks make failures easy to hide. Ask teams to explain the changed-file fingerprint and why it is written only after all selected checks pass.

## Mid-workshop change request

Introduce this only after the first spec draft:

```text
A host may manually include a game that one player excludes, but the UI
must show a warning and require confirmation.
```

Ask teams which specifications, tasks, tests, and evals change. This exposes the difference between a hard recommendation constraint and a deliberate host override.

## Debrief prompts

- What evidence made an agent safe to trust?
- Which review feedback was advisory rather than blocking?
- Which evaluator would catch a plausible but wrong implementation?
- What belongs in the product spec versus the review rubric?
