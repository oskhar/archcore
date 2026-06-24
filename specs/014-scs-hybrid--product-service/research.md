# Research: scs-hybrid--product-service

## Decisions

### 1. CQRS Implementation
- **Decision**: Use `@nestjs/cqrs` for internal microservice logic.
- **Rationale**: Mandated by the Constitution for Hybrid architecture. Separates write (Commands) from read (Queries) operations, facilitating eventual consistency and event sourcing.
- **Alternatives Considered**: Standard service pattern (Rejected by Constitution).

### 2. Event Publishing Strategy
- **Decision**: Publish Kafka events from Command Handlers after successful database persistence.
- **Rationale**: Ensures that other services (inventory, sales) are notified of product changes.
- **Alternatives Considered**: 
    - Event Sourcing (Store events as source of truth): Considered but might be overkill for this specific SCS. Decided to stick to a standard CQRS + Event Notification pattern first to match Monolith's persistence simplicity while adding the event layer.
    - Transactional Outbox: Recommended for production but will start with direct publishing for simplicity in this SCS measurement.

### 3. API Gateway Integration
- **Decision**: Use `ClientsModule` in `api-gateway` with a `ProxyController` or a specific `ProductsController` that forwards requests.
- **Rationale**: Decouples the client from the internal microservice structure.
- **Alternatives Considered**: Direct service discovery (Consul/Eureka) - Rejected as unnecessary for the current scale.

### 4. Database Schema Parity
- **Decision**: Reuse the same Product entity structure as in `scs-baseline--product-domain`.
- **Rationale**: Maintains experiment integrity and comparability.

## Needs Clarification
- Should `BaseEntity` be extracted to a shared package?
  - *Research finding*: For now, keep it local to the service to avoid "Shared code must remain minimal" violation, or use a shared `packages/common` if it already exists.
