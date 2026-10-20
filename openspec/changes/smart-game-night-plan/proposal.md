# Smart Game Night Plan

## Problem

Hosts can currently collect players and candidate games, but must manually determine whether games fit the group, available time, and preferences. The application gives no feedback when a manual selection is impossible.

## Goal

Let a host generate an explainable primary game-night plan and up to two alternatives from a game night's confirmed attendees, available time, candidate games, and preferences.

## Non-goals

- An AI, LLM, or external recommendation service at runtime
- Remote catalogue import or synchronization
- Calendar invitations or authentication
- A mathematically optimal schedule

## Product decisions to confirm

- How a host records attendee comfort level
- Whether an empty candidate list means "use the entire catalogue" or "no plan is possible"
- How a host overrides an excluded category

## Success criteria

- Every recommended game satisfies hard constraints.
- The response explains recommendations, exclusions, and no-plan results.
- Rules are deterministic and covered by automated tests and local eval fixtures.
