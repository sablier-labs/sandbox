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
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border-2 border-ink-300 bg-ink-50 px-5 py-4">
        <p className="text-sm text-mist-300">Connect a wallet to start.</p>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange/30 transition-colors hover:bg-orange/90 focus-visible:ring-2 focus-visible:ring-orange/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
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
  const rawBalance = balance.data ? formatEther(balance.data.value) : null;
  const prettyBalance = rawBalance ? Number(rawBalance).toFixed(4) : null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-md border-2 border-ink-300 bg-ink-50 px-5 py-4">
      <div className="flex items-center gap-3">
        <span
          className={`inline-block size-2 rounded-full ${
            onSepolia ? "bg-success shadow-[0_0_8px] shadow-success/60" : "bg-danger"
          }`}
        />
        <span className="font-mono text-sm text-white">
          {address ? shortAddress(address) : "—"}
        </span>
        <span className={`text-xs ${onSepolia ? "text-success" : "text-danger"}`}>
          {onSepolia ? "Sepolia" : `Wrong chain (${chainId}) — switch to Sepolia`}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span
          className="font-mono text-sm text-mist-200 tabular-nums"
          title={rawBalance ? `${rawBalance} ${balance.data?.symbol ?? ""}` : undefined}
        >
          {prettyBalance ? `${prettyBalance} ${balance.data?.symbol ?? ""}` : "…"}
        </span>
        <button
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-mist-300 transition-colors hover:bg-ink-200 hover:text-white"
          onClick={() => disconnect()}
          type="button"
        >
          <Power className="size-3" /> Disconnect
        </button>
      </div>
    </div>
  );
}
