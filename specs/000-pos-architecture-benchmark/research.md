# Research: POS Architecture Complexity Benchmark

## 1. Kafka Topic Strategy
- **Decision**: Multi-topic based on Domain and Event Type (e.g., `product.created`, `inventory.updated`).
- **Rationale**: Provides better isolation for consumers and simplifies schemas. Using a single topic for all domains would lead to high message filtering overhead and schema complexity.
- **Alternatives considered**: 
  - **Single Topic per Domain**: Too broad; complicates filtering for specific business events.
  - **Global Event Bus**: Unnecessary complexity for this benchmark scope.

## 2. CQRS & Event Sourcing in NestJS
- **Decision**: Use `@nestjs/cqrs` for the Hybrid implementation, but implement a lightweight Event Sourcing pattern for the Sales domain only.
- **Rationale**: Sales requires high integrity and auditability. Other domains will use standard CRUD with Event-Driven updates for inter-service communication to avoid over-engineering.
- **Alternatives considered**:
  - **Full Event Sourcing for all domains**: Increases implementation complexity significantly, potentially skewing metrics too far toward Hybrid overhead without comparable Monolith gains.

## 3. Git Metrics Automation
- **Decision**: Custom bash scripts (`scripts/metrics/`) leveraging `git diff --numstat` and `git log --format`.
- **Rationale**: Provides the most flexible way to capture exactly what the Constitution requires (LOC, files, commits, lead time) without external dependencies.
- **Alternatives considered**:
  - **Existing Tools (e.g., git-stats, cloc)**: Harder to integrate into a custom SCS-based workflow and often don't provide lead-time-per-branch metrics natively.

## 4. Technical Stack Best Practices
- **TypeORM**: Use repository pattern for Monolith and Command/Query handlers for Hybrid to enforce architectural boundaries.
- **Zod**: Centralized schema definition in `packages/shared-schema` to ensure both architectures use the same validation rules.
- **TurboRepo**: Essential for managing the Monorepo complexity and ensuring fast builds/tests across multiple apps.

## 5. Microservice Failure Strategy
- **Decision**: Implement a stale-while-revalidate caching pattern at the API Gateway.
- **Rationale**: As per clarification, returning stale data from cache if the primary service is unavailable ensures better availability for the experiment.
- **Alternatives considered**:
  - **Circuit Breaker with Error**: Informative but may hinder the experiment's "continuous" flow.
