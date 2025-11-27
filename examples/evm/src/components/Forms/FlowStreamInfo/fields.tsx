import type { ChangeEvent } from "react";
import { useCallback } from "react";
import _ from "lodash";
import { REGEX_INTEGER } from "../../../constants";
import Input from "../../Input";
import useFormStore from "./store";

export function StreamId() {
  const { streamId, update } = useFormStore((state) => ({
    streamId: state.streamId,
    update: state.api.update,
  }));

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = (() => {
        const input = e.target.value;
        if (_.isNil(input) || _.toString(input).length === 0) {
          return undefined;
        }
        return _.toString(input);
      })();

      if (!value || new RegExp(REGEX_INTEGER).test(value)) {
        update({ streamId: value });
      }
    },
    [update],
  );

  return (
    <Input
      label={"Stream ID"}
      id={"streamId"}
      value={streamId || ""}
      onChange={onChange}
      format={"text"}
      placeholder={"Enter stream ID, e.g., 100 ..."}
    />
  );
}
