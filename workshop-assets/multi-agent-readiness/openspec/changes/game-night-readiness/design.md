# Design: Game Night Readiness

## API contract

```http
GET /api/game-nights/{night_id}/readiness
```

```json
{
  "status": "warning",
  "checks": [
    {
      "code": "selected_game_player_count",
      "severity": "warning",
      "message": "Azul supports up to 4 players, but 5 attendees are attached."
    }
  ]
}
```

`status` is one of `ready`, `warning`, or `blocked`. `checks` is always present and is an empty array for a ready game night.

## Domain service

Create a pure backend service that receives a game night, its attendees, and attached games. It returns a typed readiness result. The HTTP route only loads data, calls this service, and serializes its result.

## Rules and precedence

1. No attendees produces `no_attendees` with severity `blocked`.
2. No candidate games produces `no_candidate_games` with severity `blocked`.
3. A manually selected game whose supported player range excludes the attendee count produces `selected_game_player_count` with severity `warning`.
4. Manually selected games whose combined duration exceeds `available_minutes` produce `selected_games_exceed_time` with severity `warning`.
5. Any blocked finding results in `blocked`; otherwise any warning results in `warning`; otherwise the result is `ready`.

All applicable checks must be returned. A blocked result does not hide warnings.

## UI

Render a Readiness card near the existing game-night title. It fetches the readiness endpoint when the displayed game night changes and after the UI successfully changes attendees, games, or manual selection.

- `ready`: positive visual treatment and a concise message.
- `warning`: warning visual treatment and each returned check.
- `blocked`: blocking visual treatment and each returned check.
- API failure: non-destructive retryable error state.

The card is informational. It must not disable existing manual-planning controls.
