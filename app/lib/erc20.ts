import type { Address } from "viem";
import { erc20Abi } from "viem";
import { readContract, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { erroneous, expect, toUnits } from "./utils";
import { config } from "./wagmi";

/** Read a token's decimals via the standard ERC-20 ABI shipped with viem. */
export async function readDecimals(token: Address): Promise<number> {
  return readContract(config, {
    abi: erc20Abi,
    address: token,
    functionName: "decimals",
  });
}

/** Approve `spender` to pull `amount` of `token` from the caller. */
export async function approve(
  state: { token: string | undefined; spender: Address; amount: string | undefined },
  log: (msg: string) => void,
): Promise<void> {
  try {
    const token = expect(state.token, "token") as Address;
    const amountStr = expect(state.amount, "amount");

    const decimals = await readDecimals(token);
    const amount = toUnits(amountStr, decimals);

    const hash = await writeContract(config, {
      abi: erc20Abi,
      address: token,
      args: [state.spender, amount],
      functionName: "approve",
    });
    log(`Approval sent: ${hash}`);

    const receipt = await waitForTransactionReceipt(config, { hash });
    log(
      receipt?.status === "success"
        ? `Approved ${state.spender} for ${state.amount} units.`
        : `Approval failed.`,
    );
  } catch (error) {
    erroneous(error, log);
  }
}
