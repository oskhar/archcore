# Research: SCS Naming Compliance for Production Docker

## Decision: Branch Renaming Strategy

The feature `scs-hybrid--production-docker` will be renamed to follow the archkit Constitution's mandated pattern. Since it covers both architectures but the Constitution requires "One branch = one SCS", and the specific workflow rules suggest `scs-baseline--...` and `scs-hybrid--...`, we will rename the current branch to `scs-hybrid--production-docker` (as it primarily focuses on the hybrid DB isolation) and, if necessary in the future, split baseline-specific work into its own SCS. For this task, the primary goal is removing the non-compliant `002-` prefix and aligning with the `scs-` prefix.

**Selected Name**: `scs-hybrid--production-docker`

### Rationale
- **Compliance**: The `scs-` prefix is mandatory for Principle V (Measurable Development Complexity).
- **Clarity**: `production-docker` is more descriptive than `docker-db-service-isolation`.
- **Minimal Disruption**: Renaming the branch in-place preserves the commit history which is vital for the experiment's metrics.

### Alternatives Considered
- **Splitting into two branches**: Rejected for now to avoid duplicating the existing work, as both architectures were developed together in the same SCS. We will document this deviation in the experiment notes as per Principle I.
- **Keeping the number**: Rejected. The Constitution explicitly lists `scs-baseline--...` etc., without numeric prefixes in the examples.

## Decision: Documentation Update Pattern

All files in `specs/scs-hybrid--production-docker/` and the project-wide `GEMINI.md` will be updated.

### Rationale
Consistency across the "Agent Context" and human-readable docs is required for the `speckit` toolset to function correctly on the new branch.

## Decision: Commit Standard (Commitizen)

A `.czrc` configuration will be added to the project to enforce atomic, SCS-based commits.

**Configuration Details**:
- **Type**: Conventional Commits (or cz-customizable if specialized scopes are needed).
- **Scopes**: `baseline`, `hybrid`, `infrastructure`, `docs`, `config`.
- **Enforcement**: Mandatory use of `git cz` for all commits to ensure measurable signal quality (Principle V).

### Rationale
Aligns with the Constitution's mandate for "atomic and purposeful" commits and enables automated metric tracking.

## Decision: Git Execution

1. `git branch -m scs-hybrid--production-docker`
2. `git push origin -u scs-hybrid--production-docker`
3. `git push origin --delete scs-hybrid--production-docker` (only if remote exists and user confirms)

### Rationale
Standard Git procedure for safe branch renaming.
