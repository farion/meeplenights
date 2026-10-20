# Game-night planning specification

## Requirement: Count confirmed attendees

The system SHALL use only attendees with status `confirmed` to determine the group size for a generated plan.

#### Scenario: Tentative attendee

- **GIVEN** a game night with three confirmed attendees and one tentative attendee
- **WHEN** the host generates a plan
- **THEN** game eligibility is evaluated for three players

## Requirement: Enforce hard eligibility constraints

The system SHALL exclude a candidate game when it does not support every confirmed attendee.

The system SHALL exclude a candidate game when any confirmed attendee excludes one of its categories.

#### Scenario: Excluded category

- **GIVEN** a confirmed attendee excludes `Horror`
- **AND** a candidate game has the `Horror` category
- **WHEN** the host generates a plan
- **THEN** that game is not contained in any recommended plan
- **AND** its exclusion explanation identifies the category conflict

## Requirement: Limit plan duration

The system SHALL ensure that a generated plan uses no more than 90 percent of the game night's available minutes.

#### Scenario: Time boundary

- **GIVEN** a game night has 180 available minutes
- **WHEN** the host generates a plan
- **THEN** the total duration of each returned plan is at most 162 minutes

## Requirement: Explain outcomes

The system SHALL provide factual reasons for a recommended game and factual reasons for every excluded candidate game.

The system SHALL return an explicit no-plan response when no valid plan can be generated.

#### Scenario: No candidate fits

- **GIVEN** no candidate game supports the confirmed attendee count
- **WHEN** the host generates a plan
- **THEN** the response status is `no_plan`
- **AND** the response explains the blocking condition
- **AND** the response suggests a corrective action
