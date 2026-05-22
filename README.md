# x402-route-kernel

Backend middleware and Soroban smart contracts for the x402 protocol — HTTP 402 payment-gated agent access on Stellar.

## Architecture

```
                    ┌─────────────────────┐
                    │   AI Agent Request   │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │   Express Backend   │
                    │  (402 Middleware)   │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
     ┌────────▼───┐   ┌──────▼──────┐  ┌─────▼─────┐
     │agent-guard │   │passkey-     │  │ Payment   │
     │-wallet     │   │validator    │  │Facilitator│
     │(spending   │   │(WebAuthn/   │  │(RPC       │
     │ limits)    │   │ secp256r1)  │  │ client)   │
     └────────────┘   └─────────────┘  └───────────┘
```

## Repo Structure

```
x402-route-kernel/
├── contracts/
│   ├── agent-guard-wallet/     # Soroban contract: per-token spending limits with time-window resets
│   │   └── src/
│   │       ├── lib.rs          # initialize, set_spending_limit, check_allowance, spend, guardian_override
│   │       └── test.rs
│   └── passkey-validator/      # Soroban contract: WebAuthn/secp256r1 passkey registration & verification
│       └── src/
│           ├── lib.rs          # register, is_registered, verify_signature
│           └── test.rs
├── backend/                    # Express.js API gateway
│   └── src/
│       ├── index.ts            # App entry — mounts 402 guard on /api/v1/agent/*
│       ├── middleware/
│       │   └── paymentRequired.ts  # HTTP 402 interceptor + on-chain payment verification
│       ├── routes/
│       │   └── payment.ts      # POST /pay, GET /status/:txHash
│       ├── services/
│       │   └── facilitator.ts  # Soroban RPC client, tx verification, contract calls
│       └── types/
│           └── index.ts
├── sdk/                        # TypeScript SDK for contract interaction
│   └── src/
│       └── index.ts            # AgentGuardWallet + PasskeyValidator client classes
├── Makefile
└── Cargo.toml                  # Rust workspace
```

## Contracts

### agent-guard-wallet

Enforces agent spending limits on a per-token basis with configurable time windows. Supports a `guardian_override` for human-in-the-loop authorization (e.g., FaceID/TouchID approval).

| Function | Description |
|---|---|
| `initialize(owner, guardian)` | Set contract owner and guardian address |
| `set_spending_limit(token, max_amount, period_seconds)` | Configure limit for a token |
| `check_allowance(token, amount)` | Check if spend is within the current window |
| `spend(token, amount)` | Record a spend against the limit |
| `guardian_override()` | Authorize a transaction bypassing the limit |

### passkey-validator

Stores secp256r1 public key credentials on-chain and verifies WebAuthn assertions. Allows a human to authorize or override agent transactions using biometric sensors.

| Function | Description |
|---|---|
| `register(user, raw_id, public_key_x, public_key_y)` | Register a passkey credential |
| `is_registered(user)` | Check if user has registered |
| `verify_signature(user, challenge_hash, signature)` | Verify a secp256r1 signature |

> **Note:** secp256r1 verification is scaffolded as a placeholder. Soroban does not yet expose native secp256r1 host functions. Wire in the `p256` crate or a precompile for production use.

## Backend

The Express server acts as a payment-gated API middleware:

1. Agent sends a request to `/api/v1/agent/*`
2. Backend returns **HTTP 402** with payment metadata (`acceptedTokens`, `requiredAmount`)
3. Agent submits the on-chain payment and retries with `x-payment-token`, `x-payment-amount`, `x-payment-tx-hash` headers
4. Backend verifies the transaction via Soroban RPC and proxies to the agent handler

## Getting Started

### Prerequisites

- Rust + `wasm32-unknown-unknown` target
- Node.js >= 18
- Stellar CLI (`stellar`) for contract deployment

### Install

```bash
make install
```

### Build contracts

```bash
make contracts
```

### Run backend

```bash
cd backend
cp .env.example .env   # fill in your contract IDs
make backend-dev
```

### Run contract tests

```bash
make test-contracts
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `STELLAR_NETWORK` | `testnet` or `mainnet` |
| `RPC_URL` | Soroban RPC endpoint |
| `AGENT_GUARD_WALLET_ID` | Deployed agent-guard-wallet contract ID |
| `PASSKEY_VALIDATOR_ID` | Deployed passkey-validator contract ID |
| `FACILITATOR_CONTRACT_ID` | Payment facilitator contract ID |

## SDK

```ts
import { AgentGuardWallet, PasskeyValidator } from "@x402/route-kernel-sdk";

const guard = new AgentGuardWallet({
  rpcUrl: "https://rpc-futurenet.stellar.org",
  networkPassphrase: "Test SDF Future Network ; October 2022",
  contractId: "CC...",
});

const allowed = await guard.checkSpendingLimit("USDC", "10");
```
