import { default as ERC20 } from "./ERC20Mintable";
import { default as SablierBatchLockup } from "./SablierBatchLockup";
import { default as SablierFlow } from "./SablierFlow";
import { default as SablierLockupDynamic } from "./SablierLockupDynamic";
import { default as SablierLockupLinear } from "./SablierLockupLinear";
import { default as SablierLockupTranched } from "./SablierLockupTranched";

const ABI = {
  ERC20,
  SablierBatchLockup,
  SablierFlow,
  SablierLockupDynamic,
  SablierLockupLinear,
  SablierLockupTranched,
} as const;

export default ABI;
