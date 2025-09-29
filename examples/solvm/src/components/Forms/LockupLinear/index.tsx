import { useCallback } from "react";
import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import _ from "lodash";
import { useAccount } from "wagmi";
import { LockupCore } from "../../../models";
import { Amount, Cancelability, Cliff, Duration, Recipient, Token } from "./fields";
import useStoreForm, { prefill } from "./store";
import { useTransactionSigner } from "../../../contexts";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  gap: 16px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.dark300};
  margin-top: 8px;
`;

const Button = styled.button``;

const Error = styled.p`
  color: ${(props) => props.theme.colors.red};
  margin-top: 16px;
`;

const Logs = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;

  label {
    font-weight: 700;
  }

  ul {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;
    margin: 0 !important;
  }
`;

const Actions = styled.div`
  gap: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  & > div {
    height: 20px;
    width: 1px;
    background-color: ${(props) => props.theme.colors.dark300};
    margin: 0px;
  }
`;

function LockupLinear() {
  const signer = useTransactionSigner();
  const { error, logs, update } = useStoreForm((state) => ({
    error: state.error,
    logs: state.logs,
    update: state.api.update,
  }));

  const onCreate = useCallback(async () => {
    if (signer) {
      const state = useStoreForm.getState();
      try {
        state.api.update({ error: undefined });
        await LockupCore.doCreateLinear(state, signer, state.api.log);
      } catch (error) {
        state.api.update({ error: _.toString(error) });
      }
    }
  }, [signer]);

  const onPrefill = useCallback(() => {
    update(prefill);
  }, [update]);

  return (
    <Wrapper>
      <Cancelability />
      <Token />
      <Amount />
      <Recipient />
      <Duration />
      <Cliff />
      <Divider />
      <Actions>
        <Button onClick={onPrefill}>Prefill form</Button>
        <div />
        <Button onClick={onCreate}>Create LL stream</Button>
      </Actions>
      {error && <Error>{error}</Error>}
      {logs.length > 0 && (
        <>
          <Divider />
          <Logs>
            <label>Logs</label>
            <ul>
              {logs.map((log) => (
                <li key={log}>{log}</li>
              ))}
            </ul>
          </Logs>
        </>
      )}
    </Wrapper>
  );
}

export default LockupLinear;
