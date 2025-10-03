import { useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import { useAccount } from "wagmi";
import {
  APPROVE_BATCH,
  APPROVE_LOCKUP_DYNAMIC,
  APPROVE_LOCKUP_LINEAR,
  APPROVE_LOCKUP_TRANCHED,
  BATCH_LOCKUP_DYNAMIC_WITH_DURATIONS,
  BATCH_LOCKUP_DYNAMIC_WITH_TIMESTAMPS,
  BATCH_LOCKUP_LINEAR_WITH_DURATIONS,
  BATCH_LOCKUP_LINEAR_WITH_TIMESTAMPS,
  BATCH_LOCKUP_TRANCHED_WITH_DURATIONS,
  BATCH_LOCKUP_TRANCHED_WITH_TIMESTAMPS,
  LOCKUP_DYNAMIC_WITH_DURATIONS,
  LOCKUP_DYNAMIC_WITH_TIMESTAMPS,
  LOCKUP_LINEAR_WITH_DURATIONS,
  LOCKUP_LINEAR_WITH_TIMESTAMPS,
  LOCKUP_TRANCHED_WITH_DURATIONS,
  LOCKUP_TRANCHED_WITH_TIMESTAMPS,
} from "../../../constants/data";
import { ERC20, LockupCore, LockupPeriphery } from "../../../models";

const WrapperPartial = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 8px 16px;
  gap: 16px;
  &:last-child {
    padding-bottom: 16px;
  }
`;

const Box = styled.div`
  grid-column: span 1;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.dark100};
  border: 1px solid ${(props) => props.theme.colors.dark300};
  border-radius: 2px;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
  flex: 1;

  & > p {
    color: ${(props) => props.theme.colors.white};
    line-height: 140%;
    span {
      color: ${(props) => props.theme.colors.gray200};
    }
    &:before {
      font-weight: 700;
      color: ${(props) => props.theme.colors.purple};
    }
  }

  &[data-type="dynamic"] {
    & > p {
      &:before {
        content: "[LD] ";
      }
    }
  }

  &[data-type="tranched"] {
    & > p {
      &:before {
        content: "[LT] ";
      }
    }
  }

  &[data-type="linear"] {
    & > p {
      &:before {
        content: "[LL] ";
      }
    }
  }
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.dark300};
`;

const Button = styled.button``;

const Wrapper = styled(WrapperPartial)`
  &[data-style="batch"] {
    & > ${Box} {
      background-color: ${(props) => props.theme.colors.dark100};
    }
  }
`;

function Single() {
  const { isConnected } = useAccount();

  const onApproveLinear = useCallback(async () => {
    if (isConnected) {
      try {
        await ERC20.doApprove(...APPROVE_LOCKUP_LINEAR, (_value: string) => {});
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onApproveDynamic = useCallback(async () => {
    if (isConnected) {
      try {
        await ERC20.doApprove(...APPROVE_LOCKUP_DYNAMIC, (_value: string) => {});
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onApproveTranched = useCallback(async () => {
    if (isConnected) {
      try {
        await ERC20.doApprove(...APPROVE_LOCKUP_TRANCHED, (_value: string) => {});
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onCreateLockupLinearWithDurations = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupCore.doCreateLinearWithDurationsRaw(LOCKUP_LINEAR_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onCreateLockupLinearWithRange = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupCore.doCreateLinearWithTimestampsRaw(LOCKUP_LINEAR_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onCreateLockupDynamicWithDurations = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupCore.doCreateDynamicWithDurationsRaw(LOCKUP_DYNAMIC_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onCreateLockupDynamicWithTimestamps = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupCore.doCreateDynamicWithTimestampsRaw(LOCKUP_DYNAMIC_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onCreateLockupTranchedWithDurations = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupCore.doCreateTranchedWithDurationsRaw(LOCKUP_TRANCHED_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onCreateLockupTranchedWithTimestamps = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupCore.doCreateTranchedWithTimestampsRaw(LOCKUP_TRANCHED_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  return (
    <>
      <Wrapper>
        <Box>
          <Header data-type={"linear"}>
            <p>
              <b>Allow Lockup Linear to spend DAI</b>
            </p>
          </Header>
          <Button onClick={onApproveLinear}>Approve</Button>
        </Box>
        <br />
        <Box>
          <Header data-type={"linear"}>
            <p>
              <b>
                Lockup Linear stream <span>with Durations</span>
              </b>
            </p>
          </Header>
          <Button onClick={onCreateLockupLinearWithDurations}>Create</Button>
        </Box>
        <Box>
          <Header data-type={"linear"}>
            <p>
              <b>
                Lockup Linear stream <span>with Range</span>
              </b>
            </p>
          </Header>
          <Button onClick={onCreateLockupLinearWithRange}>Create</Button>
        </Box>
      </Wrapper>
      <Divider />
      <Wrapper>
        <Box>
          <Header data-type={"dynamic"}>
            <p>
              <b>Allow Lockup Dynamic to spend DAI</b>
            </p>
          </Header>
          <Button onClick={onApproveDynamic}>Approve</Button>
        </Box>
        <br />
        <Box>
          <Header data-type={"dynamic"}>
            <p>
              <b>
                Lockup Dynamic stream <span>with Durations</span>
              </b>
            </p>
          </Header>
          <Button onClick={onCreateLockupDynamicWithDurations}>Create</Button>
        </Box>

        <Box>
          <Header data-type={"dynamic"}>
            <p>
              <b>
                Lockup Dynamic stream <span>with Timestamps</span>
              </b>
            </p>
          </Header>
          <Button onClick={onCreateLockupDynamicWithTimestamps}>Create</Button>
        </Box>
      </Wrapper>
      <Divider />
      <Wrapper>
        <Box>
          <Header data-type={"tranched"}>
            <p>
              <b>Allow Lockup Tranched to spend DAI</b>
            </p>
          </Header>
          <Button onClick={onApproveTranched}>Approve</Button>
        </Box>
        <br />
        <Box>
          <Header data-type={"tranched"}>
            <p>
              <b>
                Lockup Tranched stream <span>with Durations</span>
              </b>
            </p>
          </Header>
          <Button onClick={onCreateLockupTranchedWithDurations}>Create</Button>
        </Box>

        <Box>
          <Header data-type={"tranched"}>
            <p>
              <b>
                Lockup Tranched stream <span>with Timestamps</span>
              </b>
            </p>
          </Header>
          <Button onClick={onCreateLockupTranchedWithTimestamps}>Create</Button>
        </Box>
      </Wrapper>
    </>
  );
}

function Batch() {
  const { isConnected } = useAccount();

  const onApproveBatch = useCallback(async () => {
    if (isConnected) {
      try {
        await ERC20.doApprove(...APPROVE_BATCH, (_value: string) => {});
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onBatchCreateLockupLinearWithDurations = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupPeriphery.doBatchCreateLinearWithDurationsRaw(BATCH_LOCKUP_LINEAR_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onBatchCreateLockupLinearWithRange = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupPeriphery.doBatchCreateLinearWithTimestampsRaw(BATCH_LOCKUP_LINEAR_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onBatchCreateLockupDynamicWithTimestamps = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupPeriphery.doBatchCreateDynamicWithTimestampsRaw(BATCH_LOCKUP_DYNAMIC_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onBatchCreateLockupDynamicWithDurations = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupPeriphery.doBatchCreateDynamicWithDurationsRaw(BATCH_LOCKUP_DYNAMIC_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onBatchCreateLockupTranchedWithTimestamps = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupPeriphery.doBatchCreateTranchedWithTimestampsRaw(BATCH_LOCKUP_TRANCHED_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onBatchCreateLockupTranchedWithDurations = useCallback(async () => {
    if (isConnected) {
      try {
        await LockupPeriphery.doBatchCreateTranchedWithDurationsRaw(BATCH_LOCKUP_TRANCHED_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  return (
    <Wrapper data-style={"batch"}>
      <Box>
        <Header>
          <p>
            <b>Allow Batch Periphery to spend DAI</b>
          </p>
        </Header>
        <Button onClick={onApproveBatch}>Approve</Button>
      </Box>

      <div />
      <Box>
        <Header data-type={"linear"}>
          <p>
            <b>
              Batch Lockup Linear <span>with Durations</span>
            </b>
          </p>
        </Header>
        <Button onClick={onBatchCreateLockupLinearWithDurations}>Create</Button>
      </Box>
      <Box>
        <Header data-type={"linear"}>
          <p>
            <b>
              Batch Lockup Linear <span>with Range</span>
            </b>
          </p>
        </Header>
        <Button onClick={onBatchCreateLockupLinearWithRange}>Create</Button>
      </Box>
      <Box>
        <Header data-type={"dynamic"}>
          <p>
            <b>
              Batch Lockup Dynamic <span>with Durations</span>
            </b>
          </p>
        </Header>
        <Button onClick={onBatchCreateLockupDynamicWithDurations}>Create</Button>
      </Box>
      <Box>
        <Header data-type={"dynamic"}>
          <p>
            <b>
              Batch Lockup Dynamic <span>with Timestamps</span>
            </b>
          </p>
        </Header>
        <Button onClick={onBatchCreateLockupDynamicWithTimestamps}>Create</Button>
      </Box>
      <Box>
        <Header data-type={"tranched"}>
          <p>
            <b>
              Batch Lockup Tranched <span>with Durations</span>
            </b>
          </p>
        </Header>
        <Button onClick={onBatchCreateLockupTranchedWithDurations}>Create</Button>
      </Box>
      <Box>
        <Header data-type={"tranched"}>
          <p>
            <b>
              Batch Lockup Tranched <span>with Timestamps</span>
            </b>
          </p>
        </Header>
        <Button onClick={onBatchCreateLockupTranchedWithTimestamps}>Create</Button>
      </Box>
    </Wrapper>
  );
}

function LockupHeadless() {
  return (
    <>
      <Single />
      <Divider />
      <Batch />
    </>
  );
}
export default LockupHeadless;
