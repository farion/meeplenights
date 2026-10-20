# Plan validity grader

For every returned plan, assert:

1. Every recommended game supports the number of confirmed attendees.
2. The total estimated duration is at most 90% of available time.
3. No recommended game has a category excluded by any confirmed attendee.
4. The result is deterministic for identical input.

Fail with the exact violating game and rule.
