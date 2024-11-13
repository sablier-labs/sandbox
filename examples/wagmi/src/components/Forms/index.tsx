import { useState } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import Flow from "./Flow";
import FlowWithdraw from "./FlowWithdraw";
import LockupDynamic from "./LockupDynamic";
import LockupHeadless from "./LockupHeadless";
import LockupLinear from "./LockupLinear";
import LockupTranched from "./LockupTranched";
import LockupWithdraw from "./LockupWithdraw";

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
              <p>🛠️ Linear</p>
            </Tab>
            <Tab data-active={tab === 1} onClick={() => setTab(1)}>
              <p>🛠️ Dynamic</p>
            </Tab>
            <Tab data-active={tab === 2} onClick={() => setTab(2)}>
              <p>🛠️ Tranched</p>
            </Tab>
            <Tab data-active={tab === 3} onClick={() => setTab(3)}>
              <p>⬇️ Withdraw</p>
            </Tab>
            <Tab data-active={tab === 4} onClick={() => setTab(4)}>
              <p>🤖 Headless</p>
            </Tab>
          </Tabs>
          {tab === 0 && <LockupLinear />}
          {tab === 1 && <LockupDynamic />}
          {tab === 2 && <LockupTranched />}
          {tab === 3 && <LockupWithdraw />}
          {tab === 4 && <LockupHeadless />}
        </>
      )}

      {feature === 1 && (
        <>
          <Tabs>
            <Tab data-active={tab === 0} onClick={() => setTab(0)}>
              <p>🛠️ Create & Deposit</p>
            </Tab>
            <Tab data-active={tab === 1} onClick={() => setTab(1)}>
              <p>⬇️ Withdraw</p>
            </Tab>
          </Tabs>
          {tab === 0 && <Flow />}
          {tab === 1 && <FlowWithdraw />}
        </>
      )}
    </Wrapper>
  );
}

export default Forms;
