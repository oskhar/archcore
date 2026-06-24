# Kafka Contract: Cross-Service Verification

## Overview
Defines the message format for verifying connectivity across the hybrid microservice mesh.

## Topic: `health-ping`

### Event: `ConnectivityVerified`
- **Pattern**: `verify-connectivity`
- **Direction**: Any → Any
- **Payload**:
```json
{
  "source": "[service-name]",
  "timestamp": "ISO-8601 string",
  "message": "Speckit Kafka check"
}
```

## Implementation Rules
1. **Producer**: Emits the event when a specific diagnostic endpoint is hit.
2. **Consumer**: Logs the event and optionally responds with a confirmation event.
