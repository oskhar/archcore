# API Contract: Inventory (Monolith)

## Endpoints

### POST /inventory/adjust
Adjust stock level for a product.

**Request Payload**:
```json
{
  "productId": "uuid",
  "delta": 10
}
```

**Response**:
- `201 Created`: Adjustment applied.
```json
{
  "id": "uuid",
  "productId": "uuid",
  "quantity": 10,
  "warnings": []
}
```

### GET /inventory/:productId
Retrieve current stock for a product.

**Response**:
- `200 OK`: Current quantity.
```json
{
  "productId": "uuid",
  "quantity": 10
}
```
- `404 Not Found`: If product exists but no inventory record yet (or product doesn't exist).
