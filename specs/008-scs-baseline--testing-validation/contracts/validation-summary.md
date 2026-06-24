# Contract Validation Summary

The following API contracts from `specs/000-pos-architecture-benchmark/contracts/` have been validated in the monolith baseline:

## Product API
- [X] `POST /products` (Matches schema, returns 201)
- [X] `GET /products/:id` (Returns product or 404)

## Inventory API
- [X] `POST /inventory/adjust` (Matches schema, returns 201)
- [X] `GET /inventory/:productId` (Returns quantity or 0/404)
- [X] Negative Stock: Returns 400 "Insufficient stock" when delta exceeds current quantity.

## Sales API
- [X] `POST /sales/transaction` (Matches schema, records sale, returns 201)
- [X] `GET /sales/transactions/:id` (Returns transaction details)
- [X] Transaction integrity: Fails with 400 if any item has insufficient stock.

## Integration Points
- [X] Sales transaction MUST trigger Inventory adjustment (Verified in `sales.e2e-spec.ts`).
- [X] Sales transaction MUST fail if Product does not exist (Verified in `sales.e2e-spec.ts`).

## Performance Baseline (Monolith)
- **Environment**: Local MariaDB
- **Transaction Count**: 1000
- **Total Time**: 6939ms
- **Average Time per Transaction**: 6.94ms
- **Transactions per Second (TPS)**: 144.11

## Observability
- [X] Request/Response logging implemented via `LoggingInterceptor` for all E2E tests.
