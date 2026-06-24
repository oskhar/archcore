# Event Schemas (Kafka)

## Product Domain
- **Topic**: `product.created`
- **Payload**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "price": "number",
    "timestamp": "ISO8601"
  }
  ```

## Sales Domain
- **Topic**: `sales.transaction-completed`
- **Payload**:
  ```json
  {
    "id": "uuid",
    "total": "number",
    "items": [
      {
        "productId": "uuid",
        "quantity": "number"
      }
    ],
    "timestamp": "ISO8601"
  }
  ```

## Inventory Domain
- **Topic**: `inventory.stock-updated`
- **Payload**:
  ```json
  {
    "productId": "uuid",
    "quantity": "number",
    "timestamp": "ISO8601"
  }
  ```
