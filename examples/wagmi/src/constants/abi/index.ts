import { default as SablierLockupDynamic } from "@sablier/v2-core/artifacts/SablierV2LockupDynamic.json";
import { default as SablierLockupLinear } from "@sablier/v2-core/artifacts/SablierV2LockupLinear.json";
import { default as SablierBatchLockup } from "@sablier/v2-periphery/artifacts/SablierV2BatchLockup.json";
import { default as ERC20 } from "./ERC20Mintable";

const ABI = {
  ERC20,
  SablierBatchLockup,
  SablierLockupDynamic,
  SablierLockupLinear,
} as const;

export default ABI;
