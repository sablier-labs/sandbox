import SablierLockupLinearV10IDL from "./SablierLockupLinearV10";
import TokenFaucetIDL from "./TokenFaucet";

const idls = {
  linear: SablierLockupLinearV10IDL,
  faucet: TokenFaucetIDL,
} as const;

type idls = typeof idls;

export type { idls };
export default idls;
