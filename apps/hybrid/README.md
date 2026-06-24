# Hybrid Architecture Monorepo

This directory contains the hybrid microservices architecture implementation for ArchKit.

## Structure

- `apps/`: Individual microservices (NestJS, Kafka consumers/producers).
  - `api-gateway`: Entry point (port 3000).
  - `product-service`: CQRS service (port 3001).
  - `inventory-service`: Kafka consumer (port 3002).
  - `sales-service`: Kafka listener (port 3003).
- `packages/`: Shared configurations and internal libraries.

## Infrastructure

The hybrid stack requires Kafka for event-driven communication. For local development, **Redpanda** (a Kafka-compatible stream platform) is used.

1. Ensure Docker is running.
2. Start infrastructure from repo root: `docker compose -f infrastructure/docker/docker-compose.yml up -d`
3. Verify Redpanda is reachable at `localhost:9092`.

## Getting Started

1. Navigate to this directory: `cd apps/hybrid/`
2. Install dependencies: `npm install`
3. Run tasks via Turbo:
   - `npm run start:dev` (or `npx turbo start:dev`)
   - `npm run build` (or `npx turbo build`)
   - `npm run lint`
   - `npm run test`

## Architecture Isolation

This monorepo is isolated from the `apps/monolith/` to ensure architectural parity experiments are clean and measurable. Each microservice follows a simplified Clean Architecture / DDD structure to accommodate CQRS.
