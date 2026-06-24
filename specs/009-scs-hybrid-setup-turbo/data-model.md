# Data Model: TurboRepo Infrastructure

## Core Entities

### Turbo Configuration (turbo.json)
| Property | Value | Description |
|----------|-------|-------------|
| `$schema` | `https://turbo.build/schema.json` | JSON schema for validation |
| `tasks.build` | `{ "dependsOn": ["^build"], "outputs": ["dist/**"] }` | Builds packages/apps in dependency order |
| `tasks.lint` | `{ "cache": true }` | Runs linting in parallel |
| `tasks.test` | `{ "cache": true }` | Runs tests in parallel |

### Root package.json (hybrid/)
| Property | Value | Description |
|----------|-------|-------------|
| `name` | `@archkit/hybrid-root` | Workspace root identifier |
| `workspaces` | `["apps/*", "packages/*"]` | NPM Workspace definition |
| `scripts.build` | `turbo build` | Task delegation |
| `scripts.lint` | `turbo lint` | Task delegation |
| `scripts.test` | `turbo test` | Task delegation |

## Structure & Dependencies

### Directory Hierarchy
```text
hybrid/
├── turbo.json
├── package.json
├── apps/
│   └── (placeholder for future services)
└── packages/
    ├── tsconfig/
    │   └── package.json (shared config)
    └── eslint-config/
        └── package.json (shared config)
```

### Dependency Graph
- **Services** (`apps/*`) depend on **Shared Configs** (`packages/*`) via `devDependencies`.
- **TurboRepo** orchestrates tasks across the entire graph.
