# Python
Conventions for writing clean, idiomatic Python with type hints and tests.

## Project Layout
- Use src-layout: `src/` for application code, `tests/` at the repo root.
- Pin dependencies with version ranges in `pyproject.toml` or `requirements.txt`. Separate dev dependencies.
- Place configuration in environment variables or a `config` module; validate required config at startup.

## Code Style
- Format with Black (88 char line length). Sort imports with isort. Run `ruff` or `flake8` for linting.
- Follow PEP 8 naming: `snake_case` for functions/variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants.
- Prefer absolute imports over relative. Use `__all__` to control public API of modules.
- Read the file you are editing before making changes — match existing style and patterns.

## Type Hints
- Annotate all function parameters and return types. Use `mypy` (or `pyright`) for type checking.
- Use `X | None` (PEP 604) instead of `Optional[X]` for Python 3.10+; keep `Optional` if the project targets older Python.
- Use `Protocol` for structural/duck typing instead of abstract base classes.
- Define domain types in a `types.py` or inline near usage — not scattered across unrelated modules.

## Error Handling
- Define custom exception classes for domain errors (inherit from a project base or `Exception`).
- Catch specific exceptions, never bare `except:`. Log before re-raising if the error needs visibility.
- Return early on failure conditions — avoid deep nesting from guard clauses.

## Database
- Use SQLAlchemy ORM (or the project's existing ORM). Define models in dedicated `models/` modules.
- Run migrations with Alembic; generate migration scripts, review them before applying.
- Use connection pooling; configure it based on expected concurrency.

## Testing
- Use pytest. Write tests in `tests/` mirroring the `src/` structure.
- Use fixtures for setup/teardown. Use `pytest-mock` for mocking.
- Run the test suite and confirm it passes before declaring work done.

## Documentation
- Use Google-style docstrings on public functions and classes.
- Keep inline comments minimal — the code should explain "what" and "why" sparingly, the type system explains the contract.
