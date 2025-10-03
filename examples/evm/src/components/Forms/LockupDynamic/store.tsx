import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { SEPOLIA_DAI } from "../../../constants";
import type { IStoreFormDynamic } from "../../../types";

const initial: Omit<IStoreFormDynamic, "api"> = {
  error: undefined,
  logs: [],

  cancelability: true,
  recipient: undefined,
  token: undefined,
  transferability: true,

  segments: [
    {
      amount: undefined,
      duration: undefined,
      exponent: undefined,
    },
  ],
};

const prefill: Omit<IStoreFormDynamic, "api"> = {
  error: undefined,
  logs: [],

  cancelability: true,
  recipient: "0xCAFE000000000000000000000000000000000000",
  token: SEPOLIA_DAI,
  transferability: true,

  segments: [
    {
      amount: "0",
      duration: "43199", // 12hrs - 1 second
      exponent: "1",
    },
    {
      amount: "50",
      duration: "1", // 1 second
      exponent: "1",
    },
    {
      amount: "0",
      duration: "43199", // 12hrs - 1 second
      exponent: "1",
    },
    {
      amount: "50",
      duration: "1", // 1 second
      exponent: "1",
    },
  ],
};

const useStoreForm = createWithEqualityFn<IStoreFormDynamic>(
  (set) => ({
    ...initial,
    api: {
      log: (value: string) =>
        set((prev) => {
          return {
            logs: [...prev.logs, value],
          };
        }),
      update: (updates: Partial<IStoreFormDynamic>) =>
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
