# Research: scs-baseline--sales-domain

## Tech Stack Best Practices (NestJS + TypeORM)

### Atomicity (Transactions)
- **Problem**: A sales transaction must either succeed completely (including stock reduction) or fail completely.
- **Decision**: Use `DataSource.transaction()` or `@Transaction()` decorator (DataSource is preferred in modern TypeORM) to ensure atomicity across `SalesTransaction`, `SalesItem`, and `Inventory` updates.
- **Alternative**: Manual updates without a database transaction were rejected to avoid inconsistent states.

### Cross-Domain Communication
- **Problem**: Sales needs to interact with Product (to get prices) and Inventory (to reduce stock).
- **Decision**: Inject `ProductService` and `InventoryService` into `SalesService`. This is standard practice in a modular monolith.
- **Alternative**: Direct repository access to other domains was rejected to maintain domain boundaries.

### Decimal Precision
- **Problem**: Financial calculations should be precise.
- **Decision**: Use `decimal` type in MySQL and `number` or `string` in TypeScript (careful with floating point). For the baseline, `number` is used for simplicity but documented for potential improvement.

## Artifact Resolution

| Unknown | Finding/Decision | Rationale |
|---------|------------------|-----------|
| Inventory Update | Synchronous | In the baseline monolith, we keep it simple and synchronous. |
| Price Lock | Store price at time of sale in `SalesItem`. | Product prices may change later, so we must record the historical price. |
