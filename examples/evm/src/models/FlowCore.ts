import BigNumber from "bignumber.js";
import { TransactionReceipt, decodeEventLog, formatUnits } from "viem";
import { getAccount, readContract, readContracts, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { config } from "../components/Web3";
import { ABI, SEPOLIA_CHAIN_ID, contracts } from "../constants";
import type { IAddress, ICreateAndDepositFlow, IStreamState, IWithdrawFlow } from "../types";
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
        const streamId = await this.extractStreamId(receipt);

        if (streamId) {
          log(`Stream ID: ${streamId}`);
        }
      } else {
        log(`FL Stream creation failed.`);
      }
    } catch (error) {
      erroneous(error);
    }
  }

  static async extractStreamId(receipt: TransactionReceipt): Promise<bigint | undefined> {
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: ABI.SablierFlow.abi,
          data: log.data,
          topics: log.topics,
        });
        if (
          decoded.eventName === "CreateFlowStream" &&
          decoded.args &&
          "streamId" in decoded.args &&
          typeof decoded.args.streamId === "bigint"
        ) {
          return decoded.args.streamId;
        }
      } catch {
        // ignore decoding errors for unrelated logs
      }
    }
    return undefined;
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

  static async getState(streamId: string, log: (value: string) => void): Promise<IStreamState | undefined> {
    try {
      const streamIdBigInt = BigInt(streamId);

      // Read stream data and owner in parallel using readContracts
      const results = (await (readContracts as any)(config, {
        contracts: [
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "getStream",
            args: [streamIdBigInt],
          },
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "ownerOf",
            args: [streamIdBigInt],
          },
        ],
        allowFailure: false,
        authorizationList: undefined,
      })) as unknown as [
        {
          balance: bigint;
          ratePerSecond: bigint;
          sender: IAddress;
          snapshotTime: bigint;
          isStream: boolean;
          isTransferable: boolean;
          isVoided: boolean;
          token: IAddress;
          tokenDecimals: number;
          snapshotDebtScaled: bigint;
        },
        IAddress,
        boolean,
      ];

      const [stream, owner] = results;

      log(
        `Stream: ${JSON.stringify(stream, (key, value) => (typeof value === "bigint" ? value.toString() : value), 2)}`,
      );

      return {
        owner,
        rps: stream.ratePerSecond,
        startTimestamp: Number(stream.snapshotTime),
        balance: stream.balance,
        tokenAddress: stream.token,
        tokenDecimals: stream.tokenDecimals,
        snapshotTime: Number(stream.snapshotTime),
        snapshotDebtScaled: stream.snapshotDebtScaled,
        isTransferable: stream.isTransferable,
        isVoided: stream.isVoided,
      };
    } catch (error) {
      log(`Error getting stream state: ${error}`);
      return undefined;
    }
  }

  static async totalDebt(streamId: string, log: (value: string) => void): Promise<bigint | undefined> {
    try {
      const streamIdBigInt = BigInt(streamId);
      const [totalDebt, decimals] = await readContracts(config, {
        contracts: [
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "totalDebtOf",
            args: [streamIdBigInt],
          },
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "getTokenDecimals",
            args: [streamIdBigInt],
          },
        ],
      });
      if (totalDebt.status === "success" && decimals.status === "success") {
        log(`Total debt: ${formatUnits(totalDebt.result, decimals.result)}`);
        return totalDebt.result;
      } else {
        log(`Error getting total debt: ${totalDebt.error || decimals.error}`);
        return undefined;
      }
    } catch (error) {
      log(`Error getting total debt: ${error}`);
      return undefined;
    }
  }

  static async withdrawableAmount(streamId: string, log: (value: string) => void): Promise<bigint | undefined> {
    try {
      const streamIdBigInt = BigInt(streamId);
      const [withdrawableAmount, decimals] = await readContracts(config, {
        contracts: [
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "withdrawableAmountOf",
            args: [streamIdBigInt],
          },
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "getTokenDecimals",
            args: [streamIdBigInt],
          },
        ],
      });
      if (withdrawableAmount.status === "success" && decimals.status === "success") {
        log(`Withdrawable amount: ${formatUnits(withdrawableAmount.result, decimals.result)}`);
        return withdrawableAmount.result;
      } else {
        log(`Error getting withdrawable amount: ${withdrawableAmount.error || decimals.error}`);
        return undefined;
      }
    } catch (error) {
      log(`Error getting withdrawable amount: ${error}`);
      return undefined;
    }
  }

  static async coveredDebt(streamId: string, log: (value: string) => void): Promise<bigint | undefined> {
    try {
      const streamIdBigInt = BigInt(streamId);
      const [coveredDebt, decimals] = await readContracts(config, {
        contracts: [
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "coveredDebtOf",
            args: [streamIdBigInt],
          },
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "getTokenDecimals",
            args: [streamIdBigInt],
          },
        ],
      });
      if (coveredDebt.status === "success" && decimals.status === "success") {
        log(`Covered debt: ${formatUnits(coveredDebt.result, decimals.result)}`);
        return coveredDebt.result;
      } else {
        log(`Error getting covered debt: ${coveredDebt.error || decimals.error}`);
        return undefined;
      }
    } catch (error) {
      log(`Error getting covered debt: ${error}`);
      return undefined;
    }
  }

  static async uncoveredDebt(streamId: string, log: (value: string) => void): Promise<bigint | undefined> {
    try {
      const streamIdBigInt = BigInt(streamId);
      const [uncoveredDebt, decimals] = await readContracts(config, {
        contracts: [
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "uncoveredDebtOf",
            args: [streamIdBigInt],
          },
          {
            address: contracts[SEPOLIA_CHAIN_ID].SablierFlow,
            abi: ABI.SablierFlow.abi,
            functionName: "getTokenDecimals",
            args: [streamIdBigInt],
          },
        ],
      });
      if (uncoveredDebt.status === "success" && decimals.status === "success") {
        log(`Uncovered debt: ${formatUnits(uncoveredDebt.result, decimals.result)}`);
        return uncoveredDebt.result;
      } else {
        log(`Error getting uncovered debt: ${uncoveredDebt.error || decimals.error}`);
        return undefined;
      }
    } catch (error) {
      log(`Error getting uncovered debt: ${error}`);
      return undefined;
    }
  }
}

export default FlowCore;
