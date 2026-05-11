import type { Address } from "viem";
import { getAccount } from "wagmi/actions";
import { config } from "./wagmi";

/** Read the currently connected wallet address or throw a user-friendly error. */
export async function senderAddress(): Promise<Address> {
  const sender = getAccount(config).address;
  if (!sender) throw new Error("Wallet not connected.");
  return sender;
}
