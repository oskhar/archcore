# Tasks: Add emoji support to .czrc for commits

**Input**: Design documents from `/specs/004-czrc-commit-emojis/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Manual verification via `git cz` and `git log` is required as per the specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initial verification of environment and tools.

- [X] T001 Verify `commitizen` and `cz-git` are installed in `package.json`
- [X] T002 Backup current `.czrc` configuration to `.czrc.bak`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Set `useEmoji: true` in `.czrc`
- [X] T004 Set `emojiAlign: "left"` in `.czrc`

**Checkpoint**: Foundation ready - global emoji settings are active.

---

## Phase 3: User Story 1 - Commit with Emojis (Priority: P1) 🎯 MVP

**Goal**: Ensure the final commit message includes a leading emoji.

**Independent Test**: Run `git cz`, complete a commit, and run `git log -n 1` to verify the leading emoji.

### Implementation for User Story 1

- [X] T005 [P] [US1] Add `emoji` field to `feat` type in `.czrc` (emoji: "✨")
- [X] T006 [P] [US1] Add `emoji` field to `fix` type in `.czrc` (emoji: "🐛")
- [X] T007 [US1] Perform manual test commit with `feat` type and verify leading ✨ in `git log`
- [X] T008 [US1] Perform manual test commit with `fix` type and verify leading 🐛 in `git log`

**Checkpoint**: User Story 1 is functional for core commit types.

---

## Phase 4: User Story 2 - Consistent Emoji Mapping (Priority: P2)

**Goal**: Map all remaining commit types to their respective emojis.

**Independent Test**: Verify `.czrc` contains `emoji` fields for all 17+ defined types.

### Implementation for User Story 2

- [X] T009 [P] [US2] Map emojis for documentation types (`docs`: "📚", `comments`: "💬") in `.czrc`
- [X] T010 [P] [US2] Map emojis for code quality types (`style`: "💄", `refactor`: "♻️", `test`: "🧪", `lint`: "🚨") in `.czrc`
- [X] T011 [P] [US2] Map emojis for maintenance types (`chore`: "🔧", `perf`: "🚀", `deps`: "📦️", `remove`: "🗑️") in `.czrc`
- [X] T012 [P] [US2] Map emojis for security and ops types (`security`: "🛡", `config`: "⚙️", `merge`: "🔀", `revert`: "⏪️", `init`: "⭐") in `.czrc`
- [X] T013 [US2] Validate all types in `.czrc` have unique and appropriate emojis per project standards

**Checkpoint**: All commit types are visually categorized with emojis.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and final validation.

- [X] T014 [P] Remove `.czrc.bak` backup file
- [X] T015 Run `quickstart.md` validation to ensure instructions are accurate
- [X] T016 Verify `emojiAlign: "left"` consistency across different terminal emulators (if possible)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Stories (Phase 3+)**: All depend on Phase 2 completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Functional foundation for emojis.
- **User Story 2 (P2)**: Extends US1 to all types.

### Parallel Opportunities

- T005 and T006 (US1 types) can be updated in parallel.
- T009, T010, T011, T012 (US2 types) can be updated in parallel as they touch different parts of the same file.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational.
2. Complete User Story 1 for `feat` and `fix`.
3. **STOP and VALIDATE**: Verify emojis appear correctly in Git log.

### Incremental Delivery

1. Foundation ready (Phase 2).
2. MVP ready (Phase 3).
3. Full consistency ready (Phase 4).
4. Final cleanup (Phase 5).
