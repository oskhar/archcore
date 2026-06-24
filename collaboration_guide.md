# 🤝 Collaboration Guide

Welcome to the team! This guide will walk you through everything you need to know to collaborate efficiently on this project. Whether you're a seasoned contributor or a new team member, please take a few minutes to read this — it ensures we're all on the same page.

## 🧭 Table of Contents

1. [Workflow Summary](#workflow-summary)
2. [Git Commit Convention with Commitizen](#git-commit-convention-with-commitizen)
   - [Why We Use Commitizen](#why-we-use-commitizen)
   - [Installing Commitizen Globally](#installing-commitizen-globally)
   - [Using the Provided `.czrc`](#using-the-provided-czrc)
   - [Making Your First Commit](#making-your-first-commit)
3. [Branching Strategy](#branching-strategy)
4. [Code Reviews](#code-reviews)
5. [Changelog & Releases (optional)](#changelog--releases-optional)

## 🌀 Workflow Summary

We follow a straightforward Git-based workflow:

- Work on a new branch (never directly on `master`/`main`)
- Use descriptive commit messages (powered by Commitizen)
- Create pull requests for all changes
- Keep PRs small and focused
- Review others’ PRs with constructive feedback

## 🔏 Git Commit Convention with Commitizen

### Why We Use Commitizen

Clear commit messages make it easier to:

- Understand **what** changed and **why**
- Generate **automated changelogs**
- Maintain consistency across contributions

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to make our history readable and structured.

### 🚀 Installing Commitizen Globally

You only need to do this once:

```bash
npm install -g commitizen
```

> 💡 Make sure Node.js and npm are installed. If not, [download Node.js here](https://nodejs.org/).

You can check if it worked:

```bash
commitizen --version
```

### 🗂 Using the Provided `.czrc`

You don’t need to configure anything manually — we already did that for you! A `.czrc` file is included in the root directory of this project. It tells Commitizen which adapter to use (e.g., `cz-conventional-changelog` or `cz-git`).

If you're seeing this error:

```bash
Could not resolve cz-git
```

Just run:

```bash
npm install -g cz-git
```

Or, if you're using the default:

```bash
npm install -g cz-conventional-changelog
```

### 🧪 Making Your First Commit

Instead of running `git commit`, use:

```bash
git cz
```

or simply:

```bash
cz
```

You’ll be guided through an interactive prompt, like this:

```
? Select the type of change that you're committing: (Use arrow keys)
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  chore:    Changes to the build process or tools
```

After completing the prompt, it will generate a commit message like:

```
feat(login): add login form validation
```

> This style helps us track changes more effectively and enables changelog automation.

## 🌱 Branching Strategy (MANDATORY)

This project follows a strict **Smallest Change Set (SCS)** discipline. Every branch must represent exactly one atomic change set as defined in the experiment plan.

| Branch Pattern | Purpose |
| --------------- | ---------------------------- |
| `main` | Production-ready, merged experiment results |
| `scs-baseline--*` | Baseline (Monolith) experiment increments |
| `scs-hybrid--*` | Hybrid architecture experiment increments |
| `feature/*` | Non-experiment features (tooling, docs) |

> **Crucial**: Branch names must match the predefined experiment identifiers (e.g., `scs-hybrid--product-service`). Refer to the **Project Constitution** for the full list of mandatory branches.

## 🔍 Code Reviews

- All pull requests must validate **SCS scope compliance**.
- PRs must demonstrate **Architecture Parity** (if affecting domain logic).
- Metric validity must be confirmed before merging.

## 📝 Changelog & Releases (optional)

If we choose to automate changelogs later, your Commitizen messages will make that **seamless**.

For example, we could use:

```bash
npm install -g conventional-changelog-cli
conventional-changelog -p angular -i CHANGELOG.md -s
```

Or use [`git-cliff`](https://github.com/orhun/git-cliff) for a faster, Rust-powered experience.

## 🫱 Need Help?

If you get stuck at any point:

- Reach out in the project WhatsApp/Discord
- Tag @oskhar or a lead dev
- Or open an issue with specific label

Let’s make collaboration fun and professional 🚀
