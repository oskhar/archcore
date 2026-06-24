# Quickstart: Commit with Emojis

## Setup

1. Ensure `commitizen` and `cz-git` are installed in the repository.
2. Verify the `.czrc` file is correctly configured with `useEmoji: true`, `emojiAlign: "left"`, and all `types` have their corresponding `emoji` field.

## Usage

Instead of using `git commit -m "..."`, use:

```bash
git cz
```

1. Select the commit type (e.g., ✨ feat).
2. Choose the scope if applicable.
3. Write a brief subject for the change.
4. Fill in the body and footer if needed.

## Verification

The generated commit message in the Git log should look like:

```text
✨ feat(scope): message
```

Check the log to verify:

```bash
git log -n 1
```
