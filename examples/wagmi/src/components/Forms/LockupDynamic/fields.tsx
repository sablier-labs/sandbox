import { useCallback } from "react";
import type { ChangeEvent } from "react";
import styled from "styled-components";
import _ from "lodash";
import { REGEX_ADDRESS, REGEX_FLOAT, REGEX_INTEGER } from "../../../constants";
import Input from "../../Input";
import Select from "../../Select";
import useFormStore from "./store";
import useStoreForm from "./store";

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
    [update],
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

export function Amount({ index }: { index: number }) {
  const { segment, update } = useFormStore((state) => ({
    segment: _.get(state.segments, index) || {},
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
        const state = useFormStore.getState();
        const segments = _.clone(state.segments);
        segments[index].amount = value;

        update({ segments });
      }
    },
    [index, update],
  );

  return (
    <Input
      label={"Segment Amount"}
      id={"segment_amount"}
      value={segment.amount}
      onChange={onChange}
      format={"text"}
      placeholder={"Amount streamed this segment, e.g., 100 ..."}
    />
  );
}

export function Delta({ index }: { index: number }) {
  const { segment, update } = useFormStore((state) => ({
    segment: _.get(state.segments, index) || {},
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

      const state = useFormStore.getState();
      const segments = _.clone(state.segments);
      segments[index].duration = value;

      update({ segments });
    },
    [index, update],
  );

  return (
    <Input
      label={"Segment Delta"}
      id={"segment_delta"}
      value={segment.duration}
      onChange={onChange}
      format={"text"}
      placeholder={"Duration of this segment, e.g., 3600 (1 Hour) ..."}
    />
  );
}

export function Exponent({ index }: { index: number }) {
  const { segment, update } = useFormStore((state) => ({
    segment: _.get(state.segments, index) || {},
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

      if (value !== "" && !new RegExp(REGEX_FLOAT).test(value)) {
        return;
      }

      const state = useFormStore.getState();
      const segments = _.clone(state.segments);
      segments[index].exponent = value;

      update({ segments });
    },
    [index, update],
  );

  return (
    <Input
      label={"Segment Exponent"}
      id={"segment_exponent"}
      value={segment.exponent}
      onChange={onChange}
      format={"text"}
      placeholder={"Exponent, e.g., 1 for a straight line ..."}
    />
  );
}

const Segment = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  gap: 16px;
  border: 1px solid ${(props) => props.theme.colors.dark300};
  background-color: ${(props) => props.theme.colors.dark200};
  border-radius: 4px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
  & > p {
    color: ${(props) => props.theme.colors.orange};
  }
`;
const Button = styled.button``;

export function Segments() {
  const { segments, update } = useFormStore((state) => ({
    segments: state.segments,
    update: state.api.update,
  }));

  const onRemove = useCallback(
    (index: number) => {
      const state = useStoreForm.getState();
      const segments = _.clone(state.segments);
      segments.splice(index, 1);
      update({ segments });
    },
    [update],
  );

  return (
    <>
      {segments.map((_segment, index) => (
        <Segment key={index}>
          <Header>
            <p>
              <b>Segment #{index + 1}</b>
            </p>
            {index === 0 ? false : <Button onClick={() => onRemove(index)}>Remove segment</Button>}
          </Header>

          <Amount index={index} />
          <Delta index={index} />
          <Exponent index={index} />
        </Segment>
      ))}
    </>
  );
}
