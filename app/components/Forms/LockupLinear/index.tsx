"use client";

import { ChevronRight, Send, Stamp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Console } from "@/components/ui/Console";
import { Field, Toggle } from "@/components/ui/Field";
import { LOCKUP_LINEAR_WITH_DURATIONS } from "@/constants/data";
import { approve } from "@/lib/erc20";
import { createLinearWithDurations } from "@/lib/lockup-core";
import { LOCKUP } from "@/lib/sablier";

export function LockupLinear() {
  const [state, setState] = useState({ ...LOCKUP_LINEAR_WITH_DURATIONS });
  const [logs, setLogs] = useState<string[]>([]);
  const log = (msg: string) => setLogs((prev) => [...prev, msg]);

  function update<K extends keyof typeof state>(key: K, value: (typeof state)[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="border-b border-ink-300 pb-3 text-lg font-bold text-white">
        Create Linear Stream <span className="font-medium text-mist-400">(durations)</span>
      </h2>

      <Field
        helperText="Sepolia DAI by default"
        label="Token address"
        onChange={(e) => update("token", e.target.value as typeof state.token)}
        value={state.token}
      />
      <Field
        label="Recipient"
        onChange={(e) => update("recipient", e.target.value as typeof state.recipient)}
        value={state.recipient}
      />
      <Field
        helperText="Human-readable amount (decimals are read on-chain)"
        label="Deposit amount"
        onChange={(e) => update("amount", e.target.value)}
        value={state.amount}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field
          helperText="seconds"
          label="Cliff duration"
          onChange={(e) => update("cliffDuration", e.target.value)}
          value={state.cliffDuration}
        />
        <Field
          helperText="seconds (must be ≥ cliff)"
          label="Total duration"
          onChange={(e) => update("totalDuration", e.target.value)}
          value={state.totalDuration}
        />
      </div>

      <details className="group rounded-md border-2 border-ink-300 bg-ink-100 px-4 py-3">
        <summary className="flex cursor-pointer items-center gap-2 text-xs font-semibold tracking-wide text-mist-200 uppercase transition-colors hover:text-white">
          <ChevronRight className="size-3 transition-transform group-open:rotate-90" />
          v4.0 advanced fields
        </summary>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <Field
            helperText="Token units"
            label="Unlock @ start"
            onChange={(e) => update("unlockStart", e.target.value)}
            value={state.unlockStart}
          />
          <Field
            helperText="Token units"
            label="Unlock @ cliff"
            onChange={(e) => update("unlockCliff", e.target.value)}
            value={state.unlockCliff}
          />
          <Field
            helperText="uint40 step (seconds)"
            label="Granularity"
            onChange={(e) => update("granularity", e.target.value)}
            value={state.granularity}
          />
        </div>
        <Field
          className="mt-3"
          helperText="Optional traceability tag"
          label="Shape"
          onChange={(e) => update("shape", e.target.value)}
          value={state.shape}
        />
      </details>

      <div className="flex flex-wrap gap-4">
        <Toggle
          checked={state.cancelability}
          label="Cancelable"
          onChange={(v) => update("cancelability", v)}
        />
        <Toggle
          checked={state.transferability}
          label="Transferable"
          onChange={(v) => update("transferability", v)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-ink-300 pt-4">
        <Button
          intent="secondary"
          onClick={() =>
            approve(
              { amount: "1000000", spender: LOCKUP.address as `0x${string}`, token: state.token },
              log,
            )
          }
        >
          <Stamp className="size-4" />
          Approve DAI
        </Button>
        <Button onClick={() => createLinearWithDurations(state, log)}>
          <Send className="size-4" />
          Create stream
        </Button>
      </div>

      <Console logs={logs} />
    </div>
  );
}
