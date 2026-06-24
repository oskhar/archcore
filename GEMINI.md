# archkit Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-31

## Active Technologies
- MySQL (isolated per service in Hybrid, shared in Monolith) (000-pos-architecture-benchmark)
- TypeScript / Node.js 20+ + NestJS, TypeORM, Zod, MySQL, Kafka, Docker, Docker Compose (scs-hybrid--production-docker)
- MySQL (Independent instances per microservice in hybrid; single instance in monolith) (scs-hybrid--production-docker)
- Bash / Git + Git, Speckit CLI, `sed` (or similar for replacement) (003-fix-scs-naming)
- N/A (Repository Metadata) (003-fix-scs-naming)
- JSON (Config) / Node.js (Tooling context) + commitizen, cz-git (004-czrc-commit-emojis)
- TypeScript 5.7 (Node.js 20+) + NestJS 11, TypeORM 0.3.28, Zod 4.3, @nestjs/typeorm (005-scs-baseline--product-domain)
- MySQL 8.0 (005-scs-baseline--product-domain)
- TypeScript 5.7 (Node.js 20+) + NestJS 11, TypeORM 0.3.28, Jest, Supertest (008-scs-baseline--testing-validation)
- MySQL 8.0 (Docker) (008-scs-baseline--testing-validation)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, TypeORM 0.3.28, Jest 30.0.0, Supertest 7.0.0 (008-scs-baseline--testing-validation)
- MariaDB 11.8 (locally available) (008-scs-baseline--testing-validation)
- TypeScript 5.7 / Node.js 20+ + TurboRepo, NPM Workspaces (009-scs-hybrid-setup-turbo)
- N/A (Infrastructure setup) (009-scs-hybrid-setup-turbo)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, @nestjs/cqrs, TypeORM 0.3.28, Zod 3.x (011-scs-hybrid-setup-nestjs)
- MySQL 8.0 (via TypeORM) (011-scs-hybrid-setup-nestjs)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, @nestjs/microservices, kafkajs, TurboRepo (012-scs-hybrid-setup-kafka)
- MySQL 8.0, Kafka (Redpanda or standard Kafka) (012-scs-hybrid-setup-kafka)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, TypeORM 0.3.28, mysql2 3.12.0, Docker, Docker Compose (013-scs-hybrid--setup-database)
- MySQL 8.0 (Isolated per service) (013-scs-hybrid--setup-database)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, `@nestjs/cqrs`, `@nestjs/microservices` (Kafka), TypeORM 0.3.28, Zod (014-scs-hybrid--product-service)
- MySQL 8.0 (Isolated `archkit_product` database) (014-scs-hybrid--product-service)
- TypeScript 5.7 / Node.js 20+ + NestJS 11 + @nestjs/cqrs + @nestjs/microservices + TypeORM 0.3.28 + Zod 3.x (015-scs-hybrid--inventory-service)
- MySQL 8.0 (Isolated `archkit_inventory` database) (015-scs-hybrid--inventory-service)
- MySQL 8.0 (Isolated `archkit_sales` database) (016-scs-hybrid--sales-service)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, TypeORM 0.3.28, Zod 3.x, @nestjs/cqrs (Hybrid), @nestjs/microservices (Kafka, Hybrid) (017-architecture-parity-alignment)
- MySQL 8.0 (Isolated per service in Hybrid, single DB in Monolith) (017-architecture-parity-alignment)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, Zod 3.x, js-yaml (for generation) (017-architecture-parity-alignment)
- N/A (Documentation) (017-architecture-parity-alignment)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, TypeORM 0.3.28, Zod 3.x, RabbitMQ, Kafka, TurboRepo (018-refine-pos-benchmark)
- MySQL 8.0, PostgreSQL (Event Store) (018-refine-pos-benchmark)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, TypeORM 0.3.28, Zod 3.x, RabbitMQ, Kafka, TurboRepo, Artillery, Chart.js (or similar for graph generation) (018-refine-pos-benchmark)
- TypeScript 5.7 (Node.js 20+) + NestJS 11, TypeORM 0.3.28, Zod 3.x, KafkaJS, TurboRepo, Artillery (018-refine-pos-benchmark)
- TypeScript 5.7 + Chart.js 4.x, chartjs-node-canvas, Artillery (018-refine-pos-benchmark)
- TypeScript 5.7 / Node.js 20+ + NestJS 11, TypeORM 0.3.28, Zod 3.x, KafkaJS, TurboRepo, Artillery, Chart.js 4.x, PlantUML (018-refine-pos-benchmark)
- MySQL 8.0 (Isolated per service in Hybrid, single DB in Monolith), PostgreSQL (Event Store) (018-refine-pos-benchmark)
- Node.js 20+, TypeScript 5.7 + NestJS 11, TypeORM 0.3.28, Zod 3.x, KafkaJS, TurboRepo, Artillery, Chart.js 4.x, chartjs-node-canvas (018-refine-pos-benchmark)
- MySQL 8.0 (Isolated per service in Hybrid, single DB in Monolith), JSON/JSONL for local metrics storage. (018-refine-pos-benchmark)

- TypeScript (Node.js 20+) + NestJS, TypeORM, Zod, MySQL, Kafka, @nestjs/cqrs, TurboRepo (000-pos-architecture-benchmark)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript (Node.js 20+): Follow standard conventions

## Recent Changes
- 018-refine-pos-benchmark: Added Node.js 20+, TypeScript 5.7 + NestJS 11, TypeORM 0.3.28, Zod 3.x, KafkaJS, TurboRepo, Artillery, Chart.js 4.x, chartjs-node-canvas
- 018-refine-pos-benchmark: Added TypeScript 5.7 / Node.js 20+ + NestJS 11, TypeORM 0.3.28, Zod 3.x, KafkaJS, TurboRepo, Artillery, Chart.js 4.x, PlantUML
- 018-refine-pos-benchmark: Added TypeScript 5.7 + Chart.js 4.x, chartjs-node-canvas, Artillery


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
