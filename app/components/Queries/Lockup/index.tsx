"use client";

import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { INDEXER_ENDPOINT } from "@/lib/indexer";
import { LOCKUP, SEPOLIA } from "@/lib/sablier";
import { fromUnits, shortAddress } from "@/lib/utils";

const client = new GraphQLClient(INDEXER_ENDPOINT);

/**
 * v4.0 schema query. The entity name on the new Envio HyperIndex deployment is
 * `LockupStream` (not `Stream`). Filters use Hasura `_eq` / `_ilike` operators.
 *
 * Field set kept to the v4.0-relevant columns: `shape`, `granularity`, and the
 * unlock breakdown (`initial`, `cliff`) are new in v4.0. The query is filtered
 * to the current LOCKUP contract on the current chain.
 */
const QUERY = gql`
  query LockupGetStreams($first: Int!, $chainId: numeric!, $contract: String!) {
    streams: LockupStream(
      limit: $first
      order_by: { subgraphId: desc }
      where: { chainId: { _eq: $chainId }, contract: { _ilike: $contract } }
    ) {
      id
      alias
      chainId
      category
      shape
      sender
      recipient
      startTime
      endTime
      depositAmount
      withdrawnAmount
      intactAmount
      cancelable
      canceled
      cliff
      initial
      asset {
        id
        decimals
        symbol
      }
    }
  }
`;

type Stream = {
  id: string;
  alias: string;
  chainId: string;
  category: string;
  shape: string | null;
  sender: string;
  recipient: string;
  startTime: string;
  endTime: string;
  depositAmount: string;
  withdrawnAmount: string;
  intactAmount: string;
  cancelable: boolean;
  canceled: boolean;
  cliff: boolean;
  initial: string | null;
  asset: { id: string; decimals: number; symbol: string };
};

export function LockupQueries() {
  const query = useQuery({
    queryKey: ["lockup-streams", LOCKUP.address],
    queryFn: () =>
      client.request<{ streams: Stream[] }>(QUERY, {
        chainId: SEPOLIA.id,
        contract: LOCKUP.address.toLowerCase(),
        first: 10,
      }),
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex flex-wrap items-center gap-1.5 text-xs text-mist-300">
          Endpoint
          <code className="rounded-sm bg-ink-200 px-1.5 py-0.5 font-mono text-[11px] break-all text-mist">
            {INDEXER_ENDPOINT}
          </code>
        </span>
        <Button intent="ghost" onClick={() => query.refetch()}>
          <RefreshCw className={`size-3 ${query.isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {query.isLoading ? (
        <div aria-label="Loading streams" className="flex flex-col gap-2" role="status">
          {[0, 1, 2, 3].map((i) => (
            <div className="h-8 animate-pulse rounded-md bg-ink-100" key={i} />
          ))}
        </div>
      ) : null}
      {query.error ? (
        <p className="rounded-md border-2 border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          Failed to load: {(query.error as Error).message}
        </p>
      ) : null}

      {query.data ? (
        <div className="overflow-x-auto rounded-md border border-ink-300">
          <table className="w-full font-mono text-xs">
            <thead className="bg-ink-100/40 text-[11px] tracking-wider text-mist-300 uppercase">
              <tr>
                <th className="p-2.5 text-left font-semibold">Stream</th>
                <th className="p-2.5 text-left font-semibold">Category</th>
                <th className="p-2.5 text-left font-semibold">Shape</th>
                <th className="p-2.5 text-left font-semibold">Sender</th>
                <th className="p-2.5 text-left font-semibold">Recipient</th>
                <th className="p-2.5 text-right font-semibold tabular-nums">Deposit</th>
                <th className="p-2.5 text-right font-semibold tabular-nums">Withdrawn</th>
                <th className="p-2.5 text-right font-semibold tabular-nums">Intact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-300/60">
              {query.data.streams.map((s) => (
                <tr className="text-white transition-colors hover:bg-ink-100/40" key={s.id}>
                  <td className="p-2.5">{s.alias || s.id}</td>
                  <td className="p-2.5 text-mist-300">{s.category}</td>
                  <td className="p-2.5 text-mist-300">{s.shape || "—"}</td>
                  <td className="p-2.5">{shortAddress(s.sender)}</td>
                  <td className="p-2.5">{shortAddress(s.recipient)}</td>
                  <td className="p-2.5 text-right tabular-nums">
                    {fromUnits(BigInt(s.depositAmount), s.asset.decimals)}{" "}
                    <span className="text-mist-400">{s.asset.symbol}</span>
                  </td>
                  <td className="p-2.5 text-right tabular-nums">
                    {fromUnits(BigInt(s.withdrawnAmount), s.asset.decimals)}
                  </td>
                  <td className="p-2.5 text-right tabular-nums">
                    {fromUnits(BigInt(s.intactAmount), s.asset.decimals)}
                  </td>
                </tr>
              ))}
              {!query.data.streams.length ? (
                <tr>
                  <td className="p-6 text-center text-mist-300" colSpan={8}>
                    No streams yet — create one above.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
