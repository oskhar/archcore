# Research: NestJS Setup for Hybrid Microservices

## Summary
Research focused on establishing a consistent and performant NestJS base for the hybrid architecture microservices.

## Decisions

### 1. CQRS Structure
- **Decision**: Use a simplified DDD/Clean Architecture structure for microservices.
- **Rationale**: The constitution requires `@nestjs/cqrs` for the hybrid architecture. Organizing the source by domain, application, infrastructure, and interface layers ensures a clean separation of concerns and facilitates the implementation of command/query handlers.
- **Folders**:
    - `src/domain/`: Entities, value objects, domain services.
    - `src/application/`: Commands, Queries, Handlers.
    - `src/infrastructure/`: Repositories (TypeORM), External services (Kafka).
    - `src/interface/`: Controllers, DTOs, Validation.

### 2. Zod Integration
- **Decision**: Replicate the `ZodValidationPipe` from the monolith.
- **Rationale**: Architecture parity is non-negotiable (Constitution). Using the same validation logic and error response format ensures the hybrid services behave identically to the monolith from an API perspective.

### 3. Shared Packages
- **Decision**: Leverage TurboRepo's internal package mechanism.
- **Rationale**: Ensures SC-003 from `009-scs-hybrid-setup-turbo` (sharing configuration). Services will extend `@archkit/tsconfig` and `@archkit/eslint-config`.

### 4. Boilerplate Setup
- **Decision**: Use `nest new` as a starting point, but manually strip unnecessary files and apply the shared monorepo configuration.
- **Rationale**: Faster initialization while maintaining strict control over the SCS scope.

## Research Tasks Completed
- [x] Analyze monolith Zod validation implementation.
- [x] Define CQRS directory structure for microservices.
- [x] Verify TurboRepo workspace detection for new services.
