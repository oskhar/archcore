# Data Model: Hybrid Relocation

## Source and Target

### OLD: `hybrid/` (to be removed)
| Entity | Type |
|--------|------|
| `hybrid/` | Root monorepo directory |
| `hybrid/package.json` | Root configuration |
| `hybrid/turbo.json` | Task orchestration |
| `hybrid/apps/` | Workspace for services |
| `hybrid/packages/` | Workspace for shared config |

### NEW: `apps/hybrid/` (target)
| Entity | Type |
|--------|------|
| `apps/hybrid/` | New root for hybrid monorepo |
| `apps/hybrid/package.json` | Root configuration (moved) |
| `apps/hybrid/turbo.json` | Task orchestration (moved) |
| `apps/hybrid/apps/` | Workspace for services (moved) |
| `apps/hybrid/packages/` | Workspace for shared config (moved) |

## Relationships
- The internal structure of the `hybrid` monorepo remains unchanged.
- Relative paths within `apps/hybrid/package.json` and `apps/hybrid/turbo.json` are maintained.
