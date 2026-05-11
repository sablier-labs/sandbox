# Sablier Sandbox

End-to-end EVM integration examples for **Sablier Lockup v4.0** on Sepolia.

## What's inside

- Create Linear streams (with durations) — v4.0 unlock amounts + granularity exposed
- Create Tranched streams (with durations and timestamps)
- Withdraw from any stream
- Headless examples: single LL (durations + timestamps), batch of 5 via `SablierBatchLockup`
- Recent streams query against the new Envio `LockupStream` schema

## Stack

- Next.js 16 App Router + React 19 + TypeScript 5.9
- Tailwind CSS v4 (CSS-first `@theme`) + `tailwind-variants` + `lucide-react`
- viem + wagmi (`injected()` connector)
- `sablier` SDK for addresses + ABIs, `@sablier/indexers` for the Envio endpoint
- Lint: Biome 2 + ESLint (Tailwind class validation only); Prettier for Markdown
- Task runner: `just`; package manager: `bun`

## Run

```bash
bun install
just dev          # Next.js on a random localhost port
just full-check   # Biome + ESLint + Prettier + tsgo
just build        # Production build
```

See [docs.sablier.com](https://docs.sablier.com) for Lockup v4.0 protocol details.
