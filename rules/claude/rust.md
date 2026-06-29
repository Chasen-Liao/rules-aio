# Rust (Solana / Anchor)
Conventions for writing Solana programs with Anchor and the Rust SDK.

## Program Structure
- Place program entrypoint in `lib.rs`, not `main.rs`.
- Organize instruction handlers into modules by action (`instructions/initialize.rs`, `update.rs`, `close.rs`).
- Separate concerns: `state/` for account structs, `errors/` for custom error codes, `instructions/` for handlers, `utils/` for shared logic.
- Use `declare_id!()` to bind the program ID. Keep `Anchor.toml` in sync.

## Anchor Patterns
- Use `#[derive(Accounts)]` for every instruction context — validate accounts via Anchor constraint macros, not manual checks.
- Mark mutable accounts with `#[account(mut)]`. Use `seeds` and `bump` for PDAs.
- Define account structs with `#[account]` and `AnchorSerialize`/`AnchorDeserialize`.
- Access validated accounts through `ctx.accounts`, not raw `AccountInfo`.

## Serialization
- Use Borsh (Anchor's default) for on-chain data — never Serde.
- Use `#[account(zero_copy)]` and `#[repr(C)]` for packed/zero-copy structures.
- No floating point — use `u64`, `u128`, or fixed-point arithmetic.

## Security
- Always verify the signer: `constraint = authority.is_signer`.
- Prevent replay by deriving PDAs with unique seeds.
- Validate program IDs on CPI targets. Check account sizes before realloc.
- Never panic in instruction handlers — return `ProgramError::Custom(error_code)`.
- Use `solana_program::msg!` for logging; never use `println!` or `dbg!`.

## Testing
- Write integration tests in `tests/*.ts` using Anchor's Mocha + Chai setup.
- Use `provider.simulate()` to inspect failed transactions; airdrop SOL with `requestAirdrop`.
- Run `anchor test` locally and verify all tests pass before declaring work done.

## Workflow
- Use `anchor build`, `anchor deploy`, `anchor test` — not raw `cargo build-sbf` unless you have a specific reason.
- Format with `cargo fmt`, lint with `cargo clippy`. Fix clippy warnings before submitting.
- Use `anchor keys sync` after changing program IDs. Commit `target/idl/` for frontend consumers.
