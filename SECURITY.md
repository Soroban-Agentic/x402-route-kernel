# Security Policy

## Supported scope

Please report vulnerabilities that affect the current `main` branch, including:

- Stellar/Soroban smart contracts under `contracts/`
- Backend payment and facilitator services under `backend/`
- SDK code under `sdk/`
- Build, deployment, or documentation issues that could lead to unsafe use of the contracts or backend

Out of scope:

- Social engineering or physical attacks
- Denial-of-service reports without a practical impact description
- Vulnerabilities in unsupported forks or local modifications
- Findings that require access to secrets, credentials, or systems you do not own or have explicit permission to test

## Reporting a vulnerability

Use GitHub's private vulnerability reporting or Security Advisories for this repository when available. If private reporting is not enabled, open a minimal public issue asking the maintainers for a private security contact, but do not include exploit details in the public issue.

Please include:

- Affected component and commit or version
- Clear reproduction steps or proof of concept
- Expected impact, including any effect on funds, authorization, or payment flows
- Suggested fix or mitigation, if known

Do not disclose the vulnerability publicly until the maintainers have had time to investigate and release a fix.

## Response expectations

The project should aim to:

- Acknowledge new reports within 72 hours
- Triage severity and scope within 7 days
- Provide a remediation plan or status update after triage
- Credit reporters in release notes or advisories when requested and appropriate

These targets are best-effort and may change as the project matures.

## Bug bounty and acknowledgments

There is currently no standing bug bounty program documented for this repository. Security researchers may receive public acknowledgment for valid, responsibly disclosed reports at the maintainers' discretion.

## Safe harbor

Good-faith security research is welcome when it avoids privacy violations, service disruption, data destruction, and unauthorized access to third-party systems or funds. Researchers should stop testing and report immediately if they encounter sensitive data or live funds at risk.
