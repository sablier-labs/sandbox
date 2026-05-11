"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Tabs } from "@/components/ui/Tabs";
import { LockupHeadless } from "./LockupHeadless";
import { LockupLinear } from "./LockupLinear";
import { LockupTranched } from "./LockupTranched";
import { LockupWithdraw } from "./LockupWithdraw";

const tabs = [
  { label: "Linear", value: "linear" },
  { label: "Tranched", value: "tranched" },
  { label: "Withdraw", value: "withdraw" },
  { label: "Headless", value: "headless" },
] as const;

type TabId = (typeof tabs)[number]["value"];

export function Forms() {
  const [tab, setTab] = useState<TabId>("linear");
  const { isConnected } = useAccount();

  if (!isConnected) return null;

  return (
    <section className="flex h-fit w-full flex-col rounded-md border-2 border-ink-300 bg-ink-50 shadow-sm shadow-black/20">
      <Tabs<TabId> active={tab} onChange={setTab} options={[...tabs]} purpose="feature" />
      <div className="px-5 pt-4 pb-5">
        {tab === "linear" ? <LockupLinear /> : null}
        {tab === "tranched" ? <LockupTranched /> : null}
        {tab === "withdraw" ? <LockupWithdraw /> : null}
        {tab === "headless" ? <LockupHeadless /> : null}
      </div>
    </section>
  );
}
