import BigNumber from "bignumber.js";
import _ from "lodash";
import { zeroAddress } from "viem";
import { getAccount, readContract, readContracts, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { config } from "../components/Web3";
import { ABI, SEPOLIA_CHAIN_ID, contracts } from "../constants";
import type {
  IAddress,
  IAmountWithDecimals,
  IAmountWithDecimals18,
  ICreateDynamicWithDurations,
  ICreateDynamicWithTimestamps,
  ICreateLinearWithDurations,
  ICreateLinearWithTimestamps,
  ICreateTranchedWithDurations,
  ICreateTranchedWithTimestamps,
  ISeconds,
  ISegmentD,
  ITrancheD,
  IWithdrawLockup,
} from "../types";
import { erroneous, expect } from "../utils";

class LockupCore {
  static async doCreateLinear(
    state: {
      amount: string | undefined;
      cancelability: boolean;
      cliff: string | undefined;
      duration: string | undefined;
      recipient: string | undefined;
      token: string | undefined;
      transferability: boolean;
    },
    log: (value: string) => void,
  ) {
    try {
      if (
        !expect(state.amount, "amount") ||
        !expect(state.cancelability, "cancelability") ||
        !expect(state.duration, "duration") ||
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
      const amount = BigInt(new BigNumber(state.amount).times(padding).toFixed());

      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }

      const cliff = (() => {
        try {
          if (!_.isNil(state.cliff) && BigInt(state.cliff).toString() === state.cliff) {
            return Number(state.cliff);
          }
        } catch (_error) {}
        return 0;
      })();

      const payload: ICreateLinearWithDurations = {
        sender,
        recipient: state.recipient as IAddress,
        totalAmount: amount,
        asset: state.token as IAddress,
        cancelable: state.cancelability,
        transferable: state.transferability,
        durations: { cliff, total: _.toNumber(state.duration) },
        broker: { account: zeroAddress, fee: 0n },
      };

      console.info("Payload", payload);

      const hash = await writeContract(config, {
        address: contracts[SEPOLIA_CHAIN_ID].SablierLockupLinear,
        abi: ABI.SablierLockupLinear.abi,
        functionName: "createWithDurations",
        args: [payload],
      });

      if (hash) {
        log(`LL Stream sent to the blockchain with hash: ${hash}.`);
      }

      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt?.status === "success") {
        log(`LL Stream successfully created.`);
      } else {
        log(`LL Stream creation failed.`);
      }
    } catch (error) {
      erroneous(error);
    }
  }

  static async doCreateDynamic(
    state: {
      cancelability: boolean;
      recipient: string | undefined;
      segments: {
        amount: string | undefined;
        duration: string | undefined;
        exponent: string | undefined;
      }[];
      token: string | undefined;
      transferability: boolean;
    },
    log: (value: string) => void,
  ) {
    try {
      if (
        !expect(state.segments, "segments") ||
        !expect(state.cancelability, "cancelability") ||
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

      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }

      const segments: ISegmentD<number>[] = state.segments.map((segment) => {
        if (
          !expect(segment.amount, "segment amount") ||
          !expect(segment.duration, "segment duration") ||
          !expect(segment.exponent, "segment exponent")
        ) {
          throw new Error("Expected valid segments.");
        }

        const amount: IAmountWithDecimals = BigInt(new BigNumber(segment.amount).times(padding).toFixed());
        const duration: ISeconds<number> = _.toNumber(segment.duration);
        const exponent: IAmountWithDecimals18 = BigInt(segment.exponent) * 10n ** 18n;

        const result: ISegmentD<number> = { amount, exponent, duration };

        return result;
      });

      const amount = segments.reduce((prev, curr) => prev + (curr?.amount || 0n), 0n);

      const payload: ICreateDynamicWithDurations = {
        sender,
        cancelable: state.cancelability,
        transferable: state.transferability,
        recipient: state.recipient as IAddress,
        totalAmount: amount,
        asset: state.token as IAddress,
        broker: { account: zeroAddress, fee: 0n },
        segments,
      };

      console.info("Payload", payload);

      const hash = await writeContract(config, {
        address: contracts[SEPOLIA_CHAIN_ID].SablierLockupDynamic,
        abi: ABI.SablierLockupDynamic.abi,
        functionName: "createWithDurations",
        args: [payload],
      });

      if (hash) {
        log(`LD Stream sent to the blockchain with hash: ${hash}.`);
      }

      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt?.status === "success") {
        log(`LD Stream successfully created.`);
      } else {
        log(`LD Stream creation failed.`);
      }
    } catch (error) {
      erroneous(error);
    }
  }

  static async doCreateTranched(
    state: {
      cancelability: boolean;
      recipient: string | undefined;
      tranches: {
        amount: string | undefined;
        duration: string | undefined;
      }[];
      token: string | undefined;
      transferability: boolean;
    },
    log: (value: string) => void,
  ) {
    try {
      if (
        !expect(state.tranches, "tranches") ||
        !expect(state.cancelability, "cancelability") ||
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

      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }

      const tranches: ITrancheD<number>[] = state.tranches.map((tranche) => {
        if (!expect(tranche.amount, "tranche amount") || !expect(tranche.duration, "tranche duration")) {
          throw new Error("Expected valid tranches.");
        }

        const amount: IAmountWithDecimals = BigInt(new BigNumber(tranche.amount).times(padding).toFixed());
        const duration: ISeconds<number> = _.toNumber(tranche.duration);

        const result: ITrancheD<number> = { amount, duration };

        return result;
      });

      const amount = tranches.reduce((prev, curr) => prev + (curr?.amount || 0n), 0n);

      const payload: ICreateTranchedWithDurations = {
        sender,
        cancelable: state.cancelability,
        transferable: state.transferability,
        recipient: state.recipient as IAddress,
        totalAmount: amount,
        asset: state.token as IAddress,
        broker: { account: zeroAddress, fee: 0n },
        tranches,
      };

      console.info("Payload", payload);

      const hash = await writeContract(config, {
        address: contracts[SEPOLIA_CHAIN_ID].SablierLockupTranched,
        abi: ABI.SablierLockupTranched.abi,
        functionName: "createWithDurations",
        args: [payload],
      });

      if (hash) {
        log(`LT Stream sent to the blockchain with hash: ${hash}.`);
      }

      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt?.status === "success") {
        log(`LT Stream successfully created.`);
      } else {
        log(`LT Stream creation failed.`);
      }
    } catch (error) {
      erroneous(error);
    }
  }

  static async doCreateLinearWithDurationsRaw(payload: ICreateLinearWithDurations) {
    const data = _.clone(payload);
    if (data.sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }
      data.sender = sender;
    }

    console.info("Payload", data);

    const hash = await writeContract(config, {
      address: contracts[SEPOLIA_CHAIN_ID].SablierLockupLinear,
      abi: ABI.SablierLockupLinear.abi,
      functionName: "createWithDurations",
      args: [data],
    });
    return waitForTransactionReceipt(config, { hash });
  }

  static async doCreateLinearWithTimestampsRaw(payload: ICreateLinearWithTimestamps) {
    const data = _.clone(payload);
    if (data.sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }
      data.sender = sender;
    }

    console.info("Payload", data);

    const hash = await writeContract(config, {
      address: contracts[SEPOLIA_CHAIN_ID].SablierLockupLinear,
      abi: ABI.SablierLockupLinear.abi,
      functionName: "createWithTimestamps",
      args: [data],
    });
    return waitForTransactionReceipt(config, { hash });
  }

  static async doCreateDynamicWithDurationsRaw(payload: ICreateDynamicWithDurations) {
    const data = _.clone(payload);
    if (data.sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }
      data.sender = sender;
    }

    console.info("Payload", data);

    const hash = await writeContract(config, {
      address: contracts[SEPOLIA_CHAIN_ID].SablierLockupDynamic,
      abi: ABI.SablierLockupDynamic.abi,
      functionName: "createWithDurations",
      args: [data],
    });
    return waitForTransactionReceipt(config, { hash });
  }

  static async doCreateDynamicWithTimestampsRaw(payload: ICreateDynamicWithTimestamps) {
    const data = _.clone(payload);
    if (data.sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }
      data.sender = sender;
    }

    console.info("Payload", data);

    const hash = await writeContract(config, {
      address: contracts[SEPOLIA_CHAIN_ID].SablierLockupDynamic,
      abi: ABI.SablierLockupDynamic.abi,
      functionName: "createWithTimestamps",
      args: [data],
    });
    return waitForTransactionReceipt(config, { hash });
  }

  static async doCreateTranchedWithDurationsRaw(payload: ICreateTranchedWithDurations) {
    const data = _.clone(payload);
    if (data.sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }
      data.sender = sender;
    }

    console.info("Payload", data);

    const hash = await writeContract(config, {
      address: contracts[SEPOLIA_CHAIN_ID].SablierLockupTranched,
      abi: ABI.SablierLockupTranched.abi,
      functionName: "createWithDurations",
      args: [data],
    });
    return waitForTransactionReceipt(config, { hash });
  }

  static async doCreateTranchedWithTimestampsRaw(payload: ICreateTranchedWithTimestamps) {
    const data = _.clone(payload);
    if (data.sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }
      data.sender = sender;
    }

    console.info("Payload", data);

    const hash = await writeContract(config, {
      address: contracts[SEPOLIA_CHAIN_ID].SablierLockupTranched,
      abi: ABI.SablierLockupTranched.abi,
      functionName: "createWithTimestamps",
      args: [data],
    });
    return waitForTransactionReceipt(config, { hash });
  }

  static async doWithdraw(
    state: {
      contract: string | undefined;
      streamId: string | undefined;
      amount: string | undefined;
    },
    log: (value: string) => void,
  ) {
    try {
      if (
        !expect(state.streamId, "streamId") ||
        !expect(state.contract, "contract") ||
        !expect(state.amount, "amount")
      ) {
        return;
      }

      const [asset, to] = await readContracts(config, {
        contracts: [
          {
            address: state.contract as IAddress,
            abi: ABI.SablierLockupLinear.abi, // These methods are included in the ISablierLockup interfaces, so common across all variants (LL, LT, LD)
            functionName: "getAsset",
            args: [BigInt(state.streamId)],
          },
          {
            address: state.contract as IAddress,
            abi: ABI.SablierLockupLinear.abi, // These methods are included in the ISablierLockup interfaces, so common across all variants (LL, LT, LD)
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
      const payload: IWithdrawLockup = [BigInt(state.streamId), to, amount];

      console.info("Payload", payload);

      const hash = await writeContract(config, {
        address: contracts[SEPOLIA_CHAIN_ID].SablierLockupLinear,
        abi: ABI.SablierLockupLinear.abi,
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

export default LockupCore;
