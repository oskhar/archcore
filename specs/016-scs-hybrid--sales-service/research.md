# Research: scs-hybrid--sales-service

## Kafka-Based Cross-Service Consistency for Sales

- **Decision**: Use a "local cache" pattern where the Sales service maintains its own view of products.
- **Rationale**: This follows the "Vertical Slice Domain Ownership" principle and avoids synchronous network chatter between services.
- **Alternatives considered**: Direct HTTP calls to Product service (violated constitution), API Gateway orchestration (centralizes logic).

## Atomic Sales Transaction and Event Emission

- **Decision**: Transactional Outbox pattern is not strictly required for this experiment's baseline, but we will ensure the event is emitted after the DB transaction commits.
- **Rationale**: Keeps implementation simple while fulfilling the "event-driven contracts" requirement.
- **Alternatives considered**: Transactional outbox (too complex for MVP), Emit before commit (risk of ghost events).

## CQRS Pattern for Complex Transactions

- **Decision**: Use `CommandBus` to handle `CreateSaleCommand` which coordinates both DB writes and Kafka emissions.
- **Rationale**: Aligns with hybrid architecture constraints in the constitution.
- **Alternatives considered**: Simple service (violated constitution).

## Product Event Schema Compatibility

- **Decision**: Sales service will subscribe to `product.created` and `product.updated` topics.
- **Rationale**: This is how the Product cache will be maintained.
- **Note**: Ensure `product-service` is emitting these topics with the expected schema.
