import { useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import {
  APPROVE_LOCKUP_DYNAMIC,
  APPROVE_LOCKUP_LINEAR,
  APPROVE_LOCKUP_TRANCHED,
  LOCKUP_DYNAMIC_WITH_DURATIONS,
  LOCKUP_DYNAMIC_WITH_TIMESTAMPS,
  LOCKUP_LINEAR_WITH_DURATIONS,
  LOCKUP_LINEAR_WITH_TIMESTAMPS,
  LOCKUP_TRANCHED_WITH_DURATIONS,
  LOCKUP_TRANCHED_WITH_TIMESTAMPS,
} from "../../../constants/data";
import { ERC20, LockupCore } from "../../../models";
import { useWeb3Context } from "../../Web3";

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
  const { signer } = useWeb3Context();

  const onApproveLinear = useCallback(async () => {
    if (signer) {
      try {
        await ERC20.doApprove(signer, ...APPROVE_LOCKUP_LINEAR, (_value: string) => {});
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  const onApproveDynamic = useCallback(async () => {
    if (signer) {
      try {
        await ERC20.doApprove(signer, ...APPROVE_LOCKUP_DYNAMIC, (_value: string) => {});
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  const onApproveTranched = useCallback(async () => {
    if (signer) {
      try {
        await ERC20.doApprove(signer, ...APPROVE_LOCKUP_TRANCHED, (_value: string) => {});
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  const onCreateLockupLinearWithDurations = useCallback(async () => {
    if (signer) {
      try {
        await LockupCore.doCreateLinearWithDurationsRaw(signer, LOCKUP_LINEAR_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  const onCreateLockupLinearWithTimestamps = useCallback(async () => {
    if (signer) {
      try {
        await LockupCore.doCreateLinearWithTimestampsRaw(signer, LOCKUP_LINEAR_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  const onCreateLockupDynamicWithDurations = useCallback(async () => {
    if (signer) {
      try {
        await LockupCore.doCreateDynamicWithDurationsRaw(signer, LOCKUP_DYNAMIC_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  const onCreateLockupDynamicWithTimestamps = useCallback(async () => {
    if (signer) {
      try {
        await LockupCore.doCreateDynamicWithTimestampsRaw(signer, LOCKUP_DYNAMIC_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  const onCreateLockupTranchedWithDurations = useCallback(async () => {
    if (signer) {
      try {
        await LockupCore.doCreateTranchedWithDurationsRaw(signer, LOCKUP_TRANCHED_WITH_DURATIONS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  const onCreateLockupTranchedWithTimestamps = useCallback(async () => {
    if (signer) {
      try {
        await LockupCore.doCreateTranchedWithTimestampsRaw(signer, LOCKUP_TRANCHED_WITH_TIMESTAMPS);
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

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
          <Button onClick={onCreateLockupLinearWithTimestamps}>Create</Button>
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

function Headless() {
  return (
    <>
      <Single />
    </>
  );
}
export default Headless;
