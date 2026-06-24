# Quickstart: scs-hybrid--inventory-service

## Overview

The inventory service manages stock levels for products in the hybrid architecture. It communicates via the API Gateway for external requests and uses Kafka for internal event-driven updates.

## Prerequisites

- Docker and Docker Compose (for MySQL and Redpanda/Kafka)
- Node.js 20+ and npm
- `archkit_inventory` database created in the MySQL container (managed by `scs-hybrid--setup-database`)

## Installation

```bash
# From repository root
cd apps/hybrid
npm install
```

## Running the service

```bash
# From apps/hybrid directory
npx turbo run dev --filter=inventory-service
```

## Running tests

```bash
# From apps/hybrid/apps/inventory-service
npm test
```

## Example API Interaction via Gateway

### Adjust stock
```bash
curl -X POST http://localhost:3000/inventory/adjust \
     -H "Content-Type: application/json" \
     -d '{"productId": "...", "delta": 10}'
```

### Get stock
```bash
curl http://localhost:3000/inventory/...
```
