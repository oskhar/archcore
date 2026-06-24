# Data Model: Kafka Transport & Service Mesh

## Infrastructure Components

### Redpanda (Kafka) Configuration
| Property | Value | Description |
|----------|-------|-------------|
| `KAFKA_BROKERS` | `localhost:9092` | Broker address for local dev |
| `topic: health-ping` | N/A | Topic for cross-service connectivity verification |

### Microservice Port Mapping
| Service | HTTP Port | Kafka Client ID |
|---------|-----------|-----------------|
| `api-gateway` | 3000 | `gateway-client` |
| `product-service` | 3001 | `product-client` |
| `inventory-service` | 3002 | `inventory-client` |
| `sales-service` | 3003 | `sales-client` |

## Service Structure (Preserved from 011)
All services follow the DDD structure:
- `src/domain/`: Core logic.
- `src/application/`: Handlers and Kafka event definitions.
- `src/infrastructure/`: Kafka transport and TypeORM.
- `src/interface/`: Controllers (HTTP and Kafka Patterns).
