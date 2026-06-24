# API Contract: Container Health Check

## Endpoints

### GET /health
Used by the Docker engine to verify the application is running and healthy.

**Response**:
- `200 OK`: System is operational.
  ```json
  {
    "status": "up",
    "timestamp": "2026-03-25T12:00:00Z",
    "services": {
      "database": "connected"
    }
  }
  ```
- `503 Service Unavailable`: System is non-operational.
  ```json
  {
    "status": "down",
    "error": "Database connection failed"
  }
  ```

**Health Check Logic**:
- Checks connection to the assigned domain database.
- Verifies Kafka connectivity (for hybrid only).
- Response time MUST be under 500ms.
