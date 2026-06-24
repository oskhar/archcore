# Data Model: .czrc Configuration

## .czrc Structure

The root configuration file for Commitizen and `cz-git`.

### CommitType Object

| Field | Type | Description |
|-------|------|-------------|
| value | string | The commit type identifier (e.g., "feat", "fix") |
| name | string | The string displayed in the selection menu |
| emoji | string | The emoji prepended to the final message |

### Configuration Options

- `useEmoji` (boolean): MUST be `true` to enable emoji prepending.
- `emojiAlign` (string): MUST be `"left"` to place emoji at the start.

## Validation Rules

- Every `value` in the `types` array MUST have a corresponding `emoji` string.
- The `emoji` MUST be a valid Unicode character or emoji sequence.
