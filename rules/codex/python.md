# Python
Conventions for writing clean, idiomatic Python with type hints and tests — run formatters and tests before finishing.

## Project Layout
- Use src-layout: `src/` for application code, `tests/` at the repo root.
- Pin dependencies with version ranges in `pyproject.toml` or `requirements.txt`. Separate dev dependencies.
- Place configuration in environment variables or a `config` module. Validate required config at startup.

## Code Style
- Format with Black (88 char line length). Sort imports with isort. Lint with `ruff` or `flake8`.
- Follow PEP 8 naming: `snake_case` for functions/variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants.
- Prefer absolute imports over relative. Use `__all__` to control the public API of modules.
- Read the file you are editing before making changes — match existing style and patterns.

## Type Hints
- Annotate all function parameters and return types. Use `mypy` (or `pyright`) for type checking.
- Use `X | None` (PEP 604) for Python 3.10+; keep `Optional[X]` for older versions.
- Use `Protocol` for structural/duck typing instead of abstract base classes.
- Define domain types in a `types.py` or inline near usage.

## Error Handling
- Define custom exception classes for domain errors (inherit from a project base or `Exception`).
- Catch specific exceptions, never bare `except:`. Log before re-raising if the error needs visibility.
- Return early on failure conditions — avoid deep nesting from guard clauses.

## Flask Conventions
- Use the Flask factory pattern. Organize routes with Blueprints.
- Use Flask-SQLAlchemy for database, Flask-Login for authentication.
- Handle errors with proper HTTP status codes and user-facing messages.

## Database
- Use SQLAlchemy ORM (or the project's existing ORM). Define models in dedicated `models/` modules.
- Run migrations with Alembic — generate, review, then apply. Never hand-edit schema in production.
- Use connection pooling; configure based on expected concurrency.

## Testing
- Use pytest. Write tests in `tests/` mirroring the `src/` structure.
- Use fixtures for setup/teardown. Use `pytest-mock` for mocking.
- Run `pytest` and confirm all relevant tests pass before finishing.
- Run `pytest --cov` to check coverage when adding new code.

## Verification
- Run `black --check .` and `ruff check .` (or the project's lint command) before finishing.
- Run `mypy src/` or `pyright` to verify type correctness.
- Run `pytest` and confirm a green result.
