# Development Instructions

AI agents working on this Sablier sandbox must keep the integration examples accurate against the live `sablier` SDK and
Lockup v4.0 ABI.

## Project Snapshot

- **Product**: End-to-end EVM integration examples for **Sablier Lockup v4.0** on Sepolia.
- **Framework**: Next.js 16 App Router, React 19, TypeScript 5.9 (`tsgo` via `@typescript/native-preview`).
- **Styling**: Tailwind CSS v4 (CSS-first `@theme` in `app/globals.css`), `tailwind-variants`, `tailwind-merge`,
  `lucide-react`.
- **Onchain**: `viem` + `wagmi` with the `injected()` connector. Sepolia only.
- **SDK**: `sablier@^3.11.3` for chain/contract/release lookups; `@sablier/indexers@^4` for the Envio HyperIndex GraphQL
  endpoint. The lockup ABI ships at `sablier/abi/lockup/v4.0/SablierLockup.json` (load with `with { type: "json" }`).
- **State**: `useState` by default. `zustand` only where forms have a dynamic array (Tranched, Headless batch).
- **Package manager**: `bun`. Just recipes call `na`/`nlx` wrappers, which auto-detect bun.
- **Task runner**: `just`.
- **Lint/format**: Biome for JS/TS/JSON/CSS/GraphQL, ESLint for Tailwind v4 class validation + React hooks
  exhaustive-deps, Prettier for Markdown/YAML.
- **Tests**: none yet.

`app/page.tsx` is an RSC shell that mounts client leaves (`Navigation`, `Account`, `Forms`, `Queries`). `just dev`
starts Next.js on a random free port; use whatever URL it prints.

## Lint Rules

After generating code, run checks in this order.

**File argument rules:**

- Changed fewer than 5 files? Pass specific paths or globs.
- Changed 5+ files? Omit file arguments and process the full repo.

**Command sequence:**

1. JS/TS/JSON/CSS/GraphQL changed? `na biome lint <files>`
2. TS changed? `just type-check` (whole project — tsgo is fast).
3. `.tsx` / `.styles.ts` changed? `just eslint-check <files>` (Tailwind validation).
4. Markdown/YAML changed? `just prettier-write <files>`.
5. At the end, apply fixes: `just biome-write <files>` and `just eslint-write <files>`.

If any command fails, fix the underlying error before continuing.

## Getting Started

```bash
bun install
just dev
```

## Commands

Run `just` (no args) to list all recipes.

### App

| Command      | Description                            |
| ------------ | -------------------------------------- |
| `just dev`   | Start Next.js on a random free port    |
| `just build` | Production build                       |
| `just start` | Build, then `next start`               |
| `just clean` | Remove build artifacts and cache files |

### Checks

| Command               | Description                                |
| --------------------- | ------------------------------------------ |
| `just biome-check`    | Run Biome (formatter + linter)             |
| `just biome-write`    | Apply Biome fixes + remove unused imports  |
| `just eslint-check`   | ESLint (Tailwind class validation + hooks) |
| `just eslint-write`   | Apply ESLint fixes                         |
| `just prettier-check` | Check Markdown/YAML formatting             |
| `just prettier-write` | Format Markdown/YAML                       |
| `just type-check`     | `tsgo --noEmit --project tsconfig.json`    |
| `just full-check`     | Biome + ESLint + Prettier + tsgo           |
| `just full-write`     | Apply Biome + ESLint + Prettier fixes      |

## Structure

```text
app/components/   React UI (RSC shells + client leaves)
app/components/ui/    Reusable primitives (Field, Button, Tabs, Console)
app/components/Forms/ Tab implementations (Linear, Tranched, Withdraw, Headless)
app/components/Queries/  Envio GraphQL panel
app/lib/          Onchain + integration logic (no React)
app/constants/    Prefill data
app/types/        Form-state types
```

## React/Next.js Patterns

- Server Components by default. Add `"use client"` only for interactivity, hooks, or browser APIs.
- Prefer named exports (`export function Foo()`); use a `default` export only when the framework requires it
  (`layout.tsx`, `page.tsx`).
- Do not add `useMemo` / `useCallback` — React Compiler stabilizes renders automatically.
- Lift data fetching into the RSC shell when possible; only the interactive subtree becomes a client component.

## State Management

- Local state: `useState` / `useReducer`.
- Remote state: TanStack Query.
- Wallet + chain state: wagmi hooks.
- Dynamic array forms (Tranched, Headless batch): `zustand`.

## Styling

- Tailwind v4 design tokens (`@theme` in `app/globals.css`). The dark palette mirrors the original styled-components
  theme (`ink-*` surfaces, `mist-*` text, `orange`/`purple` accents).
- Use `tailwind-variants` (`tv`) for reusable variants.
- Use `lucide-react` for icons; size them with Tailwind `size-*` classes, not the `size` prop.
- ESLint's `better-tailwindcss` plugin enforces ordering, canonical class names, and no-unknown-classes — run
  `just eslint-check <file>` after edits.

## TypeScript

- Prefer `type` over `interface` for object shapes.
- Use `satisfies` for type-safe constants.
- Avoid `any`; use `unknown` if the shape is genuinely unknown.
- Derive every onchain argument type from the ABI via `ContractFunctionArgs<typeof LockupAbi, "...", "functionName">`. A
  Solidity-side rename trips TS before it can ship.

## Sablier Integration

`app/lib/sablier.ts` is the single source of truth for contract addresses and ABIs. Never hardcode addresses — resolve
them at runtime via the SDK.

```ts
import { sablier } from "sablier";
import LockupAbi from "sablier/abi/lockup/v4.0/SablierLockup.json" with { type: "json" };

const release = sablier.evm.releases.getLatest({ protocol: "lockup" });
const LOCKUP = sablier.evm.contracts.get({
  chainId: SEPOLIA.id,
  contractName: "SablierLockup",
  protocol: "lockup",
  release,
});
```

The Envio indexer URL is similarly resolved at runtime:

```ts
import { getIndexerEnvio } from "@sablier/indexers";
const envio = getIndexerEnvio({ chainId: SEPOLIA.id, indexer: "streams" });
// envio.endpoint.url => "https://indexer.hyperindex.xyz/<id>/v1/graphql"
```

### v4.0 ABI gotchas

- `SablierLockup` is **one** contract, not three. Variants are method-level (`createWithDurationsLL`,
  `createWithDurationsLT`, `createWithTimestampsLL`, `createWithTimestampsLT`).
- The plan-era assumption that LT variants accept `unlockAmounts`/`granularity` is **wrong**: those args are LL-only. LT
  functions take `(params, tranches[])`.
- `createWithTimestampsLL` takes `(params, unlockAmounts, granularity, cliffTime)` — `cliffTime` is a single `uint40`,
  not a tuple. The {start, end} timestamps live inside `params.timestamps`.
- `params.depositAmount` replaces v3's `totalAmount`; `params.token` replaces `asset`. There is no `broker` field.
- v4.0 introduces `shape` (`string`), `granularity` (`uint40`), and `unlockAmounts` (`{start: uint128, cliff: uint128}`)
  for LL streams.
