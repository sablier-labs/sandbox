import { useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import { useAccount } from "wagmi";
import {
  APPROVE_BATCH,
  APPROVE_LOCKUP_DYNAMIC,
  APPROVE_LOCKUP_LINEAR,
  BATCH_LOCKUP_DYNAMIC_WITH_DURATIONS,
  BATCH_LOCKUP_DYNAMIC_WITH_TIMESTAMPS,
  BATCH_LOCKUP_LINEAR_WITH_DURATIONS,
  BATCH_LOCKUP_LINEAR_WITH_TIMESTAMPS,
  LOCKUP_DYNAMIC_WITH_DURATIONS,
  LOCKUP_DYNAMIC_WITH_TIMESTAMPS,
  LOCKUP_LINEAR_WITH_DURATIONS,
  LOCKUP_LINEAR_WITH_TIMESTAMPS,
} from "../../../constants/data";
import { Core, ERC20, Periphery } from "../../../models";

const WrapperPartial = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  gap: 16px;
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
  border: 1px solid ${(props) => props.theme.colors.gray};
  border-radius: 6px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
  margin-top: 8px;

  & > p {
    color: ${(props) => props.theme.colors.dark};
    span {
      color: ${(props) => props.theme.colors.orange};
    }
  }

  &[data-type="dynamic"] {
    & > p span {
      color: ${(props) => props.theme.colors.blue};
    }
  }
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.gray};
  margin: 16px 0;
`;

const Button = styled.button``;

const Wrapper = styled(WrapperPartial)`
  &[data-style="batch"] {
    & > ${Box} {
      background-color: #fefefe;
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

  const onCreateLockupLinearWithDurations = useCallback(async () => {
    if (isConnected) {
      try {
        await Core.doCreateLinearWithDurationsRaw(LOCKUP_LINEAR_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onCreateLockupLinearWithRange = useCallback(async () => {
    if (isConnected) {
      try {
        await Core.doCreateLinearWithTimestampsRaw(LOCKUP_LINEAR_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onCreateLockupDynamicWithDeltas = useCallback(async () => {
    if (isConnected) {
      try {
        await Core.doCreateDynamicWithDurationsRaw(LOCKUP_DYNAMIC_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onCreateLockupDynamicWithMilestones = useCallback(async () => {
    if (isConnected) {
      try {
        await Core.doCreateDynamicWithTimestampsRaw(LOCKUP_DYNAMIC_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  return (
    <Wrapper>
      <Box>
        <Header>
          <p>
            <b>Allow Lockup Linear to spend DAI</b>
          </p>
        </Header>
        <Button onClick={onApproveLinear}>Approve</Button>
      </Box>

      <Box>
        <Header>
          <p>
            <b>Allow Lockup Dynamic to spend DAI</b>
          </p>
        </Header>
        <Button onClick={onApproveDynamic}>Approve</Button>
      </Box>
      <Box>
        <Header>
          <p>
            <b>
              Lockup Linear stream <span>with Durations</span>
            </b>
          </p>
        </Header>
        <Button onClick={onCreateLockupLinearWithDurations}>Create</Button>
      </Box>

      <Box>
        <Header data-type={"dynamic"}>
          <p>
            <b>
              Lockup Dynamic stream <span>with Deltas</span>
            </b>
          </p>
        </Header>
        <Button onClick={onCreateLockupDynamicWithDeltas}>Create</Button>
      </Box>
      <Box>
        <Header>
          <p>
            <b>
              Lockup Linear stream <span>with Range</span>
            </b>
          </p>
        </Header>
        <Button onClick={onCreateLockupLinearWithRange}>Create</Button>
      </Box>
      <Box>
        <Header data-type={"dynamic"}>
          <p>
            <b>
              Lockup Dynamic stream <span>with Milestones</span>
            </b>
          </p>
        </Header>
        <Button onClick={onCreateLockupDynamicWithMilestones}>Create</Button>
      </Box>
    </Wrapper>
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
        await Periphery.doBatchCreateLinearWithDurationsRaw(BATCH_LOCKUP_LINEAR_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onBatchCreateLockupLinearWithRange = useCallback(async () => {
    if (isConnected) {
      try {
        await Periphery.doBatchCreateLinearWithTimestampsRaw(BATCH_LOCKUP_LINEAR_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onBatchCreateLockupDynamicWithMilestones = useCallback(async () => {
    if (isConnected) {
      try {
        await Periphery.doBatchCreateDynamicWithTimestampsRaw(BATCH_LOCKUP_DYNAMIC_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [isConnected]);

  const onBatchCreateLockupDynamicWithDeltas = useCallback(async () => {
    if (isConnected) {
      try {
        await Periphery.doBatchCreateDynamicWithDurationsRaw(BATCH_LOCKUP_DYNAMIC_WITH_DURATIONS);
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
        <Header>
          <p>
            <b>
              Batch Lockup Linear <span>with Durations</span>
            </b>
          </p>
        </Header>
        <Button onClick={onBatchCreateLockupLinearWithDurations}>Create</Button>
      </Box>
      <Box>
        <Header data-type={"dynamic"}>
          <p>
            <b>
              Batch Lockup Dynamic <span>with Deltas</span>
            </b>
          </p>
        </Header>
        <Button onClick={onBatchCreateLockupDynamicWithDeltas}>Create</Button>
      </Box>
      <Box>
        <Header>
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
              Batch Lockup Dynamic <span>with Milestones</span>
            </b>
          </p>
        </Header>
        <Button onClick={onBatchCreateLockupDynamicWithMilestones}>Create</Button>
      </Box>
    </Wrapper>
  );
}

function Headless() {
  return (
    <>
      <Single />
      <Divider />
      <Batch />
    </>
  );
}
export default Headless;
