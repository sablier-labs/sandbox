import { sablier } from "sablier";
import BatchLockupAbi from "sablier/abi/lockup/v4.0/SablierBatchLockup.json" with { type: "json" };
import LockupAbi from "sablier/abi/lockup/v4.0/SablierLockup.json" with { type: "json" };

/**
 * Sablier Lockup v4.0 addresses + ABIs, sourced from the SDK so we never hardcode.
 *
 * NOTE: The plan referenced `chains.sepolia` and `sablier.contracts.get(...)`, but the
 * actual `sablier@^3.11.3` surface is `sablier.evm.chains.*` and `sablier.evm.contracts.get(...)`
 * with an explicit `protocol: "lockup"`. We use the v4.0 release for both the contract lookup
 * and the ABIs.
 */

const release = sablier.evm.releases.getLatest({ protocol: "lockup" });

const SEPOLIA_CHAIN_ID = 11155111;
const sepoliaChain = sablier.evm.chains.get(SEPOLIA_CHAIN_ID);
if (!sepoliaChain) {
  throw new Error(`Sepolia (${SEPOLIA_CHAIN_ID}) not found in sablier SDK chain registry.`);
}
/** Sepolia chain definition from the Sablier SDK. */
export const SEPOLIA = sepoliaChain;

const lockupContract = sablier.evm.contracts.get({
  chainId: SEPOLIA.id,
  contractName: "SablierLockup",
  protocol: "lockup",
  release,
});
const batchContract = sablier.evm.contracts.get({
  chainId: SEPOLIA.id,
  contractName: "SablierBatchLockup",
  protocol: "lockup",
  release,
});

if (!lockupContract || !batchContract) {
  throw new Error(
    `Missing Sablier Lockup v4.0 contracts for chainId ${SEPOLIA.id}. Check the sablier SDK release index.`,
  );
}

/** SablierLockup deployment on Sepolia (unified LL/LD/LT contract in v4.0). */
export const LOCKUP = lockupContract;

/** SablierBatchLockup deployment on Sepolia. */
export const BATCH_LOCKUP = batchContract;

export { BatchLockupAbi, LockupAbi };
