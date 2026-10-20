# Architecture review rubric

- Does the change preserve the local-first, deterministic runtime boundary?
- Are external catalogue calls isolated from core planning behavior?
- Does the API use explicit success and no-plan states?
- Is persistent data modeled without hiding product decisions in schema defaults?
- Can the plan engine evolve without coupling it to FastAPI or React?
