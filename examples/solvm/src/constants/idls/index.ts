import SablierLockupLinearV10IDL from "./SablierLockupLinearV10";
import type SablierLockupLinearV10Type from "./SablierLockupLinearV10Type";
import TokenFaucetIDL from "./TokenFaucet";
import type TokenFaucetType from "./TokenFaucetType";

const idls = {
  linear: SablierLockupLinearV10IDL,
  faucet: TokenFaucetIDL,
} as const;

type typed = {
  linear: SablierLockupLinearV10Type;
  faucet: TokenFaucetType;
};

type idls = typeof idls;

export type { typed, idls };
export default idls;
