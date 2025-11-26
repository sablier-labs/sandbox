import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { IStoreFormFlowStreamInfo } from "../../../types";

const initial: Omit<IStoreFormFlowStreamInfo, "api"> = {
  error: undefined,
  logs: [],
  streamId: undefined,
};

const prefill: Omit<IStoreFormFlowStreamInfo, "api"> = {
  error: undefined,
  logs: [],
  streamId: "100",
};

const useStoreForm = createWithEqualityFn<IStoreFormFlowStreamInfo>(
  (set) => ({
    ...initial,
    api: {
      log: (value: string) =>
        set((prev) => {
          return {
            logs: [...prev.logs, value],
          };
        }),
      update: (updates: Partial<IStoreFormFlowStreamInfo>) =>
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
