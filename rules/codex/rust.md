# Rust (Solana / Anchor)
Conventions for writing Solana programs with Anchor and the Rust SDK — build, test, and lint before finishing.

## Program Structure
- Place program entrypoint in `lib.rs`, not `main.rs`.
- Organize instruction handlers into modules by action (`instructions/initialize.rs`, `update.rs`, `close.rs`).
- Separate concerns: `state/` for account structs, `errors/` for custom error codes, `instructions/` for handlers, `utils/` for shared logic.
- Use `declare_id!()` to bind the program ID. Run `anchor keys sync` to propagate changes.

## Anchor Patterns
- Use `#[derive(Accounts)]` for every instruction context — validate accounts via Anchor constraint macros, not manual checks.
- Mark mutable accounts with `#[account(mut)]`. Use `seeds` and `bump` for PDAs.
- Define account structs with `#[account]` and `AnchorSerialize`/`AnchorDeserialize`.
- Access validated accounts through `ctx.accounts`, not raw `AccountInfo`.
- Handle CPI calls via Anchor's CPI helpers — validate the target program ID before invoking.

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
- Use `provider.simulate()` to inspect failed transactions. Airdrop SOL with `requestAirdrop`.
- Use `anchor.workspace.MyProgram` to load deployed contracts.
- Validate program logs using `tx.confirmation.logMessages`.

## Dev Workflow
- Scaffold with `anchor init`. Use `anchor build`, `anchor deploy`, `anchor test` consistently.
- Format with `cargo fmt`, lint with `cargo clippy`. Fix clippy warnings before finishing.
- Use separate `Anchor.toml` environments for localnet/devnet/mainnet.
- Commit `target/idl/` and `target/types/` for frontend consumers. Do not commit `target/` build artifacts.

## Wallet and Network
- Do not hardcode keypairs — use env-based loading (`process.env.ANCHOR_WALLET`).
- Deploy with explicit `cluster` targets. Run `anchor keys sync` after changing program IDs.

## Verification
- Run `anchor build` to confirm compilation.
- Run `anchor test` to run the full test suite and confirm a green result.
- Run `cargo fmt --check` and `cargo clippy` in `programs/` to verify formatting and lint.
