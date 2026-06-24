# Implementation Plan: Setup Kafka for Hybrid Architecture

**Branch**: `012-scs-hybrid-setup-kafka` | **Date**: 2026-03-26 | **Spec**: [specs/012-scs-hybrid-setup-kafka/spec.md](spec.md)
**Input**: "implement scs-hybrid--setup-kafka with schema apps is api-gateway, product-service, inventory-service, and sales-service, make sure that nestjs running well in all application, you can seting up turbo start:dev dependOn ^dev"

## Summary

Initialize the full hybrid microservice stack (`api-gateway`, `product-service`, `inventory-service`, `sales-service`) and configure Kafka as the event-driven transport layer. This includes infrastructure setup (Docker Compose), NestJS microservice configuration, and TurboRepo task pipeline refinement.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 20+
**Primary Dependencies**: NestJS 11, @nestjs/microservices, kafkajs, TurboRepo
**Storage**: MySQL 8.0, Kafka (Redpanda or standard Kafka)
**Testing**: Health check verification across 4 services, cross-service message validation.
**Target Platform**: Linux / Docker
**Project Type**: Microservices / Infrastructure
**Performance Goals**: N/A for infrastructure setup.
**Constraints**: Must strictly follow SCS discipline and preserve architectural isolation.
**Scale/Scope**: 4 microservices + Kafka infrastructure.

## Constitution Check

| Gate | Status | Rationale |
|------|--------|-----------|
| **Experiment Integrity** | PASS | Provides the transport layer necessary for evaluating hybrid architecture complexity. |
| **SCS Discipline** | PASS | Focused on Kafka transport and core stack initialization. |
| **Architecture Parity** | PASS | Implements the required Kafka transport for the Hybrid implementation. |
| **Vertical Slice** | PASS | Prepares the services for their respective domain implementations. |
| **Measurable Complexity** | PASS | Kafka integration adds measurable overhead compared to monolith. |

## Project Structure

### Documentation (this feature)

```text
specs/012-scs-hybrid-setup-kafka/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
apps/hybrid/
├── turbo.json           # Updated dev task
├── apps/
│   ├── api-gateway/     # Entry point
│   ├── product-service/ # (Existing, to be updated)
│   ├── inventory-service/ # (New)
│   └── sales-service/   # (New)
└── packages/            # (Existing shared configs)

infrastructure/
└── docker/
    └── docker-compose.yml # Add Kafka/Zookeeper or Redpanda
```

**Structure Decision**: Use Redpanda in Docker Compose for a simpler single-binary Kafka-compatible setup, or standard Bitnami Kafka if parity with older environments is preferred.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
