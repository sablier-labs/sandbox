import React, { createContext, useContext, useMemo } from "react";
import { useWalletAccountTransactionSigner } from "@solana/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { UiWalletAccount, useWallets } from "@wallet-standard/react-core";

type SignerValue = ReturnType<typeof useWalletAccountTransactionSigner> | null;

const SignerCtx = createContext<SignerValue>(null);
export const useTransactionSigner = () => useContext(SignerCtx);

function useConnectedUiWalletAccount(): UiWalletAccount | null {
  const { publicKey } = useWallet();
  const wallets = useWallets();
  return useMemo(() => {
    if (!publicKey) return null;
    const pk58 = publicKey.toBase58();
    for (const w of wallets) {
      const match = w.accounts.find((a) => a.address === pk58);
      if (match) return match;
    }
    return null;
  }, [wallets, publicKey]);
}

function SignerInner({
  account,
  chain,
  children,
}: {
  account: UiWalletAccount;
  chain: `solana:${string}`;
  children: React.ReactNode;
}) {
  const signer = useWalletAccountTransactionSigner(account, chain);
  return <SignerCtx.Provider value={signer}>{children}</SignerCtx.Provider>;
}

export function SignerProvider({
  chain = "solana:devnet",
  children,
}: {
  chain?: `solana:${string}`;
  children: React.ReactNode;
}) {
  const account = useConnectedUiWalletAccount();

  if (!account) return <SignerCtx.Provider value={null}>{children}</SignerCtx.Provider>;

  return (
    <SignerInner account={account} chain={chain}>
      {children}
    </SignerInner>
  );
}
