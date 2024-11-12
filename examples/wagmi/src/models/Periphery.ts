import _ from "lodash";
import { getAccount, waitForTransaction, writeContract } from "wagmi/actions";
import { ABI, SEPOLIA_CHAIN_ID, contracts } from "../constants";
import type {
  IBatchCreateDynamicWithDurations,
  IBatchCreateDynamicWithTimestamps,
  IBatchCreateLinearWithDurations,
  IBatchCreateLinearWithTimestamps,
  IBatchCreateTranchedWithDurations,
  IBatchCreateTranchedWithTimestamps,
} from "../types";
import { expect } from "../utils";

export default class Periphery {
  static async doBatchCreateLinearWithDurationsRaw(payload: IBatchCreateLinearWithDurations) {
    const data = _.clone(payload);
    const you = await getAccount().address;

    if (!expect(you, "you")) {
      return;
    }

    data[2].map((_item, index) => {
      if (data[2][index].sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
        data[2][index].sender = you;
      }
    });

    console.info("Payload", data);

    const tx = await writeContract({
      address: contracts[SEPOLIA_CHAIN_ID].SablierBatchLockup,
      abi: ABI.SablierBatchLockup.abi,
      functionName: "createWithDurationsLL",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }

  static async doBatchCreateLinearWithTimestampsRaw(payload: IBatchCreateLinearWithTimestamps) {
    const data = _.clone(payload);
    const you = await getAccount().address;

    if (!expect(you, "you")) {
      return;
    }
    data[2].map((_item, index) => {
      if (data[2][index].sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
        data[2][index].sender = you;
      }
    });

    console.info("Payload", data);

    const tx = await writeContract({
      address: contracts[SEPOLIA_CHAIN_ID].SablierBatchLockup,
      abi: ABI.SablierBatchLockup.abi,
      functionName: "createWithTimestampsLL",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }

  static async doBatchCreateDynamicWithDurationsRaw(payload: IBatchCreateDynamicWithDurations) {
    const data = _.clone(payload);
    const you = await getAccount().address;

    if (!expect(you, "you")) {
      return;
    }
    data[2].map((_item, index) => {
      if (data[2][index].sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
        data[2][index].sender = you;
      }
    });

    console.info("Payload", data);

    const tx = await writeContract({
      address: contracts[SEPOLIA_CHAIN_ID].SablierBatchLockup,
      abi: ABI.SablierBatchLockup.abi,
      functionName: "createWithDurationsLD",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }

  static async doBatchCreateDynamicWithTimestampsRaw(payload: IBatchCreateDynamicWithTimestamps) {
    const data = _.clone(payload);
    const you = await getAccount().address;

    if (!expect(you, "you")) {
      return;
    }
    data[2].map((_item, index) => {
      if (data[2][index].sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
        data[2][index].sender = you;
      }
    });

    console.info("Payload", data);

    const tx = await writeContract({
      address: contracts[SEPOLIA_CHAIN_ID].SablierBatchLockup,
      abi: ABI.SablierBatchLockup.abi,
      functionName: "createWithTimestampsLD",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }

  static async doBatchCreateTranchedWithDurationsRaw(payload: IBatchCreateTranchedWithDurations) {
    const data = _.clone(payload);
    const you = await getAccount().address;

    if (!expect(you, "you")) {
      return;
    }
    data[2].map((_item, index) => {
      if (data[2][index].sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
        data[2][index].sender = you;
      }
    });

    console.info("Payload", data);

    const tx = await writeContract({
      address: contracts[SEPOLIA_CHAIN_ID].SablierBatchLockup,
      abi: ABI.SablierBatchLockup.abi,
      functionName: "createWithDurationsLT",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }

  static async doBatchCreateTranchedWithTimestampsRaw(payload: IBatchCreateTranchedWithTimestamps) {
    const data = _.clone(payload);
    const you = await getAccount().address;

    if (!expect(you, "you")) {
      return;
    }
    data[2].map((_item, index) => {
      if (data[2][index].sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
        data[2][index].sender = you;
      }
    });

    console.info("Payload", data);

    const tx = await writeContract({
      address: contracts[SEPOLIA_CHAIN_ID].SablierBatchLockup,
      abi: ABI.SablierBatchLockup.abi,
      functionName: "createWithTimestampsLT",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }
}
