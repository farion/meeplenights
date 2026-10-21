# Exercise 2: Spec Driven Delivery

## Goal

Turn an intentionally vague product intent into a fully implemented feature using a requirements interview, a set of user storie.
Stretch Goal is to use OpenSpec.

## Starting intent

```text
I want Meeple Night to help me choose games for my game night.
It should consider who is coming and how much time we have.
```

## Product idea in one example

The app already lets a host create a game night, attach attendees, and add candidate games. The new feature answers: **"Given this group and this amount of time, what should we play?"**

For example, a host has four confirmed attendees, 180 available minutes, and candidate games Azul, Cascadia, Wingspan, and Betrayal at House on the Hill. One attendee excludes Horror.

The feature could return:

Primary plan: Cascadia + Azul — 90 minutes
Why: both games support four players, fit the time budget, and match the groups preferences.

Not recommended: Betrayal at House on the Hill
Why: Horror is excluded by a confirmed attendee.

The requirements interview decides the actual rules: what counts as confirmed, whether multiple games form a plan, how preferences are recorded, and what happens when no candidate game fits.

## Part A: Grill Me

Use /grill-me to define the feature.

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

- `.claude/skills/to-story/SKILL.md` describing the feature.
- `.claude/skills/to-ticket/SKILL.md` vertical slices for a story.

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

Every ticket needs a purpose, affected area, dependencies, definition of done, and verification method. 

## Part C: Deliver the Complete Story Plan

Implement every approved ticket in `docs/workshop/smart-game-night-tickets.md`. The story and its acceptance criteria, together with the approved tickets, are the source of truth for this primary delivery run; do not use the prepared OpenSpec change as implementation instructions.

For each ticket, record the completed work and verification evidence in the tickets file. The primary run is complete only when all approved tickets are implemented and their acceptance criteria are verified.

## Part D (Stretch Goal, optional): Repeat the Delivery with OpenSpec

Repeat the same feature delivery in a clean worktree or fresh clone, this time using OpenSpec as the source of truth. Do not reuse the story-driven implementation as the solution; the point is to compare the two delivery approaches.

Install skills and cli by asking your agent:
```
Fetch https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/install.md and follow it.
```

Use the following OpenSpec workflow in a standard Claude Code session:

| Command | Purpose | What to do |
| --- | --- | --- |
| `/opsx:explore` | Explore the idea before changing artifacts or code. | Discuss the confirmed interview decisions with Claude Code, inspect the existing application, and weigh implementation options. Keep unresolved product questions visible. |
| `/opsx:propose` | Create a change folder with proposal, specs, design, and tasks. | Create a new change for this second run, reconcile it with the recorded interview, and review every generated artifact before approval. |
| `/opsx:apply` | Deliver the approved change task by task. | Implement every task, verify it, and check it off only after its acceptance criteria pass. |
| `/opsx:archive` | Merge accepted spec deltas and archive the completed change. | Run this only after the whole change is verified and accepted. |

Start each phase explicitly with its command:

/opsx:explore
/opsx:propose
/opsx:apply
/opsx:archive

Choose a new change name, for example `smart-game-night-plan-openspec`. 
- `proposal.md`
- `design.md`
- `tasks.md`
- `specs/game-night-planning/spec.md`


In the separate worktree, verify the complete feature and compare the outcome, verification evidence, and planning overhead with the story-driven run.

## Outcome

An interview record, reusable `to-story` and `to-ticket` skills, and a fully implemented, verified story-driven feature. 
