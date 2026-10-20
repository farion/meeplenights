# Explanation quality grader

Assert that:

1. Each recommended game has at least one reason grounded in the input or game data.
2. Each excluded game has at least one factual hard-constraint reason.
3. A `no_plan` response names a blocking condition and gives at least one actionable suggestion.
4. Explanations do not claim a preference, duration, category, or attendee state absent from the input.
