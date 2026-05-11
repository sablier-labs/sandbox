"use client";

import { Plus, Send, Stamp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Console } from "@/components/ui/Console";
import { Field, Toggle } from "@/components/ui/Field";
import { approve } from "@/lib/erc20";
import { createTranchedWithDurations } from "@/lib/lockup-core";
import { LOCKUP } from "@/lib/sablier";
import { useLockupTranchedStore } from "./store";

export function LockupTranched() {
  const state = useLockupTranchedStore();
  const { api } = state;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-white">Create Tranched Stream (durations)</h2>

      <Field
        label="Token address"
        onChange={(e) => api.update("token", e.target.value)}
        value={state.token}
      />
      <Field
        label="Recipient"
        onChange={(e) => api.update("recipient", e.target.value)}
        value={state.recipient}
      />
      <Field
        helperText="Optional traceability tag"
        label="Shape"
        onChange={(e) => api.update("shape", e.target.value)}
        value={state.shape}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-mist-300 uppercase">
            Tranches
          </span>
          <Button intent="ghost" onClick={api.addTranche}>
            <Plus className="size-3" /> Add tranche
          </Button>
        </div>
        {state.tranches.map((t, i) => (
          <div className="flex items-end gap-2" key={i}>
            <Field
              className="flex-1"
              label={`#${i + 1} amount`}
              onChange={(e) => api.setTranche(i, { amount: e.target.value })}
              value={t.amount}
            />
            <Field
              className="flex-1"
              helperText="seconds"
              label="duration"
              onChange={(e) => api.setTranche(i, { duration: e.target.value })}
              value={t.duration}
            />
            <Button
              disabled={state.tranches.length <= 1}
              intent="secondary"
              onClick={() => api.removeTranche(i)}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Toggle
          checked={state.cancelability}
          label="Cancelable"
          onChange={(v) => api.update("cancelability", v)}
        />
        <Toggle
          checked={state.transferability}
          label="Transferable"
          onChange={(v) => api.update("transferability", v)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          intent="secondary"
          onClick={() =>
            approve(
              { amount: "1000000", spender: LOCKUP.address as `0x${string}`, token: state.token },
              api.log,
            )
          }
        >
          <Stamp className="size-4" />
          Approve DAI
        </Button>
        <Button
          onClick={() =>
            createTranchedWithDurations(
              {
                cancelability: state.cancelability,
                recipient: state.recipient,
                shape: state.shape,
                token: state.token,
                tranches: state.tranches,
                transferability: state.transferability,
              },
              api.log,
            )
          }
        >
          <Send className="size-4" />
          Create stream
        </Button>
      </div>

      <Console logs={state.logs} />
    </div>
  );
}
