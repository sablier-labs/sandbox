import { default as ERC20 } from "./ERC20Mintable";
import { default as SablierLockupDynamic } from "./SablierLockupDynamic";
import { default as SablierLockupLinear } from "./SablierLockupLinear";
import { default as SablierLockupTranched } from "./SablierLockupTranched";

/**
 * You can also source these ABIs from NPM packages: "@sablier/v2-core" and "@sablier/v2-periphery".
 * Note: Imports from NPM packages (not local, without 'as const') will prevent viem (abitype) from resolving types from the JSON ABIs.
 */

const ABI = {
  ERC20,
  SablierLockupDynamic,
  SablierLockupLinear,
  SablierLockupTranched,
} as const;

export default ABI;
