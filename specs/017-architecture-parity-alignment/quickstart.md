# Quickstart: OpenAPI Documentation

To verify the generated OpenAPI specification:

1. **Locate the file**: Find `docs/openapi.yaml` in the project root.
2. **Validate YAML**: Ensure the file is well-formed YAML.
3. **Check against Swagger Editor**: Copy the content of `docs/openapi.yaml` into [Swagger Editor](https://editor.swagger.io/) to verify it passes OpenAPI 3.0 validation.
4. **Verify Scenarios**:
   - Check that `400` errors include validation error structures.
   - Check that `404` errors are documented for all single-resource fetch endpoints.
   - Check that the `Product`, `Sales`, `Inventory`, and `Diagnostics` tags are correctly assigned.
