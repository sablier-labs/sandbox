import { type PropsWithChildren, useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import _ from "lodash";
import { SignerProvider } from "../../contexts";

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
  const endpoint = "https://api.devnet.solana.com";

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={[]}
        autoConnect={false}
        onError={(error) => {
          console.error("Wallet error:", error);
        }}
      >
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <SignerProvider>
              <Body>{children}</Body>
            </SignerProvider>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default Web3Provider;
