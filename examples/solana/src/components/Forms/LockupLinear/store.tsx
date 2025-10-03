import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { USDC_DEVNET } from "../../../constants";
import type { IStoreFormLinear } from "../../../types";

const initial: Omit<IStoreFormLinear, "api"> = {
  error: undefined,
  logs: [],

  amount: undefined,
  cancelability: true,
  duration: undefined,
  recipient: undefined,
  token: undefined,
};

const prefill: Omit<IStoreFormLinear, "api"> = {
  error: undefined,
  logs: [],

  amount: "1",
  cancelability: true,
  duration: "86400", // 1 day
  recipient: "GmDP1fjp1sTGfqPz4Vf22E2tXYgdwarnqRwrcVzFhF76",
  token: USDC_DEVNET,
};

const useStoreForm = createWithEqualityFn<IStoreFormLinear>(
  (set) => ({
    ...initial,
    api: {
      log: (value: string) =>
        set((prev) => {
          return {
            logs: [...prev.logs, value],
          };
        }),
      update: (updates: Partial<IStoreFormLinear>) =>
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
