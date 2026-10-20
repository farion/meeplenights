# Meeple Night domain primer

## Current model

A **game night** has a title, date, and amount of available playing time. A host can attach players and candidate board games to it. A candidate game can be marked as manually selected.

The current product does not make a claim that a selected game fits the group. That missing behavior is intentional.

## Vocabulary

- **Host:** the person planning a game night.
- **Attendee:** a player attached to a game night.
- **Candidate game:** a catalogue game attached to a game night.
- **Manual selection:** the host's current choice; no validation is performed yet.
- **Game plan:** a future ordered recommendation of one or more games.

## Seed catalogue

Selected games are persisted in the local catalogue. The game picker obtains its initial popular list and search results from TableArchive through the backend. Core planning behavior must remain deterministic and work from the locally persisted game data.
