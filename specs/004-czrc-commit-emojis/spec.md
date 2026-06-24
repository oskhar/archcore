# Feature Specification: Add emoji support to .czrc for commits

**Feature Branch**: `004-czrc-commit-emojis`  
**Created**: 2026-03-25  
**Status**: Draft  
**Input**: User description: "don't forget emote in czrc when write commit"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Commit with Emojis (Priority: P1)

As a developer, I want to see and select emojis when making a commit so that the commit history is visually organized and easy to scan.

**Why this priority**: High value for developer experience and repository maintainability. It aligns with modern Git practices.

**Independent Test**: Can be fully tested by running the commitizen command (`git cz`) and verifying that emojis are displayed in the prompts and included in the final commit message.

**Acceptance Scenarios**:

1. **Given** a repository with a configured `.czrc`, **When** I run the commit command, **Then** I should see emojis next to each commit type (e.g., ✨ for feat, 🐛 for fix).
2. **Given** I have selected a commit type and entered a message, **When** the commit is created, **Then** the final commit message must start with the selected emoji.

---

### User Story 2 - Consistent Emoji Mapping (Priority: P2)

As a maintainer, I want all commit types to have a dedicated emoji mapping in `.czrc` so that every commit in the project follows a consistent visual style.

**Why this priority**: Ensures consistency across the entire team and avoids "plain" commits that break the visual pattern.

**Independent Test**: Can be tested by verifying the `.czrc` file content against a predefined list of required commit types and their corresponding emojis.

**Acceptance Scenarios**:

1. **Given** the list of project-defined commit types, **When** checking the `.czrc` configuration, **Then** every type must have a corresponding emoji defined.

---

### Edge Cases

- **What happens when a commit type is missing an emoji?** The system should fallback to a default emoji or a clear text-only format without breaking the commit process.
- **How does the system handle terminals that don't support emojis?** While rare in modern development, the text description of the commit type remains the primary identifier to ensure readability.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `.czrc` configuration MUST include an `emoji` or `types` mapping that associates each commit type with a specific emoji.
- **FR-002**: The commitizen prompt MUST display the emoji alongside the type name during selection.
- **FR-003**: The final generated commit message MUST follow the format: `<emoji> <type>(<scope>): <subject>`.
- **FR-004**: All existing commit types (feat, fix, docs, style, refactor, test, chore, perf, deps, security, etc.) MUST have an assigned emoji.
- **FR-005**: The configuration MUST be compatible with `cz-git` or the currently used commitizen adapter in the project.

### Key Entities *(include if feature involves data)*

- **Commit Type**: A category of change (e.g., feat, fix) associated with a specific emoji and description.
- **.czrc Configuration**: The JSON file governing the behavior and appearance of the commitizen CLI.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of commits made via the standardized commit tool include a leading emoji.
- **SC-002**: All 17+ commit types currently defined in the project's `.czrc` are mapped to a unique emoji.
- **SC-003**: Developers can identify the nature of a commit from the Git log at a glance without reading the full text.

## Assumptions

- **Existing Tooling**: The project uses `commitizen` and `cz-git` (as seen in existing `.czrc`).
- **Terminal Support**: Developers use modern terminals that support Unicode/emoji display.
- **Workflow Integration**: This change only affects commits made via the interactive CLI, not direct `git commit -m` calls (unless hooks are implemented later).
