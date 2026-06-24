# Implementation Plan: Add emoji support to .czrc for commits

**Branch**: `004-czrc-commit-emojis` | **Date**: 2026-03-25 | **Spec**: [/specs/004-czrc-commit-emojis/spec.md]
**Input**: Feature specification from `/specs/004-czrc-commit-emojis/spec.md`

## Summary

The goal is to ensure that commit messages generated via `git cz` always include a leading emoji corresponding to the commit type. While the current `.czrc` has `useEmoji: true` and emojis in the `name` field, we need to ensure the final message format strictly follows `<emoji> <type>(<scope>): <subject>`.

## Technical Context

**Language/Version**: JSON (Config) / Node.js (Tooling context)  
**Primary Dependencies**: commitizen, cz-git  
**Storage**: N/A  
**Testing**: Manual verification with `git cz` and Git log inspection  
**Target Platform**: CLI / Terminal  
**Project Type**: repo configuration  
**Performance Goals**: N/A  
**Constraints**: Must be compatible with `cz-git` adapter  
**Scale/Scope**: Repository-wide commit convention

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Experiment Integrity**: PASS. This is a repo-wide tool change that affects both architectures equally.
- **Strict SCS Discipline**: PASS. Scoped entirely to `.czrc` and commitizen configuration.
- **Architecture Parity**: PASS. Tooling is shared across the monorepo.
- **Measurable Development Complexity**: PASS. Improves scanability of the commit log, which is used for measurement.

## Project Structure

### Documentation (this feature)

```text
specs/004-czrc-commit-emojis/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
.czrc                    # Main configuration file
```

**Structure Decision**: Modification to root-level configuration file `.czrc`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

(No violations)
