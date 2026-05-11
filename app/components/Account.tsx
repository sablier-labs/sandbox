"use client";

import { Plug, Power } from "lucide-react";
import { formatEther } from "viem";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { sepolia } from "wagmi/chains";
import { SEPOLIA } from "@/lib/sablier";
import { shortAddress } from "@/lib/utils";

export function Account() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  // Use the wagmi-provided sepolia.id literal so the call type-checks against the registered config.
  const balance = useBalance({ address, chainId: sepolia.id });

  if (!isConnected) {
    const connector = connectors[0];
    return (
      <div className="flex flex-col items-start gap-3 rounded-md border-2 border-ink-300 bg-ink-50 p-5">
        <p className="text-sm text-mist-300">Connect a wallet to start.</p>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange/90"
          disabled={!connector}
          onClick={() => connector && connect({ connector })}
          type="button"
        >
          <Plug className="size-4" />
          Connect {connector?.name ?? "Wallet"}
        </button>
      </div>
    );
  }

  const onSepolia = chainId === SEPOLIA.id;
  return (
    <div className="flex flex-col gap-2 rounded-md border-2 border-ink-300 bg-ink-50 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-white">
          {address ? shortAddress(address) : "—"}
        </span>
        <button
          className="inline-flex items-center gap-1 text-xs text-mist-300 hover:text-white"
          onClick={() => disconnect()}
          type="button"
        >
          <Power className="size-3" /> Disconnect
        </button>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={onSepolia ? "text-success" : "text-danger"}>
          {onSepolia ? "Connected to Sepolia" : `Wrong chain (${chainId}) — switch to Sepolia`}
        </span>
        <span className="text-mist-300 tabular-nums">
          {balance.data
            ? `${formatEther(balance.data.value)} ${balance.data.symbol}`
            : "Loading balance…"}
        </span>
      </div>
    </div>
  );
}
