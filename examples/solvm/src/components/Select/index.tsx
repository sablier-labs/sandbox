import type { ChangeEvent } from "react";
import styled from "styled-components";
import _ from "lodash";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const Label = styled.div`
  & > label {
    color: ${(props) => props.theme.colors.white};
    font-weight: 500;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  height: 56px;
`;

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.dark050};
`;

export const Highlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 30;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  outline: 1px solid ${(props) => props.theme.colors.dark300};
  pointer-events: none;
`;

const Field = styled.input`
  font-weight: 600;
  font-size: 12pt;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  flex: 1;
  width: 100%;
  height: 36px;
  min-width: 0;
  padding: 0 16px;
  color: ${(props) => props.theme.colors.white};
  border: none;
  background: transparent;
  outline: none;
  overflow: hidden;
  appearance: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  z-index: 20;

  :-webkit-autofill,
  :-webkit-autofill:active,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus {
    border-image-width: 0px !important;
    background-color: transparent !important;
    animation: none !important;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.gray500};
    font-weight: 400;
    font-size: 12pt;
    font-style: italic;
    opacity: 1;
    appearance: none;
  }

  &:active,
  &:focus {
    & ~ ${Highlight}, &:hover ~ ${Highlight} {
      outline: 1px solid ${(props) => props.theme.colors.gray200};
      box-shadow: 0px 0px 3px ${(props) => props.theme.colors.gray200};
    }
  }

  ~ ${Box} {
    cursor: text;
  }
`;

interface Props {
  id: string;
  label: string;
  value: string | undefined;
  source: { label: string; value: string }[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

function Select({ id, label, onChange, value, source }: Props) {
  return (
    <Wrapper>
      <Label>
        <label htmlFor={id}>{label}</label>
      </Label>
      <Container>
        <Box />
        <Field as={"select"} id={id} name={id} onChange={onChange} value={value}>
          {source.map((item) => (
            <option key={item.label} value={item.value}>
              {item.label}
            </option>
          ))}
        </Field>
        <Highlight />
      </Container>
    </Wrapper>
  );
}

export default Select;
