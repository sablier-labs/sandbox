import { useCallback } from "react";
import styled from "styled-components";
import { SEPOLIA_CHAIN_ID, SEPOLIA_DAI } from "../../constants";
import { ERC20 } from "../../models";
import { useWeb3Context } from "../Web3";

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
  const { address, error, status, signer } = useWeb3Context();

  const onMint = useCallback(async () => {
    if (signer) {
      try {
        await ERC20.doMint(signer, SEPOLIA_DAI);
      } catch (error) {
        console.error(error);
      }
    }
  }, [signer]);

  return (
    <Wrapper>
      <b>Account</b>
      <Divider />
      {error ? (
        <Error>
          <b color={"red"}>Error:</b> {error}
        </Error>
      ) : (
        false
      )}
      {status === "connecting" ? (
        <p>
          <b>Status:</b> Connecting
        </p>
      ) : (
        false
      )}
      {status === "disconnected" ? (
        <p>
          <b>Status:</b> Not connected
        </p>
      ) : (
        false
      )}
      {status === "connected" ? (
        <>
          <p>
            <b>Status:</b> Connected
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
