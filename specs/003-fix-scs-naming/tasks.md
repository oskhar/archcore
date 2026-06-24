# Tasks: SCS Naming Compliance for Production Docker

**Input**: Design documents from `/specs/003-fix-scs-naming/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Create `.czrc` configuration file in the repository root with `{"path": "cz-customizable"}`
- [X] T002 Verify git remote `git@github.com:oskhar/archkit.git` is configured correctly using `git remote -v`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T003 Verify local existence of the `scs-hybrid--production-docker` branch using `git branch`

---

## Phase 3: User Story 1 - Automated Metric Collection (Priority: P1)

**Goal**: Align branch naming with the archkit Constitution's mandated pattern (`scs-[arch]--[feature]`).

**Independent Test**: Run `git branch` and verify the branch formerly known as `scs-hybrid--production-docker` is now `scs-hybrid--production-docker`.

### Implementation for User Story 1

- [X] T004 [US1] Rename local branch `scs-hybrid--production-docker` to `scs-hybrid--production-docker` using `git branch -m`
- [X] T005 [US1] Update "Feature Branch" field to `scs-hybrid--production-docker` in `specs/scs-hybrid--production-docker/spec.md`
- [X] T006 [US1] Update "Branch" field to `scs-hybrid--production-docker` in `specs/scs-hybrid--production-docker/plan.md`

**Checkpoint**: Branch renaming is complete and primary identifiers are updated.

---

## Phase 4: User Story 2 - Documentation Consistency (Priority: P2)

**Goal**: Ensure all documentation references reflect the new compliant branch name.

**Independent Test**: Run `grep -r "scs-hybrid--production-docker" .` and verify zero matches (excluding git history).

### Implementation for User Story 2

- [X] T007 [P] [US2] Replace all occurrences of `scs-hybrid--production-docker` with `scs-hybrid--production-docker` in `GEMINI.md`
- [X] T008 [P] [US2] Replace all occurrences of `scs-hybrid--production-docker` with `scs-hybrid--production-docker` in `specs/scs-hybrid--production-docker/tasks.md`
- [X] T009 [P] [US2] Replace all occurrences of `scs-hybrid--production-docker` with `scs-hybrid--production-docker` in `specs/scs-hybrid--production-docker/research.md`
- [X] T010 [P] [US2] Replace all occurrences of `scs-hybrid--production-docker` with `scs-hybrid--production-docker` in `specs/scs-hybrid--production-docker/data-model.md`
- [X] T011 [P] [US2] Replace all occurrences of `scs-hybrid--production-docker` with `scs-hybrid--production-docker` in `specs/scs-hybrid--production-docker/quickstart.md`
- [X] T012 [P] [US2] Update any other files in `specs/scs-hybrid--production-docker/` containing the old branch name

**Checkpoint**: All internal documentation strings are updated.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and verification of architectural compliance.

- [X] T013 Rename directory `specs/scs-hybrid--production-docker/` to `specs/scs-hybrid--production-docker/`
- [X] T014 Run final validation using `grep -r "scs-hybrid--production-docker" .` to ensure no stale references remain
- [X] T015 [P] Finalize `specs/003-fix-scs-naming/tasks.md` by marking all tasks as complete once finished
- [X] T016 Commit all changes for this SCS using `git cz` to verify Commitizen integration


---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Story 1 (Phase 3)**: Depends on Phase 2.
- **User Story 2 (Phase 4)**: Can run in parallel with US1 implementation tasks, but depends on identifying the new name.
- **Polish (Phase 5)**: Depends on US1 and US2 completion.

### Parallel Execution Examples

```bash
# Setup tasks:
Task: "Create .czrc configuration file in the repository root"
Task: "Verify git remote"

# Documentation updates (Phase 4):
Task: "Replace occurrences in GEMINI.md"
Task: "Replace occurrences in specs/002-.../tasks.md"
Task: "Replace occurrences in specs/002-.../research.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational.
2. Complete User Story 1 (Branch rename).
3. **VALIDATE**: Ensure local branch is renamed.

### Incremental Delivery

1. Complete US1 -> Compliant branch exists.
2. Complete US2 -> Documentation is consistent.
3. Complete Polish -> Directory structure is clean.
