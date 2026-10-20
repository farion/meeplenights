# Game Night Readiness

## Intent

As a host, I want to see whether my game night is ready, so that I can resolve missing or invalid planning data before inviting people.

## Problem

Meeple Night lets a host attach attendees, candidate games, and manual selections, but it does not indicate whether the current setup is playable. A host can accidentally select a game for the wrong number of people or select games that do not fit within the available time.

## Scope

- Evaluate the currently attached attendees, candidate games, and manual selections.
- Return a deterministic readiness result through the API.
- Show the result on the game-night detail page.
- Explain each finding in host-facing language.

## Non-goals

- Automatic game recommendations or scheduling
- RSVP editing or player preferences
- Persisting readiness results
- Blocking a host from manually selecting an unsuitable game

## Success criteria

- The result is based only on current local data.
- Domain evaluation is independently testable without FastAPI or React.
- The UI distinguishes ready, warning, and blocked states.
- Every specified rule has automated-test evidence.
