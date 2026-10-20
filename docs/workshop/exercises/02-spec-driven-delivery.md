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

The current TableArchive integration reliably provides player counts and duration, but not categories or complexity. Treat category and comfort data as a product-data decision: the interview and design must state whether it is stored locally, manually curated, or excluded from the first slice.

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

## Part B: Build a Story-Shaping Skill

Build a project skill at `.claude/skills/story-shaping/SKILL.md`. The skill must turn a requirements-interview summary into one implementation-ready user story and a set of independently reviewable tickets.

Give the skill clear inputs, outputs, and constraints. It must:

- use only confirmed interview decisions;
- preserve unresolved questions instead of inventing answers;
- distinguish product requirements from implementation choices; and
- require observable acceptance criteria and verification for every ticket.

Run the skill against `docs/workshop/interview-summary.md`. Save its result in `docs/workshop/smart-game-night-story.md`.

The generated story must include:

- scope and non-goals,
- Given/When/Then acceptance criteria,
- unresolved questions,
- independently reviewable implementation tasks.

Every ticket needs a purpose, affected area, dependencies, definition of done, and verification method. Avoid the anti-pattern `Implement Smart Game Night Plan` as one ticket.

## Part C (Stretch Goal, optional): OpenSpec

Use `openspec/changes/smart-game-night-plan/` to capture the approved change. The prepared artifacts are a facilitator reference, not requirements to copy blindly. Reconcile them with the recorded interview before completing or improving:

- `proposal.md`
- `design.md`
- `tasks.md`
- `specs/game-night-planning/spec.md`

Do not begin implementation while product questions remain hidden or tasks cannot be verified.

## Part D: Implement

Use your configured Implementer agent or role prompt:

```text
Implement only approved tickets from `docs/workshop/smart-game-night-story.md`.
If the optional OpenSpec change exists, keep the implementation aligned with it.
Keep business rules testable outside HTTP and React.
Stop and report ambiguities instead of inventing product behavior.
Complete one ticket at a time, verify it, then update the story file and, if present, `tasks.md`.
```

## Outcome

An interview record, a reusable story-shaping skill, and a granular task plan. Teams completing the stretch goal also produce an implementation-ready OpenSpec change and a first verified implementation slice.
