# Design: Smart Game Night Plan

## Data model changes

- Add an RSVP status editable by the host: `confirmed`, `tentative`, or `declined`.
- Add preferred and excluded categories to a player profile.
- Add a comfort level from 1 to 5 to a player profile.
- Preserve the existing game-night candidate-game relationship.

## API

```http
POST /api/game-nights/{night_id}/plan
```

The response has one of two explicit states:

```json
{ "status": "plan_found", "plans": [], "excludedGames": [] }
```

```json
{ "status": "no_plan", "reasons": [], "suggestions": [] }
```

`plans` contain an ordered game list, total duration, score, and human-readable reasons. `excludedGames` contain a game and factual exclusion reasons.

## Rule pipeline

1. Determine the confirmed attendee count.
2. Reject candidate games outside that player-count range.
3. Reject candidate games with a category excluded by any confirmed attendee.
4. Reject combinations exceeding 90% of available time.
5. Score remaining candidates using preferred categories and comfort level.
6. Return a deterministic primary plan and at most two alternatives.
7. Explain decisions from actual rule results; never invent a reason.

Eligibility must be separate from scoring. Hard constraints must run before scoring.

## UI states

- Idle: host sees a `Generate plan` action.
- Success: show primary plan, alternatives, and explanation sections.
- No plan: show reasons and concrete suggestions, for example adding candidate games or adjusting available time.
- Error: show a retryable API failure without replacing existing manual selections.
