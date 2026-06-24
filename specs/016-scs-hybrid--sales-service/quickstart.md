# Quickstart: scs-hybrid--sales-service

## Overview

The sales service manages transactions in the hybrid architecture. It maintains a local product cache via Kafka and emits `SaleCompleted` events to trigger inventory updates.

## Prerequisites

- Docker and Docker Compose (MySQL and Redpanda/Kafka)
- Node.js 20+ and npm
- `archkit_sales` database created (managed by `scs-hybrid--setup-database`)

## Installation

```bash
# From repository root
cd apps/hybrid
npm install
```

## Running the service

```bash
# From apps/hybrid directory
npx turbo run dev --filter=sales-service
```

## Running tests

```bash
# From apps/hybrid/apps/sales-service
npm test
```

## Example API Interaction via Gateway

### Create sale
```bash
curl -X POST http://localhost:3000/sales/transaction \
     -H "Content-Type: application/json" \
     -d '{"items": [{"productId": "...", "quantity": 1}]}'
```

### Get transaction
```bash
curl http://localhost:3000/sales/transactions/...
```
