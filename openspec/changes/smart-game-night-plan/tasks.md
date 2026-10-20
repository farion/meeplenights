# Implementation tasks

Complete each item only after its stated verification succeeds.

- [ ] **RSVP and preferences** — Add editable RSVP, category preference/exclusion, and comfort-level data. Verify API validation and persistence with tests.
- [ ] **Eligibility service** — Implement pure rules for confirmed attendees, player count, and category exclusions. Verify all hard-constraint fixtures.
- [ ] **Plan selection service** — Implement deterministic time-bounded selection and scoring. Verify plans stay within 90% of available time.
- [ ] **Plan API** — Add the plan endpoint and explicit `plan_found` / `no_plan` responses. Verify contract tests.
- [ ] **Plan UI** — Render action, plans, alternatives, factual explanations, and no-plan state. Verify manually in the browser.
- [ ] **Review and evals** — Run tests, fixtures, and the code-review rubric. Record unresolved findings.
