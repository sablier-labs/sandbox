import { default as ERC20 } from "./ERC20Mintable";
import { default as SablierLockupDynamic } from "./SablierLockupDynamic";
import { default as SablierLockupLinear } from "./SablierLockupLinear";
import { default as SablierLockupTranched } from "./SablierLockupTranched";

const ABI = {
  ERC20,
  SablierLockupDynamic,
  SablierLockupLinear,
  SablierLockupTranched,
} as const;

export default ABI;
