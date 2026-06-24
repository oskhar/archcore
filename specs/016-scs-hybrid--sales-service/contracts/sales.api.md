# Sales Service API Contract

## Base Path: `/sales` (via API Gateway)

### Create Sale Transaction (POST)

**Endpoint**: `/sales/transaction`
**Description**: Creates a new sale transaction with multiple items.

**Request Body**:
```json
{
  "items": [
    {
      "productId": "UUID",
      "quantity": 2
    }
  ]
}
```

**Response (201 Created)**:
```json
{
  "id": "UUID",
  "totalPrice": 150.00,
  "status": "COMPLETED",
  "items": [...]
}
```

### Retrieve Sale Transaction (GET)

**Endpoint**: `/sales/transactions/:id`
**Description**: Fetches details of a specific transaction.

**Response (200 OK)**:
```json
{
  "id": "UUID",
  "totalPrice": 150.00,
  "status": "COMPLETED",
  "items": [...]
}
```

## Kafka Events (Emitted)

### Event: `SaleCompleted`
**Topic**: `sales.transaction-completed`
**Payload**:
```json
{
  "transactionId": "UUID",
  "items": [
    {
      "productId": "UUID",
      "quantity": 2
    }
  ],
  "timestamp": "ISO8601"
}
```

## Kafka Events (Consumed)

### Event: `ProductCreated`
**Topic**: `product.created`
**Payload**:
```json
{
  "id": "UUID",
  "name": "string",
  "price": 75.00
}
```
