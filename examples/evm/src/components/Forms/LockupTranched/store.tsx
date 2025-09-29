import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { SEPOLIA_DAI } from "../../../constants";
import type { IStoreFormTranched } from "../../../types";

const initial: Omit<IStoreFormTranched, "api"> = {
  error: undefined,
  logs: [],

  cancelability: true,
  recipient: undefined,
  token: undefined,
  transferability: true,

  tranches: [
    {
      amount: undefined,
      duration: undefined,
    },
  ],
};

const prefill: Omit<IStoreFormTranched, "api"> = {
  error: undefined,
  logs: [],

  cancelability: true,
  recipient: "0xCAFE000000000000000000000000000000000000",
  token: SEPOLIA_DAI,
  transferability: true,

  tranches: [
    {
      amount: "50",
      duration: "43200", // 12hrs
    },
    {
      amount: "50",
      duration: "43200", // 12hrs
    },
  ],
};

const useStoreForm = createWithEqualityFn<IStoreFormTranched>(
  (set) => ({
    ...initial,
    api: {
      log: (value: string) =>
        set((prev) => {
          return {
            logs: [...prev.logs, value],
          };
        }),
      update: (updates: Partial<IStoreFormTranched>) =>
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
