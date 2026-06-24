# Research: scs-baseline--inventory-domain

## Tech Stack Best Practices (NestJS + TypeORM)

### Concurrent Adjustments
- **Problem**: Multiple requests adjusting stock simultaneously could lead to race conditions.
- **Decision**: Use `repository.increment()` or `repository.decrement()` from TypeORM, which uses `UPDATE inventory SET quantity = quantity + :delta` under the hood.
- **Alternative**: `SELECT ... FOR UPDATE` was considered but rejected as overkill for a baseline implementation, though it's the most robust.

### Domain Integrity
- **Problem**: Inventory must only exist for valid products.
- **Decision**: Use a foreign key constraint and verify product existence in the service layer before adjustment.

### Transactional Boundaries
- **Problem**: Stock adjustment might need to be atomic with other operations (though not in this simple SCS).
- **Decision**: Follow standard service pattern, allowing future use of `DataSource` transactions if needed.

## Artifact Resolution

| Unknown | Finding/Decision | Rationale |
|---------|------------------|-----------|
| Negative Stock | Allowed with warning. | Specified in architecture benchmark contract. |
| DB Structure | `Inventory` table with `productId` as unique FK. | One-to-one relationship between Product and Inventory for simplicity in baseline. |
