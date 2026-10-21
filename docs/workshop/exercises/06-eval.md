# Exercise 6: Evaluate Agent Alignment

## Goal

Use fictional session logs to find a mismatch in the multi-agent harness: the Reviewer evaluates coding guidelines that the Implementer never receives. The outcome to evaluate is avoidable review churn, not the correctness of an individual implementation.

## Material

Read the agent definitions and coding guidelines in [`workshop-assets/agent-alignment-eval/`](../../../workshop-assets/agent-alignment-eval/) and the three review cycles in its `sessions/` directory.

## Task

Run the dedicated evaluator from the repository root:

```bash
claude --agent alignment-evaluator
```

Give the evaluator a task that directs it to assess the complete scenario and create the required artifacts. Formulate that task yourselves.

The evaluator must create `evals/agent-alignment/` containing:

```text
grader.md       # measurable compatibility criteria
scorecard.md    # findings and score for runs 01–03
```

It must also return an `Agent-alignment evaluation: PASS | FAIL` result with
the conclusion, supporting run evidence, and artifact paths. Review the
generated files before accepting the result.

### 1. Define the task, outcome, and graders

Record these definitions in `grader.md`:

- **Task:** implement and review the Game Night Readiness change.
- **Desired outcome:** the Implementer satisfies known coding expectations before review, so a Reviewer does not repeatedly report the same preventable finding.
- **Evaluation target:** compatibility of agent contexts and handoffs, not the personality or intelligence of either agent.

The final result is `FAIL` if any blocking grader fails; otherwise it is `PASS`. Record failed `should-fix` graders in the scorecard even when the final result is `PASS`.

### 2. Grade the logs

For each of `sessions/run-01.md`, `sessions/run-02.md`, and `sessions/run-03.md`, record:

- coding guidelines visible to the Implementer and Reviewer;
- repeated finding categories;
- number of review cycles so far;
- pass/fail for every grader;
- a short evidence quote with file and section.

### 3. State the evaluation result

Draw the conclusion from the grader results and log evidence. Attribute repeated findings to the agent harness only when the logs show that the relevant expectation was unavailable to the Implementer.