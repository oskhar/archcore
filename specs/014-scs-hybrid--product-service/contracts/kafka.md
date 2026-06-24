# Kafka Event Contracts: Product Domain

## Topic: `product-events`

### 1. Product Created
- **Event**: `ProductCreated`
- **Payload**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "price": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```

### 2. Product Updated
- **Event**: `ProductUpdated`
- **Payload**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "price": "number",
    "updatedAt": "date"
  }
  ```

### 3. Product Deleted
- **Event**: `ProductDeleted`
- **Payload**:
  ```json
  {
    "id": "uuid",
    "deletedAt": "date"
  }
  ```
