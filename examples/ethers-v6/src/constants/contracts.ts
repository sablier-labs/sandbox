/**
 * The official Sablier smart contracts used and recognized by the UI at https://app.sablier.com
 *
 * -------------------------------------------------------------------------------------
 * See docs.sablier.com for official deployment addresses.
 *
 */
import { SEPOLIA_CHAIN_ID } from "./chains";

export const contracts = {
  [SEPOLIA_CHAIN_ID]: {
    SablierBatchLockup: "0x04a9c14b7a000640419ad5515db4ef4172c00e31",
    SablierLockupDynamic: "0x73bb6dd3f5828d60f8b3dbc8798eb10fba2c5636", // LD3
    SablierLockupLinear: "0x3e435560fd0a03ddf70694b35b673c25c65abb6c", // LL3
    SablierLockupTranched: "0x3a1bea13a8c24c0ea2b8fae91e4b2762a59d7af5", // LT3
  },
};

export const SEPOLIA_DAI = "0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A";

export const REGEX_ADDRESS = /^[0-9xXAaBbCcDdEeFf]+$/;
export const REGEX_FLOAT = /^[0-9]+[.,]?[0-9]+?$/;
export const REGEX_INTEGER = /^[0-9]+$/;

export * as ABI from "./abi";
