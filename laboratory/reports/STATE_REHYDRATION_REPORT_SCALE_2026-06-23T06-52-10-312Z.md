# State Rehydration Report

Generated at: 2026-06-23T06:52:10.313Z
Filter: SCALE
Scope: HYBRID architecture only

## Summary

- Result files analyzed: 3
- Total restored states: 237,009
- Average State Rehydration Time: 14884.33 ms
- Total State Rehydration Time: 44653.00 ms
- Counter mode: scenario-based fallback estimation

## State Rehydration Time

| Scenario                | Run ID     | Latency p95 | State Rehydration Time | Time source              |
| ----------------------- | ---------- | ----------: | ---------------------: | ------------------------ |
| SCALE_INVENTORY_SYNC    | 1782196383 |  6838.00 ms |            13961.00 ms | derived-from-latency-p95 |
| SCALE_PRODUCT_CRUD      | 1782195823 |  8352.00 ms |            16987.00 ms | derived-from-latency-p95 |
| SCALE_SALES_TRANSACTION | 1782196945 |  6702.60 ms |            13705.00 ms | derived-from-latency-p95 |

## Restored State by Service

| Service           | Restored states |     |
| ----------------- | --------------: | --- |
| inventory-service |         122,185 |     |
| sales-service     |         114,824 |     |

## Per Run Detail

| Scenario | Run ID | Attempted runs | Completed runs | Failed runs | State source runs | Service | Event source | State restored | Count | Source |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | ---: | --- |
| SCALE_INVENTORY_SYNC | 1782196383 | 59,100 | 33,627 | 25,473 | 33,627 | sales-service | product.created | product_cache | 33,627 | estimated-from-completed-vusers |
| SCALE_INVENTORY_SYNC | 1782196383 | 59,100 | 33,627 | 25,473 | 33,627 | inventory-service | product.created | inventory | 33,627 | estimated-from-completed-vusers |
| SCALE_PRODUCT_CRUD | 1782195823 | 76,800 | 24,612 | 52,188 | 24,612 | sales-service | product.created | product_cache | 24,612 | estimated-from-completed-vusers |
| SCALE_PRODUCT_CRUD | 1782195823 | 76,800 | 24,612 | 52,188 | 24,612 | inventory-service | product.created | inventory | 24,612 | estimated-from-completed-vusers |
| SCALE_PRODUCT_CRUD | 1782195823 | 76,800 | 24,612 | 52,188 | 24,612 | sales-service | product.updated | product_cache | 24,612 | estimated-from-completed-vusers |
| SCALE_SALES_TRANSACTION | 1782196945 | 37,830 | 31,973 | 5,857 | 31,973 | sales-service | product.created | product_cache | 31,973 | estimated-from-completed-vusers |
| SCALE_SALES_TRANSACTION | 1782196945 | 37,830 | 31,973 | 5,857 | 31,973 | inventory-service | product.created | inventory | 31,973 | estimated-from-completed-vusers |
| SCALE_SALES_TRANSACTION | 1782196945 | 37,830 | 31,973 | 5,857 | 31,973 | inventory-service | sales.transaction-completed | inventory_stock | 31,973 | estimated-from-completed-vusers |

## Counting Rules

- `product.created` restores product reference state in `sales-service` and initializes inventory state in `inventory-service`.
- `product.updated` restores the `sales-service` product cache projection.
- `sales.transaction-completed` restores stock state in `inventory-service`; current benchmark payload has one item per transaction.
- If counters matching rehydration/state replay are present in Artillery output, those counters override fallback estimates for the same service.
- State Rehydration Time follows the benchmark aggregator model: `200ms + (latency_p95 * 2.0) + deterministic overhead`, unless `hybrid.rehydration_time_ms` exists.
- Restored-state count uses completed virtual users first. If no completed users are recorded but attempts exist, it falls back to attempted users so failed benchmark runs still show event-sourcing workload capacity.
