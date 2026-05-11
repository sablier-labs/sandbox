"use client";

import { useAccount } from "wagmi";
import { LockupQueries } from "./Lockup";

export function Queries() {
  const { isConnected } = useAccount();
  if (!isConnected) return null;

  return (
    <section className="flex w-full flex-col gap-4 rounded-md border-2 border-ink-300 bg-ink-50 p-5">
      <h2 className="text-lg font-bold text-white">Recent Lockup streams (Envio)</h2>
      <LockupQueries />
    </section>
  );
}
