# Game Night Readiness specification

## Requirement: Evaluate setup completeness

The system SHALL return a `blocked` readiness result when a game night has no attached attendees.

The system SHALL return a `blocked` readiness result when a game night has no attached candidate games.

#### Scenario: Empty game night

- **GIVEN** a game night with no attendees and no candidate games
- **WHEN** readiness is requested
- **THEN** the response status is `blocked`
- **AND** the checks include `no_attendees`
- **AND** the checks include `no_candidate_games`

## Requirement: Warn about unsuitable manual selections

The system SHALL return a `warning` check when a manually selected game does not support the number of attached attendees.

#### Scenario: Too many attendees

- **GIVEN** five attendees are attached
- **AND** a manually selected game supports at most four players
- **WHEN** readiness is requested
- **THEN** the checks include `selected_game_player_count` with severity `warning`

## Requirement: Warn about selected duration

The system SHALL return a `warning` check when the combined duration of manually selected games exceeds the game night's available minutes.

#### Scenario: Selected games exceed time

- **GIVEN** a game night has 90 available minutes
- **AND** manually selected games have a combined duration of 110 minutes
- **WHEN** readiness is requested
- **THEN** the checks include `selected_games_exceed_time` with severity `warning`

## Requirement: Return all applicable findings

The system SHALL return all applicable checks in a deterministic order.

The system SHALL set status to `blocked` when any blocked check exists, to `warning` when no blocked check exists but at least one warning exists, and to `ready` when no checks exist.

#### Scenario: Blocked setup with a warning

- **GIVEN** a game night has no attached attendees
- **AND** a manually selected game supports at least two players
- **WHEN** readiness is requested
- **THEN** the response status is `blocked`
- **AND** the response includes `no_attendees`
- **AND** the response includes `selected_game_player_count`

## Requirement: Present readiness without restricting manual planning

The UI SHALL display the readiness status and each returned check on the game-night detail page.

The UI SHALL NOT disable adding attendees, attaching games, or changing manual selection because of a readiness result.
