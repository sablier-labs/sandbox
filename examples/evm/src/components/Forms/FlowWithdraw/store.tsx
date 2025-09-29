import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { IStoreFormFlowWithdraw } from "../../../types";

const initial: Omit<IStoreFormFlowWithdraw, "api"> = {
  error: undefined,
  logs: [],

  amount: undefined,
  streamId: undefined,
};

const prefill: Omit<IStoreFormFlowWithdraw, "api"> = {
  error: undefined,
  logs: [],

  amount: "0.001",
  streamId: "25",
};

const useStoreForm = createWithEqualityFn<IStoreFormFlowWithdraw>(
  (set) => ({
    ...initial,
    api: {
      log: (value: string) =>
        set((prev) => {
          return {
            logs: [...prev.logs, value],
          };
        }),
      update: (updates: Partial<IStoreFormFlowWithdraw>) =>
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
