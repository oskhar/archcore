# Quickstart: Setup Kafka & Core Microservices

## Infrastructure Setup

1. Start the hybrid infrastructure (MySQL + Redpanda):
```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

## Running the Development Environment

1. Navigate to the hybrid monorepo:
```bash
cd apps/hybrid/
```

2. Start all services in watch mode:
```bash
npx turbo dev
```
*Note: The `dev` task is configured to start dependencies before dependent services.*

## Verifying Cross-Service Connectivity

1. Check HTTP health checks:
   - Gateway: `http://localhost:3000/health`
   - Product: `http://localhost:3001/health`
   - Inventory: `http://localhost:3002/health`
   - Sales: `http://localhost:3003/health`

2. Trigger Kafka Ping (Diagnostic):
```bash
# Example (assuming gateway has a diagnostic endpoint)
curl http://localhost:3000/diagnostics/kafka-ping
```
Verify in the `inventory-service` logs that the message was received.
