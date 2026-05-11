import type { Address } from "viem";

/** Sepolia DAI used as the default test token. */
export const SEPOLIA_DAI = "0xb19b36b1456E65E3A6D514D3F715f204BD59f431" as Address;

const DAY = 86400;

export type LinearWithDurationsPreset = {
  amount: string;
  recipient: Address;
  token: Address;
  cancelability: boolean;
  transferability: boolean;
  cliffDuration: string;
  totalDuration: string;
  shape: string;
  unlockStart: string;
  unlockCliff: string;
  granularity: string;
};

/**
 * Sandbox prefill for `createLinearWithDurations`. Amounts are human-readable strings
 * (e.g. "1000" DAI); they're decimal-padded against the token's `decimals()` at submit time.
 */
export const LOCKUP_LINEAR_WITH_DURATIONS: LinearWithDurationsPreset = {
  amount: "1000",
  cancelability: true,
  cliffDuration: String(DAY * 7),
  granularity: "0",
  recipient: "0xCAFE000000000000000000000000000000000000" as Address,
  shape: "",
  token: SEPOLIA_DAI,
  totalDuration: String(DAY * 30),
  transferability: true,
  unlockCliff: "0",
  unlockStart: "0",
};

/** v4.0 `createWithTimestampsLL` requires {start, end} in `params.timestamps` AND a separate `cliffTime`. */
export function makeLinearWithTimestamps() {
  const now = Math.floor(Date.now() / 1000);
  return {
    amount: "1000",
    cancelability: true,
    cliffTime: String(now + DAY * 7),
    endTime: String(now + DAY * 30),
    granularity: "0",
    recipient: "0xCAFE000000000000000000000000000000000000" as Address,
    shape: "",
    startTime: String(now),
    token: SEPOLIA_DAI,
    transferability: true,
    unlockCliff: "0",
    unlockStart: "0",
  };
}

export type TranchedWithDurationsPreset = {
  recipient: Address;
  token: Address;
  cancelability: boolean;
  transferability: boolean;
  shape: string;
  tranches: { amount: string; duration: string }[];
};

export const LOCKUP_TRANCHED_WITH_DURATIONS: TranchedWithDurationsPreset = {
  cancelability: true,
  recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as Address,
  shape: "",
  token: SEPOLIA_DAI,
  transferability: true,
  tranches: [
    { amount: "250", duration: String(DAY) },
    { amount: "750", duration: String(DAY) },
  ],
};

export function makeTranchedWithTimestamps() {
  const now = Math.floor(Date.now() / 1000);
  return {
    cancelability: true,
    endTime: String(now + DAY * 30),
    recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as Address,
    shape: "",
    startTime: String(now),
    token: SEPOLIA_DAI,
    transferability: true,
    tranches: [
      { amount: "250", timestamp: String(now + DAY) },
      { amount: "750", timestamp: String(now + DAY * 30) },
    ],
  };
}

/** Five-entry batch preset for headless demo. */
export const BATCH_LL_WITH_DURATIONS_RECIPIENTS = [
  "0xCAFE000000000000000000000000000000000000",
  "0xCAFE000000000000000000000000000000000001",
  "0xCAFE000000000000000000000000000000000002",
  "0xCAFE000000000000000000000000000000000003",
  "0xCAFE000000000000000000000000000000000004",
] as const satisfies readonly Address[];
