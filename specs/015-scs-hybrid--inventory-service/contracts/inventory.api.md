# Inventory Service API Contract

## Base Path: `/inventory`

### Adjust Stock (POST)

**Endpoint**: `/inventory/adjust`
**Description**: Adjusts the stock level for a specific product by a delta value.

**Request Body**:
```json
{
  "productId": "UUID",
  "delta": 10
}
```

**Response (200 OK)**:
```json
{
  "productId": "UUID",
  "quantity": 25,
  "updatedAt": "ISO8601 Timestamp"
}
```

**Response (400 Bad Request)**:
- Invalid UUID
- Missing fields
- Delta of zero (optional)

### Get Current Stock (GET)

**Endpoint**: `/inventory/:productId`
**Description**: Retrieves the current stock level for a specific product.

**Response (200 OK)**:
```json
{
  "productId": "UUID",
  "quantity": 25
}
```

**Response (404 Not Found)**:
- Product not found in inventory.

## Kafka Events

### Event: `InventoryUpdated`
**Topic**: `inventory.updates`
**Payload**:
```json
{
  "productId": "UUID",
  "newQuantity": 25,
  "delta": 10,
  "timestamp": "ISO8601"
}
```
