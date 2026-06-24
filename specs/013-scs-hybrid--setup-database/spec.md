# Feature: SCS Hybrid Database Setup

## Objective
Set up isolated MySQL database instances for each microservice in the hybrid architecture using Docker.

## Requirements
- Each service (product, inventory, sales) must have its own isolated MySQL instance.
- Database configurations should be manageable via Docker Compose.
- Services must connect to their respective databases using TypeORM and mysql2.
- Environment variables should be used for database connectivity.

## Tasks
- Update `infrastructure/docker/docker-compose.yml` with separate MySQL services.
- Configure NestJS services to connect to their specific database instances.
- Ensure database initialization and health checks are properly configured.
