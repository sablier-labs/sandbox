import { http } from "viem";
import { createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

/**
 * Wagmi config for the sandbox. Single chain (Sepolia) + injected connector.
 *
 * Mirrors `~/sablier/business/accounting`'s lightweight setup; we don't need
 * WalletConnect or Coinbase Wallet for the integration examples.
 */
export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
});

declare module "wagmi" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: wagmi's Register augmentation must be an interface
  interface Register {
    config: typeof config;
  }
}
