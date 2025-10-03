import BigNumber from "bignumber.js";
import _ from "lodash";
import { getAccount, readContract, readContracts, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { config } from "../components/Web3";
import { ABI, SEPOLIA_CHAIN_ID, contracts } from "../constants";
import type { IAddress, ICreateAndDepositFlow, IWithdrawFlow } from "../types";
import { erroneous, expect } from "../utils";

class FlowCore {
  static async doCreateAndDeposit(
    state: {
      ratePerSecond: string | undefined;
      initialDeposit: string | undefined;
      recipient: string | undefined;
      token: string | undefined;
      transferability: boolean;
    },
    log: (value: string) => void,
  ) {
    try {
      if (
        !expect(state.ratePerSecond, "ratePerSecond") ||
        !expect(state.initialDeposit, "initialDeposit") ||
        !expect(state.recipient, "recipient") ||
        !expect(state.token, "token") ||
        !expect(state.transferability, "transferability")
      ) {
        return;
      }

      const decimals = await readContract(config, {
        address: state.token as IAddress,
        abi: ABI.ERC20.abi,
        functionName: "decimals",
      });

      /** We use BigNumber to convert float values to decimal padded BigInts */
      const padding = new BigNumber(10).pow(new BigNumber(decimals.toString()));
      const ratePerSecond = BigInt(new BigNumber(state.ratePerSecond).times(padding).toFixed());
      const initialDeposit = BigInt(new BigNumber(state.initialDeposit).times(padding).toFixed());

      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }

      const payload: ICreateAndDepositFlow = [
        sender as IAddress,
        state.recipient as IAddress,
        ratePerSecond,
        state.token as IAddress,
        state.transferability,
        initialDeposit,
      ];

      console.info("Payload", payload);

      const hash = await writeContract(config, {
        address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
        abi: ABI.SablierFlow.abi,
        functionName: "createAndDeposit",
        args: payload,
      });

      if (hash) {
        log(`FL Stream sent to the blockchain with hash: ${hash}.`);
      }

      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt?.status === "success") {
        log(`FL Stream successfully created.`);
      } else {
        log(`FL Stream creation failed.`);
      }
    } catch (error) {
      erroneous(error);
    }
  }

  static async doWithdraw(
    state: {
      streamId: string | undefined;
      amount: string | undefined;
    },
    log: (value: string) => void,
  ) {
    try {
      if (!expect(state.streamId, "streamId") || !expect(state.amount, "amount")) {
        return;
      }

      const [asset, to] = await readContracts(config, {
        contracts: [
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "getToken",
            args: [BigInt(state.streamId)],
          },
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "getRecipient",
            args: [BigInt(state.streamId)],
          },
        ],
        allowFailure: false,
      });

      const decimals = await readContract(config, {
        address: asset,
        abi: ABI.ERC20.abi,
        functionName: "decimals",
      });

      /** We use BigNumber to convert float values to decimal padded BigInts */
      const padding = new BigNumber(10).pow(new BigNumber(decimals.toString()));

      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }

      const amount = BigInt(new BigNumber(state.amount).times(padding).toFixed());

      /** The public withdraw is locked to the recipient's address. Recipients themselves can chose a different withdraw address. */
      const payload: IWithdrawFlow = [BigInt(state.streamId), to, amount];

      console.info("Payload", payload);

      const hash = await writeContract(config, {
        address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
        abi: ABI.SablierFlow.abi,
        functionName: "withdraw",
        args: payload,
      });

      if (hash) {
        log(`Withdrawal for Stream #${state.streamId} sent to the blockchain with hash: ${hash}.`);
      }

      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt?.status === "success") {
        log(`Withdrawal for Stream #${state.streamId} successful.`);
      } else {
        log(`Withdrawal for Stream #${state.streamId} failed.`);
      }
    } catch (error) {
      erroneous(error);
    }
  }
}

export default FlowCore;
