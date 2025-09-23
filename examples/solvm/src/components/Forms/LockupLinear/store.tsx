import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { SEPOLIA_DAI } from "../../../constants";
import type { IStoreFormLinear } from "../../../types";

const initial: Omit<IStoreFormLinear, "api"> = {
  error: undefined,
  logs: [],

  amount: undefined,
  cancelability: true,
  cliff: undefined,
  duration: undefined,
  recipient: undefined,
  token: undefined,
  transferability: true
};

const prefill: Omit<IStoreFormLinear, "api"> = {
  error: undefined,
  logs: [],

  amount: "100",
  cancelability: true,
  cliff: undefined,
  duration: "86400", // 1 day
  recipient: "0xCAFE000000000000000000000000000000000000",
  token: SEPOLIA_DAI,
  transferability: true,
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
  shallow
);

export { initial, prefill };
export default useStoreForm;
