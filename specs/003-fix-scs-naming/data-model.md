# Data Model: SCS Naming Compliance

This feature manages metadata (Git and Documentation) rather than application-level database entities.

## Metadata Entities

### Feature Branch (Git Entity)
- **Current Name**: `scs-hybrid--production-docker`
- **New Name**: `scs-hybrid--production-docker`
- **Rule**: Must follow the regex `^scs-(baseline|hybrid)--[a-z0-9-]+$`.

### Documentation String (Content Entity)
- **Occurrence**: Any string in `spec.md`, `plan.md`, `tasks.md`, `GEMINI.md` matching `scs-hybrid--production-docker`.
- **Transformation**: Replace with `scs-hybrid--production-docker`.

### Feature Directory (Filesystem Entity)
- **Current Path**: `specs/scs-hybrid--production-docker/`
- **New Path**: `specs/scs-hybrid--production-docker/`
- **Constraint**: Must be consistent with the branch name.
