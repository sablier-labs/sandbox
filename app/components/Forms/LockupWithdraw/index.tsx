"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Console } from "@/components/ui/Console";
import { Field } from "@/components/ui/Field";
import { withdrawFromLockup } from "@/lib/lockup-core";

export function LockupWithdraw() {
  const [state, setState] = useState<{ streamId: string; amount: string }>({
    amount: "1",
    streamId: "",
  });
  const [logs, setLogs] = useState<string[]>([]);
  const log = (msg: string) => setLogs((prev) => [...prev, msg]);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="border-b border-ink-300 pb-3 text-lg font-bold text-white">
        Withdraw from Lockup
      </h2>
      <Field
        helperText="numeric stream id (uint256)"
        label="Stream id"
        onChange={(e) => setState((p) => ({ ...p, streamId: e.target.value }))}
        value={state.streamId}
      />
      <Field
        helperText="Human-readable amount; decimals resolved on-chain"
        label="Withdraw amount"
        onChange={(e) => setState((p) => ({ ...p, amount: e.target.value }))}
        value={state.amount}
      />
      <div className="flex items-center justify-end border-t border-ink-300 pt-4">
        <Button onClick={() => withdrawFromLockup(state, log)}>
          <Download className="size-4" />
          Withdraw
        </Button>
      </div>
      <Console logs={logs} />
    </div>
  );
}
