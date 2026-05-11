"use client";

import { Layers, Send, Stamp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Console } from "@/components/ui/Console";
import { Field } from "@/components/ui/Field";
import { Tabs } from "@/components/ui/Tabs";
import {
  LOCKUP_LINEAR_WITH_DURATIONS,
  makeLinearWithTimestamps,
  SEPOLIA_DAI,
} from "@/constants/data";
import { approve } from "@/lib/erc20";
import { createLinearWithDurations, createLinearWithTimestamps } from "@/lib/lockup-core";
import { batchCreateLinearWithDurations } from "@/lib/lockup-periphery";
import { BATCH_LOCKUP, LOCKUP } from "@/lib/sablier";
import { useHeadlessBatchStore } from "./store";

const sections = [
  { label: "Single LL (durations)", value: "single-durations" },
  { label: "Single LL (timestamps)", value: "single-timestamps" },
  { label: "Batch x5", value: "batch" },
] as const;
type SectionId = (typeof sections)[number]["value"];

export function LockupHeadless() {
  const [section, setSection] = useState<SectionId>("single-durations");

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-white">Headless mode</h2>
      <p className="text-sm text-mist-300">
        Demonstrates calling{" "}
        <code className="rounded-sm bg-ink-300 px-1 py-0.5 font-mono text-xs text-white">
          SablierLockup
        </code>{" "}
        and{" "}
        <code className="rounded-sm bg-ink-300 px-1 py-0.5 font-mono text-xs text-white">
          SablierBatchLockup
        </code>{" "}
        directly with prefilled data.
      </p>

      <Tabs<SectionId> active={section} onChange={setSection} options={[...sections]} />

      {section === "single-durations" ? <SingleDurations /> : null}
      {section === "single-timestamps" ? <SingleTimestamps /> : null}
      {section === "batch" ? <Batch /> : null}
    </div>
  );
}

function SingleDurations() {
  const [logs, setLogs] = useState<string[]>([]);
  const log = (msg: string) => setLogs((prev) => [...prev, msg]);
  const state = LOCKUP_LINEAR_WITH_DURATIONS;
  return (
    <div className="flex flex-col gap-3">
      <pre className="overflow-x-auto rounded-md border-2 border-ink-300 bg-ink p-3 font-mono text-xs text-mist-200">
        {JSON.stringify(state, null, 2)}
      </pre>
      <div className="flex flex-wrap gap-2">
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

function SingleTimestamps() {
  const [state] = useState(() => makeLinearWithTimestamps());
  const [logs, setLogs] = useState<string[]>([]);
  const log = (msg: string) => setLogs((prev) => [...prev, msg]);
  return (
    <div className="flex flex-col gap-3">
      <pre className="overflow-x-auto rounded-md border-2 border-ink-300 bg-ink p-3 font-mono text-xs text-mist-200">
        {JSON.stringify(state, null, 2)}
      </pre>
      <div className="flex flex-wrap gap-2">
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
        <Button onClick={() => createLinearWithTimestamps(state, log)}>
          <Send className="size-4" />
          Create stream
        </Button>
      </div>
      <Console logs={logs} />
    </div>
  );
}

function Batch() {
  const store = useHeadlessBatchStore();
  const { api } = store;

  return (
    <div className="flex flex-col gap-3">
      <Field
        label="Token address"
        onChange={(e) => useHeadlessBatchStore.setState({ token: e.target.value })}
        value={store.token}
      />
      {store.entries.map((entry, i) => (
        <div
          className="grid grid-cols-2 gap-2 rounded-md border-2 border-ink-300 bg-ink p-3"
          key={i}
        >
          <Field
            label={`Recipient #${i + 1}`}
            onChange={(e) =>
              api.setEntry(i, { recipient: e.target.value as typeof entry.recipient })
            }
            value={entry.recipient}
          />
          <Field
            label="Amount"
            onChange={(e) => api.setEntry(i, { amount: e.target.value })}
            value={entry.amount}
          />
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button
          intent="secondary"
          onClick={() =>
            approve(
              {
                amount: "1000000",
                spender: BATCH_LOCKUP.address as `0x${string}`,
                token: store.token || SEPOLIA_DAI,
              },
              api.log,
            )
          }
        >
          <Stamp className="size-4" />
          Approve batch contract
        </Button>
        <Button
          onClick={() =>
            batchCreateLinearWithDurations({ entries: store.entries, token: store.token }, api.log)
          }
        >
          <Layers className="size-4" />
          Batch create
        </Button>
      </div>
      <Console logs={store.logs} />
    </div>
  );
}
