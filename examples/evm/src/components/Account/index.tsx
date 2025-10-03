import { useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
import { SEPOLIA_DAI } from "../../constants";
import { ERC20 } from "../../models";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  padding-top: 24px;
  width: 100%;
  border-radius: 6px;
  border: 2px solid ${(props) => props.theme.colors.dark300};
  background-color: ${(props) => props.theme.colors.dark050};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.dark300};
  margin: 8px 0;
`;

const Error = styled.p`
  color: ${(props) => props.theme.colors.red};
`;

function Account() {
  const { address, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient, error } = useWalletClient();

  const onMint = useCallback(async () => {
    if (walletClient) {
      try {
        await ERC20.doMint(SEPOLIA_DAI);
      } catch (error) {
        console.error(error);
      }
    }
  }, [walletClient]);

  const onDisconnect = useCallback(async () => {
    try {
      void disconnect({ connector: connectors[0] });
    } catch (error) {
      console.error(error);
    }
  }, [connectors, disconnect]);

  return (
    <Wrapper>
      <b>Account</b>
      <Divider />
      {error ? (
        <Error>
          <b color={"red"}>Error:</b> {error?.name || _.toString(error)}
        </Error>
      ) : (
        false
      )}
      {status === "connecting" || status === "reconnecting" ? (
        <p>
          <b>Status:</b> Connecting
        </p>
      ) : (
        false
      )}
      {status === "disconnected" ? (
        <p>
          <b>Status:</b> Not connected
          <span> . . . </span>
          <button
            onClick={() => {
              connect({ connector: connectors[0] });
            }}
          >
            Connect
          </button>
        </p>
      ) : (
        false
      )}
      {status === "connected" ? (
        <>
          <p>
            <b>Status:</b> Connected <button onClick={onDisconnect}>Disconnect</button>
          </p>
          <p>
            <b>Address:</b> {address}
          </p>
          <p>
            <b>Sepolia DAI:</b> {SEPOLIA_DAI}
          </p>
          <p>
            <b>Mint Sepolia DAI</b>
            <span> . . . </span>
            <button onClick={onMint}>Mint</button>
          </p>
        </>
      ) : (
        false
      )}
    </Wrapper>
  );
}

export default Account;
