# Data Model: OpenAPI Schemas

This document defines the unified schemas to be included in the OpenAPI documentation.

## Product Domain

### Product Schema
- **id**: string (UUID)
- **name**: string, min(1), max(255)
- **price**: number, positive()
- **createdAt**: string (date-time)
- **updatedAt**: string (date-time)

### CreateProductDto
- **name**: string, min(1), max(255)
- **price**: number, positive()

### UpdateProductDto
- **name**: string, min(1), max(255) (optional)
- **price**: number, positive() (optional)

---

## Sales Domain

### SalesItem Schema
- **productId**: string (UUID)
- **quantity**: number, int(), positive()
- **unitPrice**: number (positive)

### SalesTransaction Schema
- **id**: string (UUID)
- **totalPrice**: number (positive)
- **status**: string (enum: COMPLETED)
- **items**: array of `SalesItem`
- **createdAt**: string (date-time)

### CreateTransactionDto
- **items**: array of objects `{ productId: string (UUID), quantity: number (int, positive) }`, non-empty

---

## Inventory Domain

### InventoryBalance Schema
- **productId**: string (UUID)
- **quantity**: number (int)

### AdjustStockDto
- **productId**: string (UUID)
- **delta**: number (int)

---

## Error Schema

### Standard Error Response
- **statusCode**: number
- **message**: string (or array of strings for validation errors)
- **error**: string (optional)
- **errors**: array of strings (optional)
- **timestamp**: string (date-time, optional)
- **path**: string (optional)
