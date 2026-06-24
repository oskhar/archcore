# Implementation Plan: scs-hybrid--inventory-service

**Branch**: `015-scs-hybrid--inventory-service` | **Date**: 2026-03-29 | **Spec**: /specs/015-scs-hybrid--inventory-service/spec.md
**Input**: Feature specification from `/specs/015-scs-hybrid--inventory-service/spec.md`

## Summary

Implement the `inventory-service` as a microservice in the `hybrid` architecture. This service will handle stock adjustments and retrieval, using NestJS with CQRS, TypeORM for persistence in an isolated `archkit_inventory` database, and Kafka for event-driven communication.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 20+
**Primary Dependencies**: NestJS 11 + @nestjs/cqrs + @nestjs/microservices + TypeORM 0.3.28 + Zod 3.x
**Storage**: MySQL 8.0 (Isolated `archkit_inventory` database)
**Testing**: Jest + Supertest
**Target Platform**: Linux (Docker/Docker Compose)
**Project Type**: Microservice
**Performance Goals**: N/A
**Constraints**: Must follow SCS discipline and architecture parity as per constitution.
**Scale/Scope**: Single domain microservice.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Experiment Integrity**: ✓ Matches monolith business capability.
- **II. SCS Discipline**: ✓ Focused on inventory microservice.
- **III. Architecture Parity**: ✓ Uses NestJS, CQRS, TypeORM, Zod, and Kafka.
- **IV. Vertical Slice Domain Ownership**: ✓ Inventory owns its logic.
- **V. Measurable Development Complexity**: ✓ Changes are atomic.

## Project Structure

### Documentation (this feature)

```text
specs/015-scs-hybrid--inventory-service/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
apps/hybrid/apps/inventory-service/
├── src/
│   ├── application/     # Commands, Queries, Handlers
│   ├── domain/          # Entities
│   ├── infrastructure/  # Repositories, Kafka
│   └── interface/       # Controllers, DTOs
└── test/                # Integration tests
```

**Structure Decision**: Standard NestJS microservice structure with CQRS separation.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
