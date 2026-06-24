# Research: Emoji support in cz-git

## Decision: Explicitly map emojis and set alignment

We will update `.czrc` to explicitly include the `emoji` field for each commit type and set `emojiAlign` to `left`. This ensures that `cz-git` correctly prepends the emoji to the final commit message.

## Rationale

While the current configuration has `useEmoji: true`, the lack of an explicit `emoji` field for each type may lead to inconsistent behavior or missing emojis in the final commit message, especially depending on the environment or the version of `cz-git` being used. By explicitly defining the emoji for each type and setting the alignment to `left`, we guarantee the `<emoji> <type>(<scope>): <subject>` format requested.

## Alternatives considered

- **Using `emojiAlign: "center"`**: This would place the emoji between the type/scope and the subject (e.g., `feat(ui): ✨ subject`). The user's request "don't forget emote in czrc when write commit" implies a visual leading emoji, which `left` alignment provides more traditionally in many "gitmoji" style logs.
- **Relying on the `name` field**: The `name` field is for the CLI display menu. While it currently contains emojis, `cz-git` uses the `emoji` field to determine what to actually prepend to the message.

## Findings

- `useEmoji: true` is mandatory.
- `emoji` field in the `types` array is the source of truth for the prepended emoji.
- `emojiAlign: "left"` places the emoji at the very beginning of the message.
