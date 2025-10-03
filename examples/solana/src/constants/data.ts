import type {
  IAddress,
  IBatchCreateLinearWithDurations,
  IBatchCreateLinearWithTimestamps,
  ICreateLinearWithDurations,
  ICreateLinearWithTimestamps,
} from "../types";
import { DEVNET_CHAIN_ID } from "./chains";
import { contracts } from "./contracts";
import { USDC_DEVNET } from "./contracts";

const now = Number(new Date().valueOf().toString().slice(0, -3));

export const LOCKUP_LINEAR_WITH_DURATIONS: ICreateLinearWithDurations = {
  sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  recipient: "4AXzuF7f9RtHDTPmTtUbiDxXSXVVjyS1S49mbPKH4Bk1", // Recipient address
  totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  asset: USDC_DEVNET, // DAI address
  cancelable: true, // Cancelable
  transferable: true, // Transferable
  durations: { cliff: 86400, total: 86400 * 4 }, // Cliff for one day, ends after 4 (total) days - starts when the transaction is executed onchain
};

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const LOCKUP_LINEAR_WITH_TIMESTAMPS: ICreateLinearWithTimestamps = {
  sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  recipient: "0xCAFE000000000000000000000000000000000000", // Recipient address
  totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  asset: USDC_DEVNET, // DAI address
  cancelable: true, // Cancelable
  transferable: true, // Transferable
  timestamps: { start: now, cliff: now + 86400 * 1, end: now + 86400 * 30 }, // Starts on August 25th, 2023 21:46:40 GMT, cliff for one day, ends after 30 (total) days
};

/** ---------------------------------------------------------------------------------- */

export const BATCH_LOCKUP_LINEAR_WITH_DURATIONS: IBatchCreateLinearWithDurations = [
  contracts[DEVNET_CHAIN_ID].SablierLockupLinear,
  USDC_DEVNET,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      durations: { cliff: 86400, total: 86400 * 4 }, // Cliff for one day, ends after 4 (total) days - starts when the transaction is executed onchain
      // Broker - set this to your own address to charge a fee]
    },
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 2000n * 10n ** 18n, // 2000 DAI (18 decimals)
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      durations: { cliff: 86400, total: 86400 * 4 }, // Cliff for one day, ends after 4 (total) days - starts when the transaction is executed onchain// Broker - set this to your own address to charge a fee]
    },
  ],
];

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const BATCH_LOCKUP_LINEAR_WITH_TIMESTAMPS: IBatchCreateLinearWithTimestamps = [
  contracts[DEVNET_CHAIN_ID].SablierLockupLinear,
  USDC_DEVNET,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      timestamps: {
        start: now,
        cliff: now + 86400 * 1,
        end: now + 86400 * 30,
      }, // Starts on August 25th, 2023 21:46:40 GMT, cliff for one day, ends after 30 (total) days
    },
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 2000n * 10n ** 18n, // 2000 DAI (18 decimals)
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      timestamps: {
        start: now,
        cliff: now + 86400 * 1,
        end: now + 86400 * 30,
      }, // Starts on August 25th, 2023 21:46:40 GMT, cliff for one day, ends after 30 (total) days
    },
  ],
];
