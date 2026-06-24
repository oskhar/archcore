# State Rehydration Report

Generated at: 2026-06-23T06:52:10.084Z
Filter: EQUAL
Scope: HYBRID architecture only

## Summary

- Result files analyzed: 3
- Total restored states: 33,831
- Average State Rehydration Time: 6609.67 ms
- Total State Rehydration Time: 19829.00 ms
- Counter mode: scenario-based fallback estimation

## State Rehydration Time

| Scenario | Run ID | Latency p95 | State Rehydration Time | Time source |
| --- | --- | ---: | ---: | --- |
| EQUAL_INVENTORY_SYNC | 1782193283 | 83.90 ms | 478.00 ms | derived-from-latency-p95 |
| EQUAL_PRODUCT_CRUD | 1782192876 | 9416.80 ms | 19067.00 ms | derived-from-latency-p95 |
| EQUAL_SALES_TRANSACTION | 1782193653 | 10.90 ms | 284.00 ms | derived-from-latency-p95 |

## Restored State by Service

| Service | Restored states |
| --- | ---: |
| inventory-service | 16,542 |
| sales-service | 17,289 |

## Per Run Detail

| Scenario | Run ID | Attempted runs | Completed runs | Failed runs | State source runs | Service | Event source | State restored | Count | Source |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | ---: | --- |
| EQUAL_INVENTORY_SYNC | 1782193283 | 6,300 | 6,300 | 0 | 6,300 | sales-service | product.created | product_cache | 6,300 | estimated-from-completed-vusers |
| EQUAL_INVENTORY_SYNC | 1782193283 | 6,300 | 6,300 | 0 | 6,300 | inventory-service | product.created | inventory | 6,300 | estimated-from-completed-vusers |
| EQUAL_PRODUCT_CRUD | 1782192876 | 6,300 | 3,912 | 2,388 | 3,912 | sales-service | product.created | product_cache | 3,912 | estimated-from-completed-vusers |
| EQUAL_PRODUCT_CRUD | 1782192876 | 6,300 | 3,912 | 2,388 | 3,912 | inventory-service | product.created | inventory | 3,912 | estimated-from-completed-vusers |
| EQUAL_PRODUCT_CRUD | 1782192876 | 6,300 | 3,912 | 2,388 | 3,912 | sales-service | product.updated | product_cache | 3,912 | estimated-from-completed-vusers |
| EQUAL_SALES_TRANSACTION | 1782193653 | 3,240 | 3,165 | 75 | 3,165 | sales-service | product.created | product_cache | 3,165 | estimated-from-completed-vusers |
| EQUAL_SALES_TRANSACTION | 1782193653 | 3,240 | 3,165 | 75 | 3,165 | inventory-service | product.created | inventory | 3,165 | estimated-from-completed-vusers |
| EQUAL_SALES_TRANSACTION | 1782193653 | 3,240 | 3,165 | 75 | 3,165 | inventory-service | sales.transaction-completed | inventory_stock | 3,165 | estimated-from-completed-vusers |

## Counting Rules

- `product.created` restores product reference state in `sales-service` and initializes inventory state in `inventory-service`.
- `product.updated` restores the `sales-service` product cache projection.
- `sales.transaction-completed` restores stock state in `inventory-service`; current benchmark payload has one item per transaction.
- If counters matching rehydration/state replay are present in Artillery output, those counters override fallback estimates for the same service.
- State Rehydration Time follows the benchmark aggregator model: `200ms + (latency_p95 * 2.0) + deterministic overhead`, unless `hybrid.rehydration_time_ms` exists.
- Restored-state count uses completed virtual users first. If no completed users are recorded but attempts exist, it falls back to attempted users so failed benchmark runs still show event-sourcing workload capacity.
