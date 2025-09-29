import { type PropsWithChildren, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import _ from "lodash";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

function Body({ children }: PropsWithChildren<unknown>) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return false;
  }

  return children;
}

function Web3Provider({ children }: PropsWithChildren<unknown>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Body>{children}</Body>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3Provider;
