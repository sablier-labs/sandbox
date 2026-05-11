import type { Address } from "viem";
import { create } from "zustand";
import { BATCH_LL_WITH_DURATIONS_RECIPIENTS, SEPOLIA_DAI } from "@/constants/data";

type BatchEntry = {
  recipient: Address;
  amount: string;
  cliffDuration: number;
  totalDuration: number;
  cancelable: boolean;
  transferable: boolean;
};

type State = {
  token: string;
  entries: BatchEntry[];
  logs: string[];
  api: {
    setEntry: (index: number, value: Partial<BatchEntry>) => void;
    log: (msg: string) => void;
  };
};

const DAY = 86400;

/** Five-entry preset for batch demos (linear with durations). */
function defaultEntries(): BatchEntry[] {
  return BATCH_LL_WITH_DURATIONS_RECIPIENTS.map((recipient, idx) => ({
    recipient,
    amount: String(100 * (idx + 1)),
    cancelable: true,
    cliffDuration: DAY,
    totalDuration: DAY * 30,
    transferable: true,
  }));
}

export const useHeadlessBatchStore = create<State>((set) => ({
  entries: defaultEntries(),
  logs: [],
  token: SEPOLIA_DAI,
  api: {
    log: (msg) => set((prev) => ({ logs: [...prev.logs, msg] })),
    setEntry: (index, value) =>
      set((prev) => {
        const entries = [...prev.entries];
        entries[index] = { ...entries[index], ...value };
        return { entries };
      }),
  },
}));
