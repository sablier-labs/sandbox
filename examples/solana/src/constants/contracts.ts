/**
 * The official Sablier smart contracts used and recognized by the UI at https://app.sablier.com
 *
 * -------------------------------------------------------------------------------------
 * See docs.sablier.com for official deployment addresses.
 *
 */
import { IAddress } from "../types";
import { DEVNET_CHAIN_ID } from "./chains";

export const contracts = {
  [DEVNET_CHAIN_ID]: {
    SablierBatchLockup: "11111111111111111111111111111111" as IAddress, // System Program placeholder
    SablierLockupDynamic: "11111111111111111111111111111111" as IAddress, // System Program placeholder
    SablierLockupLinear: "11111111111111111111111111111111" as IAddress, // System Program placeholder
    SablierLockupTranched: "11111111111111111111111111111111" as IAddress, // System Program placeholder
    SablierFlow: "11111111111111111111111111111111" as IAddress, // System Program placeholder
  },
};


export const USDC_DEVNET = "6SNumpJmqb1CAKsxxiVqXxjTUXe1TxPbUi9jd7wG4a1P";

export const REGEX_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]+$/;
export const REGEX_FLOAT = /^[0-9]+[.,]?[0-9]+?$/;
export const REGEX_INTEGER = /^[0-9]+$/;

export * as idsl from "./idls";
