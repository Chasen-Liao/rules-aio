# Go
Idiomatic Go: explicit errors, small interfaces, context-first concurrency — run `go vet` and tests before finishing.

## Error Handling
- Always handle errors. Never assign to `_` — if truly safe to ignore, comment why.
- Wrap with context: `fmt.Errorf("doing X: %w", err)`. Use `errors.Is()` and `errors.As()` to inspect.
- Define custom error types (implementing `error`) for domain errors callers need to check programmatically.

## Naming
- Short names for short-lived variables: `i`, `n`, `err`, `ok`.
- No stuttering: `user.ID` not `user.UserID`; `bytes.Buffer` not `bytes.BytesBuffer`.
- Acronyms keep consistent case: `userID`, `httpClient`, `idTTL`.
- Interfaces: name by behavior — `Reader`, `Writer`, `Handler`, `Closer`.

## Interfaces
- Accept interfaces, return concrete types.
- Define interfaces at the call site (where used), not the implementation site.
- Prefer small, single-method interfaces. Combine only when callers always need the full set.

## Concurrency
- Pass `context.Context` as the first parameter to any function that does I/O or could block.
- Call `cancel()` in a `defer` immediately after creating a context.
- Use `sync.WaitGroup` for goroutine groups; `sync.Once` for one-time initialization.
- Use channels to communicate between goroutines; use `sync.Mutex` when sharing mutable state is unavoidable.

## Testing
- Write table-driven tests: define `[]struct{name string; want ...; wantErr bool}` and range over them with `t.Run`.
- Mock via interfaces, not by modifying global state. Accept interfaces in function signatures to enable this.
- Run `go test ./...` and confirm it passes before finishing.
- Use `go test -race` to detect data races when working with concurrent code.

## Forbidden
- Do not use `_` to discard errors.
- Do not put business logic in `init()`.
- Do not use global mutable state.
- Do not use `interface{}` where a type parameter (generics) works.
- Do not launch goroutines without a clear termination condition or context cancellation.

## Verification
- Run `go vet ./...` to catch common mistakes.
- Run `go build ./...` to confirm compilation.
- Run `go test ./...` and confirm a green result before declaring work done.
- Format with `gofmt` (or run `go fmt ./...` automatically).
