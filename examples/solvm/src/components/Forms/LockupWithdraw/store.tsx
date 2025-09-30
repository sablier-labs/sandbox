import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { DEVNET_CHAIN_ID, contracts } from "../../../constants";
import type { IStoreFormLockupWithdraw } from "../../../types";

const initial: Omit<IStoreFormLockupWithdraw, "api"> = {
  error: undefined,
  logs: [],

  amount: undefined,
  nftMint: undefined,
};

const prefill: Omit<IStoreFormLockupWithdraw, "api"> = {
  error: undefined,
  logs: [],

  amount: "100",
  nftMint: "DnbZhmWCEE3d9idtgfzWUhXakD6rfY9n5EEwk98CAQCw",
};

const useStoreForm = createWithEqualityFn<IStoreFormLockupWithdraw>(
  (set) => ({
    ...initial,
    api: {
      log: (value: string) =>
        set((prev) => {
          return {
            logs: [...prev.logs, value],
          };
        }),
      update: (updates: Partial<IStoreFormLockupWithdraw>) =>
        set((_prev) => {
          return {
            ...updates,
          };
        }),
      reset: () =>
        set((_prev) => {
          return initial;
        }),
    },
  }),
  shallow,
);

export { initial, prefill };
export default useStoreForm;
