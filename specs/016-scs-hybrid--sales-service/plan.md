# Implementation Plan: scs-hybrid--sales-service

**Branch**: `016-scs-hybrid--sales-service` | **Date**: 2026-03-29 | **Spec**: /specs/016-scs-hybrid--sales-service/spec.md
**Input**: Feature specification from `/specs/016-scs-hybrid--sales-service/spec.md`

## Summary

Implement the `sales-service` as a microservice in the `hybrid` architecture. This service will handle transaction recording, emit `SaleCompleted` events to Kafka, and maintain a local product cache to avoid synchronous cross-service calls. It will follow the NestJS CQRS pattern.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 20+
**Primary Dependencies**: NestJS 11 + @nestjs/cqrs + @nestjs/microservices + TypeORM 0.3.28 + Zod 3.x
**Storage**: MySQL 8.0 (Isolated `archkit_sales` database)
**Testing**: Jest + Supertest
**Target Platform**: Linux (Docker/Docker Compose)
**Project Type**: Microservice
**Performance Goals**: N/A
**Constraints**: Must follow SCS discipline and architecture parity.
**Scale/Scope**: Core POS transaction management.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Experiment Integrity**: ✓ Same business capability as monolith.
- **II. SCS Discipline**: ✓ Focused only on sales microservice.
- **III. Architecture Parity**: ✓ Uses NestJS, CQRS, TypeORM, Zod, and Kafka.
- **IV. Vertical Slice Domain Ownership**: ✓ Sales owns its logic.
- **V. Measurable Development Complexity**: ✓ Changes are atomic.

## Project Structure

### Documentation (this feature)

```text
specs/016-scs-hybrid--sales-service/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
apps/hybrid/apps/sales-service/
├── src/
│   ├── application/     # Commands, Queries, Handlers
│   ├── domain/          # Entities
│   ├── infrastructure/  # Repositories, Kafka
│   └── interface/       # Controllers, DTOs
└── test/                # Integration tests
```

**Structure Decision**: Standard microservice layout as established in previous phases.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Product Cache | Avoid cross-service sync calls | Direct HTTP calls violate event-driven constraint |
