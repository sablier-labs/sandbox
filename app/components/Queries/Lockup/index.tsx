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
      <div className="flex items-center justify-between">
        <span className="text-xs text-mist-300">
          Endpoint:{" "}
          <code className="rounded-sm bg-ink-300 px-1 py-0.5 font-mono text-white">
            {INDEXER_ENDPOINT}
          </code>
        </span>
        <Button intent="ghost" onClick={() => query.refetch()}>
          <RefreshCw className="size-3" /> Refresh
        </Button>
      </div>

      {query.isLoading ? <p className="text-sm text-mist-300">Loading streams…</p> : null}
      {query.error ? (
        <p className="text-sm text-danger">Failed to load: {(query.error as Error).message}</p>
      ) : null}

      {query.data ? (
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead className="text-mist-300 uppercase">
              <tr className="border-b border-ink-300">
                <th className="p-2 text-left">Stream</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Shape</th>
                <th className="p-2 text-left">Sender</th>
                <th className="p-2 text-left">Recipient</th>
                <th className="p-2 text-right tabular-nums">Deposit</th>
                <th className="p-2 text-right tabular-nums">Withdrawn</th>
                <th className="p-2 text-right tabular-nums">Intact</th>
              </tr>
            </thead>
            <tbody>
              {query.data.streams.map((s) => (
                <tr className="border-b border-ink-300 text-white" key={s.id}>
                  <td className="p-2">{s.alias || s.id}</td>
                  <td className="p-2 text-mist-200">{s.category}</td>
                  <td className="p-2 text-mist-200">{s.shape || "—"}</td>
                  <td className="p-2">{shortAddress(s.sender)}</td>
                  <td className="p-2">{shortAddress(s.recipient)}</td>
                  <td className="p-2 text-right tabular-nums">
                    {fromUnits(BigInt(s.depositAmount), s.asset.decimals)} {s.asset.symbol}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {fromUnits(BigInt(s.withdrawnAmount), s.asset.decimals)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {fromUnits(BigInt(s.intactAmount), s.asset.decimals)}
                  </td>
                </tr>
              ))}
              {!query.data.streams.length ? (
                <tr>
                  <td className="p-3 text-center text-mist-300" colSpan={8}>
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
