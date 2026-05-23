# Contributing

Thanks for helping improve x402-route-kernel. This guide covers the local setup,
checks, and pull request flow for the Soroban contracts, Express backend, and
TypeScript SDK.

## Prerequisites

- Rust stable with `cargo`
- Rust target `wasm32-unknown-unknown`
- Node.js 18 or newer
- npm
- Stellar CLI for Soroban contract deployment and testnet work
- A GitHub account with a fork of this repository

Helpful references:

- Stellar docs: https://developers.stellar.org/
- Soroban docs: https://developers.stellar.org/docs/build/smart-contracts

## Local Setup

Clone your fork and add the upstream remote:

```bash
git clone https://github.com/YOUR_USERNAME/x402-route-kernel.git
cd x402-route-kernel
git remote add upstream https://github.com/Soroban-Agentic/x402-route-kernel.git
```

Install JavaScript dependencies for the backend and SDK:

```bash
make install
```

Install the Soroban WebAssembly target if you do not already have it:

```bash
rustup target add wasm32-unknown-unknown
```

For backend development, create a local environment file:

```bash
cd backend
touch .env
```

Fill in the contract IDs and RPC settings needed for the routes you are testing.

## Build and Test

Run contract tests:

```bash
cargo test --workspace
```

Build Soroban contracts:

```bash
cargo build --workspace --target wasm32-unknown-unknown --release
```

Build the backend:

```bash
cd backend
npm run build
```

Build the SDK:

```bash
cd sdk
npm run build
```

Run the backend locally:

```bash
make backend-dev
```

## Code Style

- Run `cargo fmt` before opening a PR that touches Rust code.
- Keep Soroban contract logic small and covered by contract tests.
- Run `npm run lint` in `backend/` or `sdk/` when changing TypeScript.
- Keep TypeScript types explicit around payment metadata, facilitator responses,
  and SDK request payloads.
- Do not commit local `.env` files, build output, or private keys.

## Branches and Commits

Use short branch names that describe the change:

```bash
git checkout -b feat/payment-status-route
git checkout -b fix/spending-limit-reset
git checkout -b docs/contributing-guide
```

Commit messages should start with the area of change:

- `feat:` for new behavior
- `fix:` for bug fixes
- `docs:` for documentation
- `test:` for test-only changes
- `chore:` for maintenance

## Pull Requests

Before opening a PR:

1. Rebase or merge the latest `upstream/main`.
2. Run the relevant checks for the files you changed.
3. Keep the PR focused on one issue or one closely related change.
4. Include a short summary and the checks you ran.
5. Link the related issue when one exists.

Reviewers should be able to understand the payment flow impact, contract storage
changes, and any new environment variables from the PR description.

## Getting Help

- Open an issue for bugs, missing docs, or unclear setup steps.
- Use GitHub Discussions or the project Discord when available for design
  questions before starting larger protocol changes.
- Link to Stellar or Soroban documentation when proposing changes that depend on
  network behavior, RPC responses, or contract host functions.
