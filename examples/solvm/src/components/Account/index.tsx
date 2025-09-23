import { useCallback } from "react";
import styled from "styled-components";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import _ from "lodash";
import { USDC_DEVNET } from "../../constants";
import { useTransactionSigner } from "../../contexts";
import { TokenFaucet } from "../../models";

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

function Account() {
  const { publicKey, connected, connecting, disconnect } = useWallet();

  const signer = useTransactionSigner();

  const onMint = useCallback(async () => {
    if (signer) {
      try {
        await TokenFaucet.doMint(USDC_DEVNET, signer);
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  const onDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error(error);
    }
  }, [disconnect]);

  return (
    <Wrapper>
      <b>Account</b>
      <Divider />
      {connecting ? (
        <p>
          <b>Status:</b> Connecting
        </p>
      ) : (
        false
      )}
      {!connected ? (
        <p>
          <b>Status:</b> Not connected
          <span> . . . </span>
          <WalletMultiButton>Select Wallet</WalletMultiButton>
        </p>
      ) : (
        false
      )}
      {connected ? (
        <>
          <p>
            <b>Status:</b> Connected <button onClick={onDisconnect}>Disconnect</button>
          </p>
          <p>
            <b>Address:</b> {publicKey?.toString()}
          </p>
          <p>
            <b>USDC Devnet:</b> {USDC_DEVNET}
          </p>
          <p>
            <b>Mint USDC Devnet</b>
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
