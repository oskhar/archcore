# Data Model: Hybrid Microservice Base Structure

## Core Components (Infrastructure/Patterns)

### CQRS Module Configuration
| Component | Responsibility | Pattern |
|-----------|----------------|---------|
| `Command` | Represents an action | DTO |
| `Command Handler` | Executes the command | Strategy |
| `Query` | Represents a data request | DTO |
| `Query Handler` | Executes the query | Strategy |
| `Event` | Represents a state change | DTO |
| `Event Handler` | Reacts to state changes | Observer |

### Validation Structure (Interface Layer)
| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `Zod Schema` | Defines valid data format | Zod |
| `ZodValidationPipe` | Validates incoming DTOs | NestJS Pipe |
| `Error Response` | Standardized error output | BadRequestException |

## Service Directory Structure
```text
apps/hybrid/apps/[service-name]/
├── src/
│   ├── domain/           # Core logic (Entities, Value Objects)
│   ├── application/      # Use cases (CQRS Handlers)
│   ├── infrastructure/   # Data access, external systems
│   └── interface/        # Controllers, DTOs, Validation
├── test/                 # E2E and Unit tests
├── package.json          # Workspace package configuration
├── tsconfig.json         # Extends @archkit/tsconfig
└── eslint.config.mjs     # Extends @archkit/eslint-config
```
