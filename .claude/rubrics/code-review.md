# Code review rubric

## Functional correctness

- Does every recommended game support the confirmed player count?
- Are excluded categories hard constraints rather than score penalties?
- Is an impossible plan represented explicitly?

## Specification compliance

- Does each acceptance criterion have code or automated-test evidence?
- Does the behavior match the approved OpenSpec artifacts?

## Maintainability

- Is game eligibility separate from scoring?
- Can business rules be tested without HTTP or React?
- Are ordering and tie-breaking deterministic?

## User communication

- Are recommendation reasons factual and specific?
- Are exclusion reasons useful without exposing irrelevant internal details?

## Finding format

```text
Severity: High | Medium | Low
Requirement: <specification or rubric rule>
Evidence: <file, behavior, or test>
Recommendation: <specific next action>
```
