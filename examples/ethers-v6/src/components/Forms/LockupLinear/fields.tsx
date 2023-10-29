import _ from "lodash";
import { useCallback } from "react";
import type { ChangeEvent } from "react";
import Input from "../../Input";
import Select from "../../Select";
import useFormStore from "./store";
import { REGEX_ADDRESS, REGEX_FLOAT, REGEX_INTEGER } from "../../../constants";

export function Cancelability() {
  const { cancelability, update } = useFormStore((state) => ({
    cancelability: state.cancelability,
    update: state.api.update,
  }));

  const onChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = (() => {
        const input = e.target.value;

        return ["true", true].includes(input);
      })();

      update({ cancelability: value });
    },
    [update]
  );

  return (
    <Select
      label={"Cancelability"}
      id={"cancelability"}
      value={_.toString(cancelability)}
      source={[
        { label: "On (Can be canceled later)", value: "true" },
        { label: "Off (Can never be canceled)", value: "false" },
      ]}
      onChange={onChange}
    />
  );
}

export function Token() {
  const { token, update } = useFormStore((state) => ({
    token: state.token,
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

      update({ token: value });
    },
    [update]
  );

  return (
    <Input
      label={"Token"}
      id={"token"}
      value={token}
      onChange={onChange}
      format={"text"}
      placeholder={"Address of the asset..."}
    />
  );
}

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

      if (
        value === "" ||
        new RegExp(REGEX_FLOAT).test(value) ||
        new RegExp(REGEX_INTEGER).test(value)
      ) {
        update({ amount: value });
      }
    },
    [update]
  );

  return (
    <Input
      label={"Amount"}
      id={"amount"}
      value={amount}
      onChange={onChange}
      format={"text"}
      placeholder={"Amount to be streamed (no decimals)..."}
    />
  );
}

export function Recipient() {
  const { recipient, update } = useFormStore((state) => ({
    recipient: state.recipient,
    update: state.api.update,
  }));

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = (() => {
        const input = e.target.value;
        if (_.isNil(input) || _.toString(input).length === 0) {
          return "";
        }

        if (!_.toString(input).startsWith("0")) {
          return "";
        }

        return _.toString(input);
      })();

      if (value !== "" && !new RegExp(REGEX_ADDRESS).test(value)) {
        return;
      }

      update({ recipient: value });
    },
    [update]
  );

  return (
    <Input
      label={"Recipient Address"}
      id={"recipient"}
      value={recipient}
      onChange={onChange}
      format={"text"}
      placeholder={"Recipient 0x address..."}
    />
  );
}

export function Duration() {
  const { duration, update } = useFormStore((state) => ({
    duration: state.duration,
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

      if (value !== "" && !new RegExp(REGEX_INTEGER).test(value)) {
        return;
      }

      update({ duration: value });
    },
    [update]
  );

  return (
    <Input
      label={"Duration"}
      id={"duration"}
      value={duration}
      onChange={onChange}
      format={"text"}
      placeholder={"Duration in seconds e.g. 86400 (1 Day)..."}
    />
  );
}

export function Cliff() {
  const { cliff, update } = useFormStore((state) => ({
    cliff: state.cliff,
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

      if (value !== "" && !new RegExp(REGEX_INTEGER).test(value)) {
        return;
      }

      update({ cliff: value });
    },
    [update]
  );

  return (
    <Input
      label={"Cliff"}
      id={"cliff"}
      value={cliff}
      onChange={onChange}
      format={"text"}
      placeholder={"Cliff in seconds e.g. 3600 (1 Hour)..."}
    />
  );
}
