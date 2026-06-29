# Node.js
Conventions for building server-side applications with Node.js and Express — run tests after every change.

## Project Layout
- Separate routes, controllers, middleware, models, and services into their own directories.
- Keep route definitions thin — delegate to controller or service functions.
- Store configuration in environment variables (`.env`). Validate required vars at startup.
- Read the existing project structure before adding new modules — follow the established layout.

## Express Conventions
- Use `express.Router()` per domain/resource. Mount under versioned path prefixes (`/api/v1/...`).
- Register middleware in order: CORS, body parser, auth, routes, error handler (always last).
- Write a centralized error-handling middleware `(err, req, res, next)` — never let unhandled errors return 500 without context.

## Async and Error Handling
- Always `await` promises. Unhandled rejections crash the process.
- Wrap async route handlers with a helper (`asyncHandler`) or use a router that supports async handlers natively.
- Use `process.on('unhandledRejection')` as a safety net, not primary error handling.
- Return structured error responses with consistent shape (e.g., `{ error: { code, message } }`) and appropriate HTTP status codes.

## Security
- Use `helmet` for security headers, `cors` with explicit origins, and `express-rate-limit` for endpoint throttling.
- Validate and sanitize all user input — use a schema validator (Zod, Joi) on every route that accepts input.
- Never log or expose stack traces, secrets, or full error details in production responses.

## Database
- Use the project's ORM or query builder. Keep raw SQL in dedicated query files, not inline in routes.
- Use connection pooling. Configure pool size based on expected concurrency.
- Run migrations as part of deployment — never hand-edit schema in production.

## Authentication
- Use JWT for stateless auth or session-based auth depending on the project. Hash passwords with `bcrypt`.
- Implement role-based access control at the middleware level.
- Handle auth errors with appropriate status codes (401, 403) — never leak auth internals.

## Testing
- Write integration tests for API routes using the project's test runner (Jest, Vitest, Mocha) with `supertest`.
- Run `npm test` or `npx jest` and confirm all tests pass before finishing.

## Verification
- Run `npm run lint` or `npx eslint .` to catch style issues.
- Run the test suite and confirm a green result before declaring work done.
- Restart the server (`npm run dev`) to verify runtime behavior when appropriate.
