# Research: scs-hybrid--inventory-service

## Kafka Integration in NestJS for Cross-Service Events

- **Decision**: Use `@nestjs/microservices` with Kafka transport to listen for `ProductCreated` events.
- **Rationale**: This is the standard NestJS way to handle Kafka events and ensures consistency with `product-service`.
- **Alternatives considered**: Directly using `kafkajs`, but NestJS microservices provide better abstraction and integration with controllers.

## CQRS for Inventory Adjustments

- **Decision**: Use `@nestjs/cqrs` for `AdjustStockCommand` and `GetStockQuery`.
- **Rationale**: Required by the constitution for the hybrid architecture to separate write and read logic.
- **Alternatives considered**: Simple services, but violates constitution architectural parity.

## Idempotency and Race Conditions

- **Decision**: Use TypeORM `increment`/`decrement` or `UPDATE quantity = quantity + :delta` instead of reading, adding locally, and saving.
- **Rationale**: To handle concurrent requests without losing updates.
- **Alternatives considered**: Optimistic locking, but simple SQL-level updates are sufficient for this experiment's scope.

## API Gateway Routing for Inventory

- **Decision**: Implement a proxy controller in `api-gateway` that uses the `KAFKA_SERVICE` or REST to forward requests to `inventory-service`.
- **Rationale**: As per `product-service` implementation, the gateway acts as the single entry point.
- **Note**: Check `product-service` gateway implementation to see if it uses REST or Kafka for communication.
