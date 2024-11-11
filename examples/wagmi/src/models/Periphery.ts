import _ from "lodash";
import { getAccount, waitForTransaction, writeContract } from "wagmi/actions";
import { ABI, SEPOLIA_CHAIN_ID, contracts } from "../constants";
import type {
  IBatchCreateWithDeltas,
  IBatchCreateWithDurations,
  IBatchCreateWithMilestones,
  IBatchCreateWithRange,
} from "../types";
import { expect } from "../utils";

export default class Periphery {
  static async doBatchCreateLinearWithDurationsRaw(payload: IBatchCreateWithDurations) {
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
      functionName: "createWithDurations",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }

  static async doBatchCreateLinearWithRangeRaw(payload: IBatchCreateWithRange) {
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
      functionName: "createWithRange",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }

  static async doBatchCreateDynamicWithMilestonesRaw(payload: IBatchCreateWithMilestones) {
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
      functionName: "createWithMilestones",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }

  static async doBatchCreateDynamicWithDeltasRaw(payload: IBatchCreateWithDeltas) {
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
      functionName: "createWithDeltas",
      args: data,
    });
    return waitForTransaction({ hash: tx.hash });
  }
}
