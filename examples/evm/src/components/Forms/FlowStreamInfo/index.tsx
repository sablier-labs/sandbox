import { useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import { useAccount } from "wagmi";
import { FlowCore } from "../../../models";
import { StreamId } from "./fields";
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
  flex-wrap: wrap;
  & > div {
    height: 20px;
    width: 1px;
    background-color: ${(props) => props.theme.colors.dark300};
    margin: 0px;
  }
`;

function FlowStreamInfo() {
  const { isConnected } = useAccount();
  const { error, logs, update } = useStoreForm((state) => ({
    error: state.error,
    logs: state.logs,
    update: state.api.update,
  }));

  const onGetState = useCallback(async () => {
    if (isConnected) {
      const state = useStoreForm.getState();
      try {
        if (state.streamId) {
          state.api.update({ error: undefined });
          await FlowCore.getState(state.streamId, state.api.log);
        } else {
          state.api.update({ error: "Stream ID is not set" });
        }
      } catch (error) {
        state.api.update({ error: _.toString(error) });
      }
    }
  }, [isConnected]);

  const onGetTotalDebt = useCallback(async () => {
    if (isConnected) {
      const state = useStoreForm.getState();
      try {
        if (state.streamId) {
          state.api.update({ error: undefined });
          await FlowCore.totalDebt(state.streamId, state.api.log);
        } else {
          state.api.update({ error: "Stream ID is not set" });
        }
      } catch (error) {
        state.api.update({ error: _.toString(error) });
      }
    }
  }, [isConnected]);

  const onGetWithdrawableAmount = useCallback(async () => {
    if (isConnected) {
      const state = useStoreForm.getState();
      try {
        if (state.streamId) {
          state.api.update({ error: undefined });
          await FlowCore.withdrawableAmount(state.streamId, state.api.log);
        } else {
          state.api.update({ error: "Stream ID is not set" });
        }
      } catch (error) {
        state.api.update({ error: _.toString(error) });
      }
    }
  }, [isConnected]);

  const onGetCoveredDebt = useCallback(async () => {
    if (isConnected) {
      const state = useStoreForm.getState();
      try {
        if (state.streamId) {
          state.api.update({ error: undefined });
          await FlowCore.coveredDebt(state.streamId, state.api.log);
        } else {
          state.api.update({ error: "Stream ID is not set" });
        }
      } catch (error) {
        state.api.update({ error: _.toString(error) });
      }
    }
  }, [isConnected]);

  const onGetUncoveredDebt = useCallback(async () => {
    if (isConnected) {
      const state = useStoreForm.getState();
      try {
        if (state.streamId) {
          state.api.update({ error: undefined });
          await FlowCore.uncoveredDebt(state.streamId, state.api.log);
        } else {
          state.api.update({ error: "Stream ID is not set" });
        }
      } catch (error) {
        state.api.update({ error: _.toString(error) });
      }
    }
  }, [isConnected]);

  const onPrefill = useCallback(() => {
    update(prefill);
  }, [update]);

  return (
    <Wrapper>
      <StreamId />
      <Divider />
      <Actions>
        <Button onClick={onPrefill}>Prefill form</Button>
        <Button onClick={onGetState}>Get stream state</Button>
        <Button onClick={onGetWithdrawableAmount}>Get withdrawable amount</Button>
        <Button onClick={onGetTotalDebt}>Get total debt</Button>
        <Button onClick={onGetCoveredDebt}>Get covered debt</Button>
        <Button onClick={onGetUncoveredDebt}>Get uncovered debt</Button>
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

export default FlowStreamInfo;
