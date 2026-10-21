# Exercise 2: Story-Driven Delivery

**Duration:** 2 hours 45 minutes

## Goal

Turn an intentionally vague product intent into a fully implemented, tested feature using a requirements interview, a set of user stories, and standard Claude Code. OpenSpec is an optional second delivery run after the story-driven implementation is complete.

## Starting intent

```text
I want Meeple Night to help me choose games for my game night.
It should consider who is coming and how much time we have.
```

Do not design a solution before the requirements interview.

## Product idea in one example

The app already lets a host create a game night, attach attendees, and add candidate games. The new feature answers: **"Given this group and this amount of time, what should we play?"**

For example, a host has four confirmed attendees, 180 available minutes, and candidate games Azul, Cascadia, Wingspan, and Betrayal at House on the Hill. One attendee excludes Horror and the group prefers medium-complexity strategy games.

The current TableArchive integration reliably provides player counts and duration, but not categories or complexity. Treat category and comfort data as a product-data decision: the interview and design must state whether it is stored locally, manually curated, or excluded from the initial delivery.

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

## Part B: Build Story-Shaping Skills

Build two project skills:

- `.claude/skills/to-story/SKILL.md` turns the requirements-interview summary into one implementation-ready user story.
- `.claude/skills/to-ticket/SKILL.md` turns the approved story into independently reviewable implementation tickets.

Give both skills clear inputs, outputs, and constraints. Together, they must:

- use only confirmed interview decisions;
- preserve unresolved questions instead of inventing answers;
- distinguish product requirements from implementation choices; and
- require observable acceptance criteria and verification for every ticket.

Run `to-story` against `docs/workshop/interview-summary.md`. Save its result in `docs/workshop/smart-game-night-story.md`.

The generated story must include:

- scope and non-goals,
- Given/When/Then acceptance criteria,
- unresolved questions.

Run `to-ticket` against the approved story. Save its result in `docs/workshop/smart-game-night-tickets.md`.

Every ticket needs a purpose, affected area, dependencies, definition of done, and verification method. Avoid the anti-pattern `Implement Smart Game Night Plan` as one ticket.

## Part C: Deliver the Complete Story Plan

Implement every approved ticket in `docs/workshop/smart-game-night-tickets.md`. The story and its acceptance criteria, together with the approved tickets, are the source of truth for this primary delivery run; do not use the prepared OpenSpec change as implementation instructions.

Continue in the same standard Claude Code session. Do not configure or invoke an Implementer role; multi-agent roles are introduced in a later exercise. Give Claude Code this prompt:

```text
Implement every approved ticket from `docs/workshop/smart-game-night-tickets.md`.
Use `docs/workshop/smart-game-night-story.md` and its acceptance criteria with
the approved tickets as the source of truth for this delivery.
Keep business rules testable outside HTTP and React.
Stop and report ambiguities instead of inventing product behavior.
Complete, verify, and mark every ticket before declaring the feature complete.
```

For each ticket, record the completed work and verification evidence in the tickets file. The primary run is complete only when all approved tickets are implemented and their acceptance criteria are verified.

## Part D (Stretch Goal, optional): Repeat the Delivery with OpenSpec

Repeat the same feature delivery in a clean worktree or fresh clone, this time using OpenSpec as the source of truth. Do not reuse the story-driven implementation as the solution; the point is to compare the two delivery approaches.

Use the following OpenSpec workflow in a standard Claude Code session:

| Command | Purpose | What to do |
| --- | --- | --- |
| `/opsx:explore` | Explore the idea before changing artifacts or code. | Discuss the confirmed interview decisions with Claude Code, inspect the existing application, and weigh implementation options. Keep unresolved product questions visible. |
| `/opsx:propose` | Create a change folder with proposal, specs, design, and tasks. | Create a new change for this second run, reconcile it with the recorded interview, and review every generated artifact before approval. |
| `/opsx:apply` | Deliver the approved change task by task. | Implement every task, verify it, and check it off only after its acceptance criteria pass. |
| `/opsx:archive` | Merge accepted spec deltas and archive the completed change. | Run this only after the whole change is verified and accepted. |

Start each phase explicitly with its command:

```text
/opsx:explore
/opsx:propose
/opsx:apply
/opsx:archive
```

Choose a new change name, for example `smart-game-night-plan-openspec`. Leave the prepared `openspec/changes/smart-game-night-plan/` artifacts unchanged; they are facilitator reference material, not requirements to copy blindly. Once the newly proposed artifacts are reconciled with the recorded interview and approved, they become the source of truth for this delivery:

- `proposal.md`
- `design.md`
- `tasks.md`
- `specs/game-night-planning/spec.md`

Do not begin the OpenSpec implementation while product questions remain hidden or tasks cannot be verified. In the separate standard Claude Code session, use this prompt:

```text
Implement every approved task in `openspec/changes/<change-name>/tasks.md`.
Treat the approved OpenSpec artifacts as the source of truth for this delivery.
Keep business rules testable outside HTTP and React.
Stop and report ambiguities instead of inventing product behavior.
Complete and verify every task before declaring the feature complete.
```

In the separate worktree, verify the complete feature and compare the outcome, verification evidence, and planning overhead with the story-driven run.

## Outcome

An interview record, reusable `to-story` and `to-ticket` skills, and a fully implemented, verified story-driven feature. Teams completing the stretch goal also deliver the feature through OpenSpec in a separate run and compare both approaches.
