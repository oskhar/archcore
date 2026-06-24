# Tasks: Relocate Hybrid TurboRepo

**Input**: Design documents from `/specs/010-scs-hybrid-relocate-turbo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the target environment for relocation.

- [X] T001 Create the target directory `apps/hybrid/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core relocation operations that MUST be complete before verification.

- [X] T002 Move all contents from root `hybrid/` to `apps/hybrid/`
- [X] T003 Delete the now-empty root-level `hybrid/` directory

**Checkpoint**: Foundation ready - files are relocated and root is clean.

---

## Phase 3: User Story 1 - Relocated Monorepo (Priority: P1) 🎯 MVP

**Goal**: Relocate the monorepo to `apps/hybrid/` while maintaining functionality.

**Independent Test**: Verify that `apps/hybrid/turbo.json` and `apps/hybrid/package.json` exist and that TurboRepo commands work from the new directory.

### Implementation for User Story 1

- [X] T004 [US1] Verify `apps/hybrid/package.json` contains correct `workspaces` and `packageManager` relative to its new root
- [X] T005 [US1] Verify `apps/hybrid/turbo.json` task definitions remain valid for the internal workspace structure
- [X] T006 [US1] Run `npm install` within `apps/hybrid/` to recreate workspace symlinks and refresh `package-lock.json`
- [X] T007 [US1] Execute `npx turbo build` from `apps/hybrid/` to confirm orchestration works in the new location

**Checkpoint**: User Story 1 is functional - the monorepo is successfully relocated and operating.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation.

- [X] T008 Verify the root directory `hybrid/` no longer exists
- [X] T009 [P] Update `apps/hybrid/README.md` to reflect its new location in the project hierarchy
- [X] T010 Final verification of `apps/hybrid/apps/ping-service` functionality using `npx turbo test`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **Polish (Final Phase)**: Depends on User Story 1 completion

### Parallel Opportunities

- T009 can be done in parallel with T010 if files are different.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Create target directory
2. Move files
3. Refresh dependencies
4. Validate Turbo build

### Incremental Delivery

1. Setup target
2. Relocate files
3. Verify configurations
4. Clean up root
5. Final functional validation
