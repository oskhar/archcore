# API Contract: Inventory Service

## Endpoints

### POST /inventory/adjust
Adjusts the stock for a product.

**Request Payload**:
```json
{
  "productId": "uuid",
  "delta": -5
}
```

**Response**:
- `200 OK`: Stock adjusted.
```json
{
  "productId": "uuid",
  "newQuantity": 15,
  "warnings": []
}
```
- `400 Bad Request`: Product does not exist.
- `200 OK (with Warning)`: Stock became negative.
```json
{
  "productId": "uuid",
  "newQuantity": -2,
  "warnings": ["Stock is negative"]
}
```

### GET /inventory/:productId
Returns current stock for a product.

**Response**:
- `200 OK`: Current quantity.
- `404 Not Found`: Product not tracked in inventory.
