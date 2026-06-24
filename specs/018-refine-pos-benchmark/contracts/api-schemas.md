# API Schemas (REST)

## Product CRUD
- **POST /products**: Create a product.
- **GET /products**: List all products.
- **PUT /products/:id**: Update product details.

## Inventory Management
- **POST /inventory/initialize**: Set initial stock for a product.
- **PATCH /inventory/adjust**: Increase or decrease stock levels.

## Sales Transaction
- **POST /sales/transaction**: Process a sale.
- **GET /sales/history**: Retrieve all completed transactions.

## Metric Collection
- **GET /metrics**: Retrieve benchmark data (throughput, latency, error rates).
- **POST /metrics/capture**: Trigger a point-in-time metric capture during load tests.
