# Implementation Plan: Setup NestJS for Hybrid Microservices

**Branch**: `011-scs-hybrid-setup-nestjs` | **Date**: 2026-03-26 | **Spec**: [specs/011-scs-hybrid-setup-nestjs/spec.md](spec.md)
**Input**: Feature specification from `/specs/011-scs-hybrid-setup-nestjs/spec.md`

## Summary

Establish the base NestJS structure for the hybrid architecture microservices. This includes configuring `@nestjs/cqrs` for Command Query Responsibility Segregation, integrating Zod for DTO validation, and ensuring compatibility with the shared monorepo configurations.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 20+
**Primary Dependencies**: NestJS 11, @nestjs/cqrs, TypeORM 0.3.28, Zod 3.x
**Storage**: MySQL 8.0 (via TypeORM)
**Testing**: Jest 30.0.0, Supertest 7.0.0
**Target Platform**: Linux / Docker
**Project Type**: Microservices (part of a TurboRepo monorepo)
**Performance Goals**: N/A for baseline setup
**Constraints**: Must strictly follow SCS discipline and preserve parity with monolith domain logic.
**Scale/Scope**: Initial setup of at least one service (e.g., product-service) to serve as a template.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Rationale |
|------|--------|-----------|
| **Experiment Integrity** | PASS | Setup enables implementing identical domain logic in hybrid architecture. |
| **SCS Discipline** | PASS | Focuses solely on NestJS/CQRS baseline setup. |
| **Architecture Parity** | PASS | Implements the required Hybrid tech stack (CQRS, NestJS). |
| **Vertical Slice** | PASS | Structure supports domain decomposition. |
| **Measurable Complexity** | PASS | Standard metrics will be tracked. |

## Project Structure

### Documentation (this feature)

```text
specs/011-scs-hybrid-setup-nestjs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
apps/hybrid/
├── apps/
│   └── product-service/  # Example microservice
│       ├── src/
│       │   ├── domain/   # Entities, value objects
│       │   ├── application/ # CQRS Commands, Queries, Handlers
│       │   ├── infrastructure/ # TypeORM repos, Kafka producers/consumers
│       │   └── interface/ # Controllers, DTOs (Zod)
│       └── test/
└── packages/
    └── shared-nestjs/    # Shared NestJS boilerplate/pipes (if needed)
```

**Structure Decision**: Microservices will be placed in `apps/hybrid/apps/` and will follow a simplified Clean Architecture / DDD structure to accommodate CQRS.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
