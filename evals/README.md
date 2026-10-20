# Smart Game Night Plan evals

These fixtures are intentionally data-only until the Smart Game Night Plan is implemented. They define local, deterministic cases for the workshop; no model judge or remote service is required.

After implementation, build a runner that sends each fixture to the plan engine or API, then applies the checks in `graders/`.

An eval has three separate concerns:

- **Task:** generate a game-night plan.
- **Outcome:** the host receives a valid and useful result.
- **Grader:** checks one measurable property of that result.

Do not collapse all three into a single subjective "looks good" assertion.
