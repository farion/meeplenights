# Exercise 2: Spec Driven Delivery

**Duration:** 2 hours 45 minutes

## Goal

Turn an intentionally vague product intent into a tested first implementation slice using a requirements interview, OpenSpec, and the Implementer agent.

## Starting intent

```text
I want Meeple Night to help me choose games for my game night.
It should consider who is coming and how much time we have.
```

Do not design a solution before the requirements interview.

## Product idea in one example

The app already lets a host create a game night, attach attendees, and add candidate games. The new feature answers: **"Given this group and this amount of time, what should we play?"**

For example, a host has four confirmed attendees, 180 available minutes, and candidate games Azul, Cascadia, Wingspan, and Betrayal at House on the Hill. One attendee excludes Horror and the group prefers medium-complexity strategy games.

The feature could return:

```text
Primary plan: Cascadia + Azul — 90 minutes
Why: both games support four players, fit the time budget, and match the
group's preferred categories and complexity.

Not recommended: Betrayal at House on the Hill
Why: Horror is excluded by a confirmed attendee.
```

The requirements interview decides the actual rules: what counts as confirmed, whether multiple games form a plan, how preferences are recorded, and what happens when no candidate game fits. The implementation must use explicit local rules, not an AI model at runtime.

## Part A: Grill Me

Give Claude Code this prompt:

```text
Interview me as a product manager for the Smart Game Night Plan feature.
Ask one question at a time. Prioritize questions that materially affect
product behavior, acceptance criteria, edge cases, or data requirements.
Do not propose a solution until you have enough information.
Summarize confirmed decisions and unresolved questions at the end.
```

The facilitator reveals decisions only when asked relevant questions:

- Only confirmed attendees count.
- A plan may use at most 90% of available time.
- A game must support all confirmed attendees.
- Preferred categories improve a game score.
- One excluded category disqualifies a game.
- Prefer games at or below the group's average comfort level.
- Return one primary plan and up to two alternatives.
- Explain both recommendations and exclusions.
- When there is no valid plan, explain why and suggest a correction.

Save the result in `docs/workshop/interview-summary.md`.

## Part B: Story and Tickets

Turn the interview into one user story with:

- scope and non-goals,
- Given/When/Then acceptance criteria,
- unresolved questions,
- independently reviewable implementation tasks.

Every task needs a purpose, affected area, dependencies, definition of done, and verification method. Avoid the anti-pattern `Implement Smart Game Night Plan` as one task.

## Part C: OpenSpec

Use `openspec/changes/smart-game-night-plan/` to capture the approved change. Complete or improve:

- `proposal.md`
- `design.md`
- `tasks.md`
- `specs/game-night-planning/spec.md`

Do not begin implementation while product questions remain hidden or tasks cannot be verified.

## Part D: Implement

Use the Implementer agent:

```text
Implement only approved tasks from the Smart Game Night Plan OpenSpec change.
Keep business rules testable outside HTTP and React.
Stop and report ambiguities instead of inventing product behavior.
Complete one task at a time, verify it, then update tasks.md.
```

## Outcome

An interview record, implementation-ready OpenSpec change, granular task plan, and a first verified implementation slice.
