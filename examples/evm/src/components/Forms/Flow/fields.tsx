import { useCallback } from "react";
import type { ChangeEvent } from "react";
import _ from "lodash";
import { REGEX_ADDRESS, REGEX_FLOAT, REGEX_INTEGER } from "../../../constants";
import Input from "../../Input";
import Select from "../../Select";
import useFormStore from "./store";

export function Transferability() {
  const { transferability, update } = useFormStore((state) => ({
    transferability: state.transferability,
    update: state.api.update,
  }));

  const onChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = (() => {
        const input = e.target.value;

        return ["true", true].includes(input);
      })();

      update({ transferability: value });
    },
    [update],
  );

  return (
    <Select
      label={"Transferability"}
      id={"transferability"}
      value={_.toString(transferability)}
      source={[
        { label: "On (Can be transferred later)", value: "true" },
        { label: "Off (Can never be transferred)", value: "false" },
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
    [update],
  );

  return (
    <Input
      label={"Token"}
      id={"token"}
      value={token}
      onChange={onChange}
      format={"text"}
      placeholder={"Address of the ERC-20 token ..."}
    />
  );
}

export function RatePerSecond() {
  const { ratePerSecond, update } = useFormStore((state) => ({
    ratePerSecond: state.ratePerSecond,
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
        update({ ratePerSecond: value });
      }
    },
    [update],
  );

  return (
    <Input
      label={"Rate / Second"}
      id={"rate"}
      value={ratePerSecond}
      onChange={onChange}
      format={"text"}
      placeholder={"Rate / Second e.g., 0.00006 ..."}
    />
  );
}

export function InitialDeposit() {
  const { initialDeposit, update } = useFormStore((state) => ({
    initialDeposit: state.initialDeposit,
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
        update({ initialDeposit: value });
      }
    },
    [update],
  );

  return (
    <Input
      label={"Initial Deposit"}
      id={"initialDeposit"}
      value={initialDeposit}
      onChange={onChange}
      format={"text"}
      placeholder={"Amount to be deposited, e.g., 100 ..."}
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
    [update],
  );

  return (
    <Input
      label={"Recipient"}
      id={"recipient"}
      value={recipient}
      onChange={onChange}
      format={"text"}
      placeholder={"Recipient 0x address ..."}
    />
  );
}
