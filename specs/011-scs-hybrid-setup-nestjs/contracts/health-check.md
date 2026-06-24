# Health Check Contract: Hybrid Microservices

## Overview
Standard endpoint that every hybrid microservice MUST expose for status monitoring and architecture verification.

## Endpoint: `GET /health`

### Request
- **Method**: `GET`
- **Path**: `/health`

### Response (200 OK)
- **Status Code**: `200`
- **Body**:
```json
{
  "status": "up",
  "service": "[service-name]",
  "version": "1.0.0",
  "architecture": "hybrid",
  "features": {
    "cqrs": true,
    "eventSourcing": true,
    "kafka": false
  }
}
```

## Implementation Rules
1. **Response Time**: Should be < 100ms.
2. **Architecture Marker**: The `architecture` field MUST be set to `"hybrid"`.
3. **Features Check**: Reflects the current SCS-enabled capabilities.
