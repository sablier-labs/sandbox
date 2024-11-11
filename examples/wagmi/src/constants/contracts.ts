/**
 * The official Sablier smart contracts used and recognized by the UI at https://app.sablier.com
 *
 * -------------------------------------------------------------------------------------
 *
 * The contracts have been deployed from the following commits:
 *
 * | Repo         | Tag    | Commit                                                    |
 * | ------------ | ------ | --------------------------------------------------------- |
 * | v2-core      | v1.1.2 | https://github.com/sablier-labs/v2-core/tree/a4bf69c      |
 * | v2-periphery | v1.1.1 | https://github.com/sablier-labs/v2-periphery/tree/53e2590 |
 *
 * -------------------------------------------------------------------------------------
 *
 */
import { IAddress } from "../types";
import { SEPOLIA_CHAIN_ID } from "./chains";

export const contracts = {
  [SEPOLIA_CHAIN_ID]: {
    SablierBatchLockup: "0xd2569DC4A58dfE85d807Dffb976dbC0a3bf0B0Fb" as IAddress,
    SablierLockupDynamic: "0xc9940AD8F43aAD8e8f33A4D5dbBf0a8F7FF4429A" as IAddress,
    SablierLockupLinear: "0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301" as IAddress,
  },
};

export const SEPOLIA_DAI = "0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A";

export const REGEX_ADDRESS = /^[0-9xXAaBbCcDdEeFf]+$/;
export const REGEX_FLOAT = /^[0-9]+[.,]?[0-9]+?$/;
export const REGEX_INTEGER = /^[0-9]+$/;

export * as ABI from "./abi";
