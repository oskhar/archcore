# Research: 008-scs-baseline--testing-validation

## 1. Jest Parallelism and Database Synchronization

**Finding**: The current E2E test failures (`Table already exists`, `Deadlock`) are caused by Jest running tests in parallel while TypeORM has `synchronize: true` and `dropSchema: true` in the test environment. Each test suite attempts to reset the shared database at the same time.

**Decision**: Run E2E tests sequentially using `--runInBand` (or `-i`) in the `npm run test:e2e` script. This ensures that only one test suite interacts with the database at a time, allowing `synchronize` and `cleanupDatabase` to work reliably.

**Rationale**: While separate databases per test suite would allow parallelism, it is more complex to set up. Sequential execution is sufficient for the current baseline and resolves the immediate issue.

## 2. Request/Response Logging in E2E Tests

**Finding**: The user wants to see all requests and responses in E2E tests.

**Decision**: Implement a global `LoggingInterceptor` in `apps/monolith/test/test-helper.ts`. This interceptor will be applied to the NestJS application during test initialization using `app.useGlobalInterceptors()`.

**Implementation Detail**:
```typescript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    console.log(`[REQUEST] ${method} ${url}\nBody: ${JSON.stringify(body, null, 2)}`);

    return next.handle().pipe(
      tap((responseBody) => {
        const response = context.switchToHttp().getResponse();
        console.log(`[RESPONSE] ${response.statusCode}\nBody: ${JSON.stringify(responseBody, null, 2)}`);
      }),
    );
  }
}
```

## 3. Alternatives Considered

**Separate Databases**: Using `DB_NAME_TEST` with a suffix per worker (e.g., `archkit_monolith_test_1`).
- **Rejected because**: Requires more complex setup in CI and local environments to pre-create multiple databases.

**Custom Middleware**: Logging via middleware instead of interceptors.
- **Rejected because**: Interceptors have easier access to the response body after it has been processed by NestJS controllers.
