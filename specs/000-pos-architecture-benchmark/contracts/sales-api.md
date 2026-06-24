# API Contract: Sales Service

## Endpoints

### POST /sales/transaction
Executes a sales transaction.

**Request Payload**:
```json
{
  "items": [
    { "productId": "uuid", "quantity": 2 },
    { "productId": "uuid", "quantity": 1 }
  ]
}
```

**Response**:
- `201 Created`: Transaction recorded and stock reduction triggered.
- `400 Bad Request`: Validation failure (empty items).
- `200 OK (with Warning)`: Transaction completed, but stock became negative for one or more items.

### GET /sales/transactions/:id
Returns details of a specific transaction.

**Response**:
- `200 OK`: Transaction details (total price, items, status).
- `404 Not Found`: Transaction ID does not exist.
