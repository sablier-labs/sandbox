import { useCallback } from "react";
import type { ChangeEvent } from "react";
import _ from "lodash";
import { REGEX_FLOAT, REGEX_INTEGER } from "../../../constants";
import Input from "../../Input";
import useFormStore from "./store";

export function Amount() {
  const { amount, update } = useFormStore((state) => ({
    amount: state.amount,
    update: state.api.update,
  }));

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = (() => {
        const input = e.target.value;
        if (_.isNil(input) || _.toString(input).length === 0) {
          return "";
        }
        return _.toString(input);
      })();

      if (value === "" || new RegExp(REGEX_FLOAT).test(value) || new RegExp(REGEX_INTEGER).test(value)) {
        update({ amount: value });
      }
    },
    [update],
  );

  return (
    <Input
      label={"Amount"}
      id={"amount"}
      value={amount}
      onChange={onChange}
      format={"text"}
      placeholder={"Amount to be streamed, e.g., 100 ..."}
    />
  );
}

export function Identifier() {
  const { streamId, update } = useFormStore((state) => ({
    streamId: state.streamId,
    update: state.api.update,
  }));

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = (() => {
        const input = e.target.value;
        if (_.isNil(input) || _.toString(input).length === 0) {
          return "";
        }
        return _.toString(input);
      })();

      if (value === "" || new RegExp(REGEX_INTEGER).test(value)) {
        update({ streamId: value });
      }
    },
    [update],
  );

  return (
    <Input
      label={"Stream Id"}
      id={"streamId"}
      value={streamId}
      onChange={onChange}
      format={"text"}
      placeholder={"Identifier of the stream, e.g., 100 ..."}
    />
  );
}