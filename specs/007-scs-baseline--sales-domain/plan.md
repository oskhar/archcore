# Implementation Plan: scs-baseline--sales-domain

**Branch**: `007-scs-baseline--sales-domain` | **Date**: 2026-03-25 | **Spec**: `/specs/007-scs-baseline--sales-domain/spec.md`
**Input**: Feature specification from `/specs/007-scs-baseline--sales-domain/spec.md`

## Summary

Implement the Sales domain in the monolith baseline architecture. This includes sales transaction management, total price calculation, and automatic inventory reduction using NestJS, TypeORM, and MySQL.

## Technical Context

**Language/Version**: TypeScript 5.7 (Node.js 20+)
**Primary Dependencies**: NestJS 11, TypeORM 0.3.28, Zod 4.3
**Storage**: MySQL 8.0
**Testing**: Jest
**Target Platform**: Linux (Docker)
**Project Type**: NestJS Monolith
**Performance Goals**: N/A (Standard transaction processing)
**Constraints**: Must follow SCS discipline and architecture parity as defined in constitution.
**Scale/Scope**: Single domain (Sales) within the monolith, interacting with Product and Inventory domains.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **SCS Discipline**: Branch `007-scs-baseline--sales-domain` is dedicated solely to sales implementation. (PASS)
- **Architecture Parity**: Implemented in `apps/monolith` using standard NestJS/TypeORM patterns. (PASS)
- **Domain Ownership**: Sales logic is isolated in its own module and directory. Cross-domain interaction with Inventory and Product is explicit. (PASS)
- **Measurable Complexity**: Development will be recorded via atomic commits. (PASS)

## Project Structure

### Documentation (this feature)

```text
specs/007-scs-baseline--sales-domain/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── sales-api.md
└── tasks.md             # Phase 2 output (generated separately)
```

### Source Code (repository root)

```text
apps/monolith/src/
├── sales/
│   ├── dto/
│   │   ├── create-transaction.dto.ts
│   │   └── sales.schema.ts
│   ├── entities/
│   │   ├── sales-transaction.entity.ts
│   │   └── sales-item.entity.ts
│   ├── sales.controller.ts
│   ├── sales.module.ts
│   └── sales.service.ts
└── common/
    └── entities/
        └── base.entity.ts
```

**Structure Decision**: Standard NestJS feature module structure in the monolith.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
