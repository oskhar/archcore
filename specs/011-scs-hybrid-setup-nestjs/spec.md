# Feature Specification: Setup NestJS for Hybrid Microservices

**Feature Branch**: `011-scs-hybrid-setup-nestjs`
**Created**: 2026-03-26
**Status**: Draft
**Input**: User description: "implement scs-hybrid--setup-nestjs"

## User Scenarios & Testing

### User Story 1 - Base NestJS Microservice (Priority: P1)

As a Developer, I want a standardized NestJS base for all hybrid microservices so that I can implement domain logic without repeating boilerplate for CQRS, validation, and Kafka integration.

**Why this priority**:
Essential foundation for all subsequent hybrid service development.

**Independent Test**:
A "ping" or "health" check from a sample microservice verifying that NestJS starts, modules load, and basic CQRS commands can be dispatched.

**Acceptance Scenarios**:

1. **Given** the `apps/hybrid/` monorepo, **When** I generate a new NestJS service, **Then** it extends the shared `@archkit/tsconfig` and `@archkit/eslint-config`.
2. **Given** a hybrid microservice, **When** I define a command using `@nestjs/cqrs`, **Then** the command bus correctly routes it to its handler.

## Requirements

- **FR-001**: Establish a base NestJS template or configuration for hybrid microservices.
- **FR-002**: Integrate `@nestjs/cqrs` for Command Query Responsibility Segregation.
- **FR-003**: Configure Zod for DTO validation (to match monolith parity).
- **FR-004**: Ensure services are prepared for Kafka transport (though transport setup itself might be a separate SCS).
- **FR-005**: Services must use TypeORM for persistence (MySQL).

## Success Criteria

- **SC-001**: At least one functional microservice exists in `apps/hybrid/apps/` that starts successfully.
- **SC-002**: CQRS modules are correctly configured and functional in the base setup.
- **SC-003**: Validation pipe using Zod is available for use in the microservices.
