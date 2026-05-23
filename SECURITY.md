# Security Policy

x402-route-kernel combines HTTP 402 payment middleware, Stellar/Soroban contracts, and a TypeScript SDK. Please report suspected security issues privately so maintainers can triage without exposing users, funds, or integration partners.

## Supported components

Security reports are in scope when they affect code or documentation in this repository, including:

- `contracts/agent-guard-wallet`: spending-limit accounting, owner/guardian authorization, period resets, and token-specific limit checks.
- `contracts/passkey-validator`: credential registration, signature verification boundaries, and passkey/WebAuthn assumptions.
- `backend`: HTTP 402 payment challenge handling, payment verification, agent route gating, CORS/header handling, and Soroban RPC interaction.
- `sdk`: client-side contract helpers, request construction, and documented integration defaults.
- Deployment and configuration guidance that could cause unsafe payment verification, replay, over-spend, or secret exposure.

## Out of scope

The following are not security issues for this repository unless they demonstrate a concrete impact on an in-scope component:

- Vulnerabilities in third-party services, wallets, RPC providers, or Stellar infrastructure.
- Denial-of-service from high-volume traffic against public endpoints without prior written permission.
- Social engineering, phishing, spam, or physical attacks.
- Reports that require access to private keys, seed phrases, wallet signatures, or accounts you do not control.
- Best-practice suggestions without an exploitable impact or a clear unsafe integration path.

## How to report

Prefer GitHub Private Vulnerability Reporting for this repository if it is enabled:

1. Open the repository's **Security** tab.
2. Select **Report a vulnerability**.
3. Include the details listed below.

If private reporting is unavailable, open a minimal public issue asking the maintainers to enable a private reporting channel. Do **not** include exploit details, private keys, wallet addresses linked to real funds, or sensitive transaction material in a public issue.

## What to include

Please include as much of the following as possible:

- Affected component, file, route, contract function, or SDK API.
- Impact statement, such as unauthorized spend, payment bypass, replay, incorrect receipt/verification, secret leakage, or unsafe default configuration.
- Reproduction steps against local code, testnet contracts, mocks, or a controlled deployment.
- Expected behavior and actual behavior.
- Suggested remediation if you have one.
- Whether you believe active users or funds may be at risk.

## Response targets

Maintainers aim to:

- acknowledge new private reports within **72 hours**;
- provide an initial severity/readback within **7 days**;
- prioritize critical payment-bypass, unauthorized-spend, or key-exposure issues immediately;
- coordinate disclosure timing after a fix or safe mitigation is available.

These are targets, not a guarantee. If a report appears to involve active exploitation or real funds at risk, say so clearly in the report title and summary.

## Safe research guidelines

Researchers should:

- use local tests, mocks, disposable wallets, or public testnets where possible;
- avoid live mainnet transfers unless the maintainers explicitly request them;
- never request or handle maintainer private keys, seed phrases, or production secrets;
- avoid destructive testing, service disruption, or bypassing access controls;
- stop testing and report promptly if you unexpectedly access non-public data or funds.

## Bounty and recognition

This project does not currently publish a standing paid bounty program. Maintainers may choose to acknowledge high-quality reports in release notes or advisories where appropriate and safe. Any paid bounty, reward, or reimbursement must be agreed by maintainers before work that incurs cost or risk.

## Disclosure

Please give maintainers reasonable time to investigate and patch before public disclosure. Coordinated disclosure should avoid sharing exploit details until users have had a fair chance to upgrade or mitigate.
