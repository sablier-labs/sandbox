import { useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import Headless from "./Headless";
import LockupDynamic from "./LockupDynamic";
import LockupLinear from "./LockupLinear";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.colors.gray};
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
    font-weight: 600;
  }

  &:after {
    content: "";
    display: none;
    position: absolute;
    bottom: -1px;
    width: 160px;
    height: 2px;
    border-radius: 1px;
    background-color: ${(props) => props.theme.colors.orange};
  }

  &[data-active="true"] {
    &:after {
      display: flex;
    }
    & > p {
      color: ${(props) => props.theme.colors.orange};
    }
  }

  &:not([data-active="true"]) {
    cursor: pointer;
    &:hover,
    &:active {
      &:after {
        display: flex;
        background-color: ${(props) => props.theme.colors.dark};
      }
    }
  }
`;

const Tabs = styled.div`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray};
  display: flex;
  align-items: center;
  height: 80px;

  &[data-purpose="feature"] {
    ${Tab} {
      &[data-active="true"] > p {
        color: ${(props) => props.theme.colors.purple};
      }
      &:after {
        background-color: ${(props) => props.theme.colors.purple};
      }
    }
  }
`;

function Forms() {
  const [feature, setFeature] = useState(0);
  const [tab, setTab] = useState(0);
  const { isConnected } = useAccount();

  if (!isConnected) {
    return false;
  }

  return (
    <Wrapper>
      <Tabs data-purpose={"feature"}>
        <Tab
          data-active={feature === 0}
          onClick={() => {
            setFeature(0);
            setTab(0);
          }}
        >
          <p>Lockup</p>
        </Tab>
        <Tab
          data-active={feature === 1}
          onClick={() => {
            setFeature(1);
            setTab(0);
          }}
        >
          <p>Flow</p>
        </Tab>
      </Tabs>
      {feature === 0 && (
        <>
          <Tabs>
            <Tab data-active={tab === 0} onClick={() => setTab(0)}>
              <p>Create Linear</p>
            </Tab>
            <Tab data-active={tab === 1} onClick={() => setTab(1)}>
              <p>Create Dynamic</p>
            </Tab>
            <Tab data-active={tab === 2} onClick={() => setTab(2)}>
              <p>Create Tranched</p>
            </Tab>
            <Tab data-active={tab === 3} onClick={() => setTab(3)}>
              <p>Headless</p>
            </Tab>
          </Tabs>
          {tab === 0 && <LockupLinear />}
          {tab === 1 && <LockupDynamic />}
          {tab === 3 && <Headless />}
        </>
      )}

      {feature === 1 && (
        <>
          <Tabs>
            <Tab data-active={tab === 0} onClick={() => setTab(0)}>
              <p>Create & Deposit</p>
            </Tab>
            <Tab data-active={tab === 1} onClick={() => setTab(1)}>
              <p>Withdraw</p>
            </Tab>
          </Tabs>
        </>
      )}
    </Wrapper>
  );
}

export default Forms;
