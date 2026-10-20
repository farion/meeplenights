# Implementation tasks

- [ ] **Plan and contract** — Planner confirms API types, status precedence, and response examples. Verification: all roles can implement from the documented contract without a product decision.
- [ ] **Backend readiness service** — Add pure types and evaluation rules. Verification: unit tests cover ready, each individual rule, combined findings, and status precedence.
- [ ] **Readiness endpoint** — Add `GET /api/game-nights/{night_id}/readiness`. Verification: API tests cover successful output and unknown game night behavior.
- [ ] **Readiness card** — Add typed frontend API access and UI states. Verification: manually change attendees, attached games, and selections; the card refreshes.
- [ ] **Review and merge** — Review against the spec and repository rubric. Verification: selected Backpressure checks pass and blocking findings are resolved.
