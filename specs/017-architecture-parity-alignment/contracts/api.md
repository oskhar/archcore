# API Contract: OpenAPI Specification

This contract defines the unified endpoints and their corresponding status codes to be documented in the OpenAPI specification.

## Product Service

- **POST /products**
  - Request: `CreateProductDto`
  - Response 201: `Product`
  - Response 400: `StandardErrorResponse` (Validation failure)

- **GET /products**
  - Response 200: `Product[]`

- **GET /products/:id**
  - Response 200: `Product`
  - Response 404: `StandardErrorResponse`

- **PATCH /products/:id**
  - Request: `UpdateProductDto`
  - Response 200: `Product`
  - Response 400: `StandardErrorResponse` (Validation failure)
  - Response 404: `StandardErrorResponse`

- **DELETE /products/:id**
  - Response 204: No Content
  - Response 404: `StandardErrorResponse`

---

## Sales Service

- **POST /sales/transaction**
  - Request: `CreateTransactionDto`
  - Response 201: `SalesTransaction`
  - Response 400: `StandardErrorResponse` (Validation or Stock failure)

- **GET /sales/transactions/:id**
  - Response 200: `SalesTransaction`
  - Response 404: `StandardErrorResponse`

---

## Inventory Service

- **POST /inventory/adjust**
  - Request: `AdjustStockDto`
  - Response 201: No Content
  - Response 400: `StandardErrorResponse`

- **GET /inventory/:productId**
  - Response 200: `InventoryBalance`

---

## Diagnostics

- **GET /health**
  - Response 200: Object `{ status: string, service: string, version: string, architecture: string, features: object }`

- **GET /diagnostics/ping**
  - Response 200: Object `{ status: string, receivedAt: string, source: string }`
