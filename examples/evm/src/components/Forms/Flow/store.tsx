import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { SEPOLIA_DAI } from "../../../constants";
import type { IStoreFormFlow, IStoreFormLinear } from "../../../types";

const initial: Omit<IStoreFormFlow, "api"> = {
  error: undefined,
  logs: [],

  ratePerSecond: undefined,
  initialDeposit: undefined,
  recipient: undefined,
  token: undefined,
  transferability: true,
};

const prefill: Omit<IStoreFormFlow, "api"> = {
  error: undefined,
  logs: [],

  initialDeposit: "100",
  ratePerSecond: "0.00006",
  recipient: "0xCAFE000000000000000000000000000000000000",
  token: SEPOLIA_DAI,
  transferability: true,
};

const useStoreForm = createWithEqualityFn<IStoreFormFlow>(
  (set) => ({
    ...initial,
    api: {
      log: (value: string) =>
        set((prev) => {
          return {
            logs: [...prev.logs, value],
          };
        }),
      update: (updates: Partial<IStoreFormFlow>) =>
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
