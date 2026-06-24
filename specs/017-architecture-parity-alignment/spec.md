# Feature Specification: OpenAPI Documentation

## Description
Generate a comprehensive OpenAPI 3.0 (YAML) specification in the `docs/` directory. This specification must cover all data models, endpoints, and response scenarios (success and error codes) identified in the codebase for both architectures.

## Requirements
- Identify all endpoints in the unified API.
- Document all request bodies and query parameters using Zod schemas as the source of truth.
- Document all possible response status codes (200, 201, 204, 400, 404, 500) and their respective response bodies.
- Output a single `openapi.yaml` file in the project's root `docs/` directory.
- Ensure the documentation is suitable for automated tools and testing.

## Goals
- Provide a single source of truth for the project's API.
- Facilitate testing of response scenarios.
- Enable documentation-driven development and contract testing.
