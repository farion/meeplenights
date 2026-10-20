# Exercise 6: Evaluate Agent Alignment

**Duration:** 40 minutes

## Goal

Use fictional session logs to find a mismatch in the multi-agent harness: the Reviewer evaluates coding guidelines that the Implementer never receives. The outcome to evaluate is avoidable review churn, not the correctness of an individual implementation.

## Material

Read the agent definitions and coding guidelines in [`workshop-assets/agent-alignment-eval/`](../../../workshop-assets/agent-alignment-eval/) and the three review cycles in its `sessions/` directory.

## Task

Create `evals/agent-alignment/` containing:

```text
grader.md       # measurable compatibility criteria
scorecard.md    # findings and score for runs 01–03
```

### 1. Define the task, outcome, and graders

Record these definitions in `grader.md`:

- **Task:** implement and review the Game Night Readiness change.
- **Desired outcome:** the Implementer satisfies known coding expectations before review, so a Reviewer does not repeatedly report the same preventable finding.
- **Evaluation target:** compatibility of agent contexts and handoffs, not the personality or intelligence of either agent.

Define at least these graders:

| Grader | Pass condition |
| --- | --- |
| Guideline visibility | Every blocking guideline used by the Reviewer is visible to the Implementer before its first code change. |
| Repeated-finding rate | A guideline finding may appear once for an existing change, but must not recur in a later review without a newly introduced violation. |
| Review-cycle count | A normal change with no new product decisions reaches an approval-ready review in at most two cycles. |
| Evidence quality | A Reviewer finding identifies the guideline, concrete source evidence, and a fix. |

### 2. Grade the logs

For each of `sessions/run-01.md`, `sessions/run-02.md`, and `sessions/run-03.md`, record:

- coding guidelines visible to the Implementer and Reviewer;
- repeated finding categories;
- number of review cycles so far;
- pass/fail for every grader;
- a short evidence quote with file and section.

### 3. State the evaluation result

The expected conclusion must be evidence-based:

```text
The agents are misaligned. The Reviewer repeatedly enforces service isolation
and response-schema rules that are absent from the Implementer context. The
repeated findings are a harness design failure, not evidence that repeated
review alone will improve the system.
```

## Outcome

An eval that detects incompatible agent instructions through observable review churn and missing shared context.
