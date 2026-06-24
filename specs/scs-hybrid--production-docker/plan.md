# Implementation Plan: Production Docker and DB-per-Service Isolation

**Branch**: `scs-hybrid--production-docker` | **Date**: 2026-03-25 | **Spec**: `/specs/scs-hybrid--production-docker/spec.md`
**Input**: Feature specification from `/specs/scs-hybrid--production-docker/spec.md`

## Summary

This feature enforces production-grade Docker standards across both monolith and hybrid architectures. For the hybrid architecture, it implements strict database-per-service isolation for the Product, Inventory, and Sales domains. The technical approach involves multi-stage Docker builds, automated health checks, and decentralized storage configurations to enhance scalability and operational resilience.

## Technical Context

**Language/Version**: TypeScript / Node.js 20+  
**Primary Dependencies**: NestJS, TypeORM, Zod, MySQL, Kafka, Docker, Docker Compose  
**Storage**: MySQL (Independent instances per microservice in hybrid; single instance in monolith)  
**Testing**: Jest (Integration tests for connectivity and isolation)  
**Target Platform**: Linux Server / Docker  
**Project Type**: Monorepo with multiple backend services  
**Performance Goals**: Image size < 500 MB; service recovery < 10s  
**Constraints**: No build-tools in production images; Environment-based secret management  
**Scale/Scope**: 3 isolated database domains (Product, Inventory, Sales)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **✅ Experiment Integrity**: Production hardening applied to both monolith and hybrid architectures.
- **✅ SCS Discipline**: Implementation grouped by infrastructure change sets.
- **✅ Architecture Parity**: Core logic remains identical; only deployment topology varies.
- **✅ Vertical Slice Domain Ownership**: DB-per-service enforces strict domain isolation.
- **✅ Measurability**: Docker image sizes and recovery times are quantifiable metrics.

## Project Structure

### Documentation (this feature)

```text
specs/scs-hybrid--production-docker/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
infrastructure/
├── docker/
│   ├── monolith/
│   │   ├── Dockerfile.prod
│   │   └── docker-compose.yml
│   └── hybrid/
│       ├── product/
│       │   └── Dockerfile.prod
│       ├── inventory/
│       │   └── Dockerfile.prod
│       ├── sales/
│       │   └── Dockerfile.prod
│       └── docker-compose.yml
├── database/
│   ├── init/
│   │   ├── product.sql
│   │   ├── inventory.sql
│   │   └── sales.sql
│   └── config/
scripts/
└── ops/
    ├── build-images.sh
    └── check-health.sh
```

**Structure Decision**: A dedicated `infrastructure/docker` directory is established to house environment-specific Dockerfiles and Compose configurations, ensuring clear separation between monolithic and hybrid deployment logic.

## Complexity Tracking

*No constitution violations detected.*
