import BigNumber from "bignumber.js";
import { UserRejectedRequestError } from "viem";

/** Convert a human-readable decimal string (e.g. "1000.5") into a token-decimal-padded BigInt. */
export function toUnits(amount: string, decimals: number): bigint {
  const padding = new BigNumber(10).pow(new BigNumber(decimals));
  return BigInt(new BigNumber(amount).times(padding).toFixed(0, BigNumber.ROUND_FLOOR));
}

/** Format a BigInt amount as a human-readable string with the given decimals. */
export function fromUnits(amount: bigint, decimals: number): string {
  const padding = new BigNumber(10).pow(new BigNumber(decimals));
  return new BigNumber(amount.toString()).dividedBy(padding).toFixed();
}

/** Throw a descriptive error if `value` is nullish or empty. */
export function expect<T>(value: T, label: string): NonNullable<T> {
  if (value === null || value === undefined || (typeof value === "string" && value.length === 0)) {
    throw new Error(`Missing parameter: ${label}`);
  }
  return value as NonNullable<T>;
}

/**
 * Handle wallet/transaction errors uniformly.
 *
 * - User-rejection errors are silently swallowed (the user already knows).
 * - Other errors are surfaced via the optional `log` callback so the on-screen
 *   console shows the revert reason, then swallowed so the unhandled-rejection
 *   noise stays out of the dev console.
 *
 * Callers must pass `log` to get UI feedback. Falling back to `console.error`
 * keeps non-UI call sites from losing the error entirely.
 */
export function erroneous(error: unknown, log?: (msg: string) => void): void {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : String(error);

  if (
    name === UserRejectedRequestError.name ||
    message.includes("User denied message signature") ||
    message.includes("User denied transaction signature") ||
    message.includes("User rejected the request")
  ) {
    return;
  }

  if (log) {
    log(`Error: ${message}`);
    return;
  }
  // Last-resort surface when no log channel is provided. Acceptable here because callers
  // that omit `log` are explicitly opting out of UI feedback.
  console.error(error);
}

/** Short-form an EVM address: 0x1234…abcd. */
export function shortAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
