import type { Abi, Address, ContractFunctionArgs, ContractFunctionName } from "viem";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { senderAddress } from "./account";
import { readDecimals } from "./erc20";
import { BATCH_LOCKUP, BatchLockupAbi, LOCKUP } from "./sablier";
import { erroneous, expect, toUnits } from "./utils";
import { config } from "./wagmi";

type Log = (msg: string) => void;

/**
 * v4.0 BatchLockup ABI-derived argument types.
 *
 * `createWithDurationsLL(lockup, token, batch[])` where each batch entry
 * contains the LL-specific tuple: durations/unlockAmounts/granularity/shape.
 */
export type BatchCreateLinearWithDurationsArgs = ContractFunctionArgs<
  typeof BatchLockupAbi,
  "nonpayable" | "payable",
  "createWithDurationsLL"
>;
export type BatchCreateLinearWithTimestampsArgs = ContractFunctionArgs<
  typeof BatchLockupAbi,
  "nonpayable" | "payable",
  "createWithTimestampsLL"
>;

type BatchLinearDurationsEntry = {
  recipient: Address;
  amount: string;
  cancelable: boolean;
  transferable: boolean;
  cliffDuration: number;
  totalDuration: number;
  unlockStart?: string;
  unlockCliff?: string;
  granularity?: number;
  shape?: string;
};

type BatchLinearTimestampsEntry = {
  recipient: Address;
  amount: string;
  cancelable: boolean;
  transferable: boolean;
  startTime: number;
  endTime: number;
  cliffTime: number;
  unlockStart?: string;
  unlockCliff?: string;
  granularity?: number;
  shape?: string;
};

/** Broadcast a BatchLockup call and report broadcast + receipt status. */
async function submitBatch<
  F extends ContractFunctionName<typeof BatchLockupAbi, "nonpayable" | "payable">,
>(
  functionName: F,
  args: ContractFunctionArgs<typeof BatchLockupAbi, "nonpayable" | "payable", F>,
  log: Log,
  labels: { broadcast: string; ok: string; fail: string },
): Promise<void> {
  const hash = await writeContract(config, {
    abi: BatchLockupAbi as Abi,
    address: BATCH_LOCKUP.address as Address,
    args,
    functionName,
  });
  log(`${labels.broadcast}: ${hash}`);
  const receipt = await waitForTransactionReceipt(config, { hash });
  log(receipt?.status === "success" ? labels.ok : labels.fail);
}

/** Create N Linear streams in one transaction via SablierBatchLockup.createWithDurationsLL. */
export async function batchCreateLinearWithDurations(
  state: { token: string | undefined; entries: BatchLinearDurationsEntry[] },
  log: Log,
): Promise<void> {
  try {
    const token = expect(state.token, "token") as Address;
    if (!state.entries.length) throw new Error("batch must contain at least one entry");

    const decimals = await readDecimals(token);
    const sender = await senderAddress();

    const batch = state.entries.map((entry) => ({
      sender,
      cancelable: entry.cancelable,
      depositAmount: toUnits(entry.amount, decimals),
      durations: { cliff: entry.cliffDuration, total: entry.totalDuration },
      granularity: entry.granularity ?? 0,
      recipient: entry.recipient,
      shape: entry.shape ?? "",
      transferable: entry.transferable,
      unlockAmounts: {
        cliff: entry.unlockCliff ? toUnits(entry.unlockCliff, decimals) : 0n,
        start: entry.unlockStart ? toUnits(entry.unlockStart, decimals) : 0n,
      },
    }));

    const args: BatchCreateLinearWithDurationsArgs = [LOCKUP.address as Address, token, batch];
    await submitBatch("createWithDurationsLL", args, log, {
      broadcast: "Batch LL broadcast",
      fail: "Batch LL failed.",
      ok: `Batch LL of ${batch.length} streams created.`,
    });
  } catch (error) {
    erroneous(error, log);
  }
}

/** Create N Linear streams with timestamps in one transaction. */
export async function batchCreateLinearWithTimestamps(
  state: { token: string | undefined; entries: BatchLinearTimestampsEntry[] },
  log: Log,
): Promise<void> {
  try {
    const token = expect(state.token, "token") as Address;
    if (!state.entries.length) throw new Error("batch must contain at least one entry");

    const decimals = await readDecimals(token);
    const sender = await senderAddress();

    const batch = state.entries.map((entry) => ({
      sender,
      cancelable: entry.cancelable,
      cliffTime: entry.cliffTime,
      depositAmount: toUnits(entry.amount, decimals),
      granularity: entry.granularity ?? 0,
      recipient: entry.recipient,
      shape: entry.shape ?? "",
      timestamps: { end: entry.endTime, start: entry.startTime },
      transferable: entry.transferable,
      unlockAmounts: {
        cliff: entry.unlockCliff ? toUnits(entry.unlockCliff, decimals) : 0n,
        start: entry.unlockStart ? toUnits(entry.unlockStart, decimals) : 0n,
      },
    }));

    const args: BatchCreateLinearWithTimestampsArgs = [LOCKUP.address as Address, token, batch];
    await submitBatch("createWithTimestampsLL", args, log, {
      broadcast: "Batch LL (timestamps) broadcast",
      fail: "Batch LL (timestamps) failed.",
      ok: `Batch LL (timestamps) of ${batch.length} streams created.`,
    });
  } catch (error) {
    erroneous(error, log);
  }
}
