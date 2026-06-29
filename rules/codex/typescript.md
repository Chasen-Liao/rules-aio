# TypeScript
Conventions for writing type-safe TypeScript code — run `tsc` to verify before finishing.

## Type System
- Use `interface` for object shapes; use `type` for unions, intersections, mapped types, and utilities.
- Never use `any`. Use `unknown` when the type is truly unknown, then narrow with type guards.
- Use discriminated unions for state machines and tagged data (`{ type: 'loading' } | { type: 'success'; data: T }`).
- Use `readonly` for properties that should not be mutated after creation.
- Leverage built-in utility types (`Pick`, `Omit`, `Partial`, `Required`, `Record`) instead of redefining them.

## Strictness
- Enable `strict: true` in `tsconfig.json`. Do not relax strict flags to suppress errors — fix the types.
- Provide explicit return types on exported/public functions; let the compiler infer for local helpers.
- Avoid type assertions (`as`) unless interfacing with untyped third-party code. Use type guards or `satisfies` instead.

## Code Organization
- Co-locate type definitions with the code that uses them. Extract to a `types.ts` or `types/` directory only when shared across modules.
- Use barrel exports (`index.ts`) to consolidate a module's public API.
- Read existing type patterns in the project before introducing new ones.

## Naming
- `PascalCase` for types, interfaces, enums, and classes.
- `camelCase` for variables, functions, and methods.
- `UPPER_SNAKE_CASE` for constants.
- Use boolean prefixes: `is`, `has`, `should`, `can` (e.g., `isLoading`, `hasPermission`).
- Suffix React prop interfaces with `Props` (e.g., `ButtonProps`) only if the project already follows this convention.

## Error Handling
- Define custom error classes for domain-specific errors so callers can check with `instanceof` or `errors.Is()`.
- Use `try/catch` with typed catch; never silently swallow errors.

## Generics
- Use generics for reusable utilities and data structures. Prefer type constraints (`extends`) to keep generics meaningful.
- Use function overloads when a function has distinct calling signatures with different return types.

## Verification
- Run `npx tsc --noEmit` to check for type errors after any `.ts` or `.tsx` change.
- Run the project's lint command (`eslint .`, `npx biome check`) to catch style issues.
- Run `npm test` and confirm relevant tests pass before finishing.
