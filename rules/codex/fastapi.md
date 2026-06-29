# FastAPI
Conventions for building async Python APIs with FastAPI — run tests and type-checks before finishing.

## Project Layout
- Use src-layout: `src/` for application code, `tests/` at the repo root.
- Organize routers by domain under `routers/` or `api/`. Include via `app.include_router()`.
- Keep Pydantic models and database models in dedicated `schemas/` and `models/` directories.
- Read the existing project structure before adding new endpoints.

## Routing and Endpoints
- Use `async def` for route handlers that call async code (DB, HTTP). Use `def` only for CPU-bound short handlers.
- Group related endpoints with `APIRouter` and prefix them (`router = APIRouter(prefix="/users", tags=["users"])`).
- Use FastAPI's dependency injection (`Depends()`) for shared logic — auth checks, database sessions, pagination params.

## Pydantic Models
- Define separate schemas for request, response, and persistence (create, update, read variants).
- Use Pydantic v2 `model_config` with `from_attributes = True` for ORM mode — not v1 `class Config`.
- Use `Field()` for validation constraints (min/max length, regex patterns, examples).
- Leverage `Annotated` types for reusable dependencies and metadata.

## Validation and Errors
- Validate all input with Pydantic models — never trust raw `Request` body without a schema.
- Return appropriate HTTP status codes: 201 for creation, 204 for deletion, 422 for validation errors.
- Use `HTTPException` for known error cases. Register a custom exception handler for consistent error response shapes.

## Database
- Use SQLAlchemy with async support (AsyncSession) or the project's existing ORM.
- Use Alembic for migrations. Review generated migrations before applying.
- Pass the DB session via `Depends(get_db)` — do not create sessions inside route handlers.

## Authentication
- Use `OAuth2PasswordBearer` or `HTTPBearer` for token-based auth.
- Validate tokens in a dependency and inject the current user into route handlers.
- Hash passwords with `passlib` (bcrypt). Never store plaintext passwords.

## Security
- Configure CORS with explicit allowed origins — do not use `*` in production.
- Use rate limiting on public endpoints. Validate all input (Pydantic handles most of this).

## Testing
- Use pytest with `httpx.AsyncClient` and FastAPI's `TestClient` for integration tests.
- Write tests for happy path and error cases (validation, auth, not-found).
- Run `pytest` and confirm all tests pass before finishing.

## Configuration
- Use `pydantic-settings` (`BaseSettings`) for config with environment variable loading and validation.
- Define all required settings with types. The app should fail fast on missing config.

## Verification
- Run `pytest` for tests, `mypy src/` or `pyright` for types, `ruff check .` for lint.
- Confirm all checks pass before declaring work done.
