import { create } from "zustand";
import { LOCKUP_TRANCHED_WITH_DURATIONS } from "@/constants/data";
import type { TranchedFormState } from "@/types";

type Tranche = { amount: string | undefined; duration: string | undefined };

type State = TranchedFormState & {
  api: {
    update: <K extends keyof TranchedFormState>(key: K, value: TranchedFormState[K]) => void;
    setTranche: (index: number, value: Partial<Tranche>) => void;
    addTranche: () => void;
    removeTranche: (index: number) => void;
    log: (msg: string) => void;
  };
};

/**
 * Tranched uses zustand because the `tranches` array is dynamic — the user can
 * add/remove rows. Linear/Withdraw use plain `useState` because their shape is fixed.
 */
export const useLockupTranchedStore = create<State>((set) => ({
  ...LOCKUP_TRANCHED_WITH_DURATIONS,
  logs: [],
  tranches: [...LOCKUP_TRANCHED_WITH_DURATIONS.tranches],
  api: {
    addTranche: () =>
      set((prev) => ({
        tranches: [...prev.tranches, { amount: "0", duration: "86400" }],
      })),
    log: (msg) => set((prev) => ({ logs: [...prev.logs, msg] })),
    removeTranche: (index) =>
      set((prev) => ({ tranches: prev.tranches.filter((_, i) => i !== index) })),
    setTranche: (index, value) =>
      set((prev) => {
        const tranches = [...prev.tranches];
        tranches[index] = { ...tranches[index], ...value };
        return { tranches };
      }),
    update: (key, value) => set((prev) => ({ ...prev, [key]: value })),
  },
}));
