import { useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import { maxUint256 } from "viem";
import { useAccount } from "wagmi";
import { Core, ERC20 } from "../../../models";
import { Cancelability, Recipient, Segments, Token, Transferability } from "./fields";
import useStoreForm, { prefill } from "./store";

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
  background-color: ${(props) => props.theme.colors.gray};
  margin: 8px 0;
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
    background-color: ${(props) => props.theme.colors.gray};
    margin: 0px;
  }
`;

function LockupDynamic() {
  const { isConnected } = useAccount();
  const { error, logs, update } = useStoreForm((state) => ({
    error: state.error,
    logs: state.logs,
    update: state.api.update,
  }));
  const onApprove = useCallback(async () => {
    if (isConnected) {
      const state = useStoreForm.getState();
      try {
        state.api.update({ error: undefined });
        await ERC20.doApprove(
          "SablierLockupDynamic",
          {
            amount: (maxUint256 / 10n ** 18n).toString(),
            token: state.token,
          },
          state.api.log,
        );
      } catch (error) {
        state.api.update({ error: _.toString(error) });
      }
    }
  }, [isConnected]);

  const onCreate = useCallback(async () => {
    if (isConnected) {
      const state = useStoreForm.getState();
      try {
        state.api.update({ error: undefined });
        await Core.doCreateDynamic(state, state.api.log);
      } catch (error) {
        state.api.update({ error: _.toString(error) });
      }
    }
  }, [isConnected]);

  const onPrefill = useCallback(() => {
    update(prefill);
  }, [update]);

  const onAdd = useCallback(() => {
    const state = useStoreForm.getState();
    const segments = _.clone(state.segments);
    update({
      segments: [...segments, { amount: undefined, delta: undefined, exponent: undefined }],
    });
  }, [update]);

  return (
    <Wrapper>
      <Cancelability />
      <Transferability />
      <Token />
      <Recipient />
      <Segments />
      <Divider />
      <Actions>
        <Button onClick={onPrefill}>Prefill form</Button>
        <Button onClick={onAdd}>Add segment</Button>
        <div />
        <Button onClick={onApprove}>Approve token spending</Button>
        <Button onClick={onCreate}>Create LD stream</Button>
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

export default LockupDynamic;
