import type { Address } from "viem";

export type IAddress = Address;

/* ------------------------------------------------------------------ */
/*                          Form state shapes                         */
/* ------------------------------------------------------------------ */

export type LogEntry = string;

export type LinearFormState = {
  logs: LogEntry[];

  amount: string | undefined;
  recipient: string | undefined;
  token: string | undefined;
  cancelability: boolean;
  transferability: boolean;
  cliffDuration: string | undefined;
  totalDuration: string | undefined;
  shape: string;
  unlockStart: string;
  unlockCliff: string;
  granularity: string;
};

export type TranchedFormState = {
  logs: LogEntry[];

  recipient: string | undefined;
  token: string | undefined;
  cancelability: boolean;
  transferability: boolean;
  shape: string;
  tranches: { amount: string | undefined; duration: string | undefined }[];
};

export type WithdrawFormState = {
  logs: LogEntry[];
  streamId: string | undefined;
  amount: string | undefined;
};
