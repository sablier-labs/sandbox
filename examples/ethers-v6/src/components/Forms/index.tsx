import { useState } from "react";
import styled from "styled-components";
import { useWeb3Context } from "../Web3";
import Headless from "./Headless";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  border-radius: 6px;
  border: 2px solid ${(props) => props.theme.colors.dark300};
  background-color: ${(props) => props.theme.colors.dark050};
`;

const Tab = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;

  & > p {
    width: 100%;
    max-width: calc(100% - 8px);
    text-align: center;
    font-weight: 600;
    padding: 10px;
    border-radius: 4px;
  }

  &[data-active="true"] {
    & > p {
      background-color: ${(props) => props.theme.colors.orange};
      color: ${(props) => props.theme.colors.white};
    }
  }

  &:not([data-active="true"]) {
    cursor: pointer;
    &:hover,
    &:active {
      p {
        background-color: ${(props) => props.theme.colors.dark200};
        color: ${(props) => props.theme.colors.white};
      }
    }
  }
`;

const Tabs = styled.div`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.dark300};
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 12px;

  &[data-purpose="feature"] {
    ${Tab} {
      &[data-active="true"] {
        & > p {
          background-color: ${(props) => props.theme.colors.purple};
          color: ${(props) => props.theme.colors.white};
        }
      }
    }
  }
`;

function Forms() {
  const [tab, setTab] = useState(0);
  const { status } = useWeb3Context();

  if (status !== "connected") {
    return false;
  }

  return (
    <Wrapper>
      <Tabs>
        <Tab data-active={tab === 0} onClick={() => setTab(0)}>
          <p>Headless</p>
        </Tab>
      </Tabs>

      {tab === 0 && <Headless />}
    </Wrapper>
  );
}

export default Forms;
