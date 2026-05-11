import type { Abi, Address, ContractFunctionArgs, ContractFunctionName } from "viem";
import { readContract, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { senderAddress } from "./account";
import { readDecimals } from "./erc20";
import { LOCKUP, LockupAbi } from "./sablier";
import { erroneous, expect, toUnits } from "./utils";
import { config } from "./wagmi";

type Log = (msg: string) => void;

/**
 * v4.0 ABI-derived argument types. Everything flows from the JSON ABI so a
 * Solidity-side rename trips TypeScript before it can ship.
 */
export type CreateLinearWithDurationsArgs = ContractFunctionArgs<
  typeof LockupAbi,
  "nonpayable" | "payable",
  "createWithDurationsLL"
>;
export type CreateLinearWithTimestampsArgs = ContractFunctionArgs<
  typeof LockupAbi,
  "nonpayable" | "payable",
  "createWithTimestampsLL"
>;
export type CreateTranchedWithDurationsArgs = ContractFunctionArgs<
  typeof LockupAbi,
  "nonpayable" | "payable",
  "createWithDurationsLT"
>;
export type CreateTranchedWithTimestampsArgs = ContractFunctionArgs<
  typeof LockupAbi,
  "nonpayable" | "payable",
  "createWithTimestampsLT"
>;
export type WithdrawArgs = ContractFunctionArgs<
  typeof LockupAbi,
  "nonpayable" | "payable",
  "withdraw"
>;

type LinearSharedState = {
  amount: string | undefined;
  cancelability: boolean;
  recipient: string | undefined;
  token: string | undefined;
  transferability: boolean;
  shape?: string;
  unlockStart?: string;
  unlockCliff?: string;
  granularity?: string;
};

type LinearDurationsState = LinearSharedState & {
  cliffDuration: string | undefined;
  totalDuration: string | undefined;
};

type LinearTimestampsState = LinearSharedState & {
  startTime: string | undefined;
  endTime: string | undefined;
  cliffTime: string | undefined;
};

type TrancheInput = { amount: string | undefined; duration: string | undefined };
type TrancheTimestampInput = { amount: string | undefined; timestamp: string | undefined };

type TranchedDurationsState = {
  cancelability: boolean;
  recipient: string | undefined;
  token: string | undefined;
  transferability: boolean;
  tranches: TrancheInput[];
  shape?: string;
};

type TranchedTimestampsState = {
  cancelability: boolean;
  recipient: string | undefined;
  token: string | undefined;
  transferability: boolean;
  startTime: string | undefined;
  endTime: string | undefined;
  tranches: TrancheTimestampInput[];
  shape?: string;
};

/**
 * Broadcast a call on `SablierLockup` and report broadcast + final-receipt status
 * via the caller-supplied log channel. Used by every `createWith*` and `withdraw`
 * flow so they share a single transaction lifecycle.
 */
async function submitLockup<
  F extends ContractFunctionName<typeof LockupAbi, "nonpayable" | "payable">,
>(
  functionName: F,
  args: ContractFunctionArgs<typeof LockupAbi, "nonpayable" | "payable", F>,
  log: Log,
  labels: { broadcast: string; ok: string; fail: string },
): Promise<void> {
  const hash = await writeContract(config, {
    abi: LockupAbi as Abi,
    address: LOCKUP.address as Address,
    args,
    functionName,
  });
  log(`${labels.broadcast}: ${hash}`);
  const receipt = await waitForTransactionReceipt(config, { hash });
  log(receipt?.status === "success" ? labels.ok : labels.fail);
}

/* ------------------------------------------------------------------ */
/*                        Lockup Linear (LL)                          */
/* ------------------------------------------------------------------ */

export async function createLinearWithDurations(
  state: LinearDurationsState,
  log: Log,
): Promise<void> {
  try {
    const token = expect(state.token, "token") as Address;
    const recipient = expect(state.recipient, "recipient") as Address;
    const amountStr = expect(state.amount, "amount");
    const totalDur = Number(expect(state.totalDuration, "total duration"));
    const cliffDur = state.cliffDuration ? Number(state.cliffDuration) : 0;

    const decimals = await readDecimals(token);
    const sender = await senderAddress();

    const args: CreateLinearWithDurationsArgs = [
      {
        cancelable: state.cancelability,
        depositAmount: toUnits(amountStr, decimals),
        recipient,
        sender,
        shape: state.shape ?? "",
        token,
        transferable: state.transferability,
      },
      {
        cliff: state.unlockCliff ? toUnits(state.unlockCliff, decimals) : 0n,
        start: state.unlockStart ? toUnits(state.unlockStart, decimals) : 0n,
      },
      state.granularity ? Number(state.granularity) : 0,
      { cliff: cliffDur, total: totalDur },
    ];

    await submitLockup("createWithDurationsLL", args, log, {
      broadcast: "LL stream broadcast",
      fail: "LL stream creation failed.",
      ok: "LL stream created.",
    });
  } catch (error) {
    erroneous(error, log);
  }
}

export async function createLinearWithTimestamps(
  state: LinearTimestampsState,
  log: Log,
): Promise<void> {
  try {
    const token = expect(state.token, "token") as Address;
    const recipient = expect(state.recipient, "recipient") as Address;
    const amountStr = expect(state.amount, "amount");
    const startTime = Number(expect(state.startTime, "startTime"));
    const endTime = Number(expect(state.endTime, "endTime"));
    const cliffTime = state.cliffTime ? Number(state.cliffTime) : 0;

    const decimals = await readDecimals(token);
    const sender = await senderAddress();

    const args: CreateLinearWithTimestampsArgs = [
      {
        cancelable: state.cancelability,
        depositAmount: toUnits(amountStr, decimals),
        recipient,
        sender,
        shape: state.shape ?? "",
        timestamps: { end: endTime, start: startTime },
        token,
        transferable: state.transferability,
      },
      {
        cliff: state.unlockCliff ? toUnits(state.unlockCliff, decimals) : 0n,
        start: state.unlockStart ? toUnits(state.unlockStart, decimals) : 0n,
      },
      state.granularity ? Number(state.granularity) : 0,
      cliffTime,
    ];

    await submitLockup("createWithTimestampsLL", args, log, {
      broadcast: "LL stream broadcast",
      fail: "LL stream creation failed.",
      ok: "LL stream created.",
    });
  } catch (error) {
    erroneous(error, log);
  }
}

/* ------------------------------------------------------------------ */
/*                       Lockup Tranched (LT)                         */
/* ------------------------------------------------------------------ */

/**
 * NOTE on v4.0 LT signatures: unlike LL, `createWithDurationsLT` /
 * `createWithTimestampsLT` take ONLY `(params, tranches[])`. The
 * `unlockAmounts` / `granularity` arguments are LL-specific and do not exist
 * on the LT variants. The plan said otherwise; the live ABI is canonical.
 */
export async function createTranchedWithDurations(
  state: TranchedDurationsState,
  log: Log,
): Promise<void> {
  try {
    const token = expect(state.token, "token") as Address;
    const recipient = expect(state.recipient, "recipient") as Address;
    if (!state.tranches?.length) throw new Error("at least one tranche is required");

    const decimals = await readDecimals(token);
    const sender = await senderAddress();

    const tranches = state.tranches.map((t) => ({
      amount: toUnits(expect(t.amount, "tranche amount"), decimals),
      duration: Number(expect(t.duration, "tranche duration")),
    }));
    const depositAmount = tranches.reduce((acc, t) => acc + t.amount, 0n);

    const args: CreateTranchedWithDurationsArgs = [
      {
        cancelable: state.cancelability,
        depositAmount,
        recipient,
        sender,
        shape: state.shape ?? "",
        token,
        transferable: state.transferability,
      },
      tranches,
    ];

    await submitLockup("createWithDurationsLT", args, log, {
      broadcast: "LT stream broadcast",
      fail: "LT stream creation failed.",
      ok: "LT stream created.",
    });
  } catch (error) {
    erroneous(error, log);
  }
}

export async function createTranchedWithTimestamps(
  state: TranchedTimestampsState,
  log: Log,
): Promise<void> {
  try {
    const token = expect(state.token, "token") as Address;
    const recipient = expect(state.recipient, "recipient") as Address;
    const startTime = Number(expect(state.startTime, "startTime"));
    const endTime = Number(expect(state.endTime, "endTime"));
    if (!state.tranches?.length) throw new Error("at least one tranche is required");

    const decimals = await readDecimals(token);
    const sender = await senderAddress();

    const tranches = state.tranches.map((t) => ({
      amount: toUnits(expect(t.amount, "tranche amount"), decimals),
      timestamp: Number(expect(t.timestamp, "tranche timestamp")),
    }));
    const depositAmount = tranches.reduce((acc, t) => acc + t.amount, 0n);

    const args: CreateTranchedWithTimestampsArgs = [
      {
        cancelable: state.cancelability,
        depositAmount,
        recipient,
        sender,
        shape: state.shape ?? "",
        timestamps: { end: endTime, start: startTime },
        token,
        transferable: state.transferability,
      },
      tranches,
    ];

    await submitLockup("createWithTimestampsLT", args, log, {
      broadcast: "LT stream broadcast",
      fail: "LT stream creation failed.",
      ok: "LT stream created.",
    });
  } catch (error) {
    erroneous(error, log);
  }
}

/* ------------------------------------------------------------------ */
/*                            Withdraw                                */
/* ------------------------------------------------------------------ */

export async function withdrawFromLockup(
  state: { streamId: string | undefined; amount: string | undefined },
  log: Log,
): Promise<void> {
  try {
    const streamIdStr = expect(state.streamId, "streamId");
    const amountStr = expect(state.amount, "amount");
    const streamId = BigInt(streamIdStr);

    const [recipient, token] = await Promise.all([
      readContract(config, {
        abi: LockupAbi,
        address: LOCKUP.address as Address,
        args: [streamId],
        functionName: "getRecipient",
      }) as Promise<Address>,
      readContract(config, {
        abi: LockupAbi,
        address: LOCKUP.address as Address,
        args: [streamId],
        functionName: "getUnderlyingToken",
      }) as Promise<Address>,
    ]);

    const decimals = await readDecimals(token);
    const amount = toUnits(amountStr, decimals);

    const args: WithdrawArgs = [streamId, recipient, amount];
    await submitLockup("withdraw", args, log, {
      broadcast: "Withdraw broadcast",
      fail: `Withdraw failed for stream #${streamIdStr}.`,
      ok: `Withdrew ${amountStr} from stream #${streamIdStr}.`,
    });
  } catch (error) {
    erroneous(error, log);
  }
}
