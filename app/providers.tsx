"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { config as wagmiConfig } from "@/lib/wagmi";

/**
 * Client provider stack: Wagmi + TanStack Query.
 *
 * The mount gate (`isMounted`) defers rendering of children until the client has
 * hydrated. Without it, server-rendered "disconnected" markup briefly disagrees
 * with the post-mount "connected" markup that `useAccount` produces, causing a
 * React hydration mismatch. Pattern lifted from the v3 sandbox's `Web3/index.tsx`.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 60_000,
          },
        },
      }),
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{isMounted ? children : null}</QueryClientProvider>
    </WagmiProvider>
  );
}
