import type {
  ICreateDynamicWithDurations,
  ICreateDynamicWithTimestamps,
  ICreateLinearWithDurations,
  ICreateLinearWithTimestamps,
  ICreateTranchedWithDurations,
  ICreateTranchedWithTimestamps,
} from "../types";
import { SEPOLIA_DAI } from "./contracts";

const now = BigInt(new Date().valueOf().toString().slice(0, -3));

export const APPROVE_LOCKUP_DYNAMIC = [
  "SablierLockupDynamic",
  {
    amount: "1000000",
    token: SEPOLIA_DAI,
  },
] as const;

export const APPROVE_LOCKUP_LINEAR = [
  "SablierLockupLinear",
  {
    amount: "1000000",
    token: SEPOLIA_DAI,
  },
] as const;

export const APPROVE_LOCKUP_TRANCHED = [
  "SablierLockupTranched",
  {
    amount: "1000000",
    token: SEPOLIA_DAI,
  },
] as const;

export const LOCKUP_LINEAR_WITH_DURATIONS: ICreateLinearWithDurations = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>", // Sender address
  "0xCAFE000000000000000000000000000000000000", // Recipient address
  1000n * 10n ** 18n, // 1000 SEPOLIA_DAI (18 decimals)
  SEPOLIA_DAI,
  true, // Cancelable
  true, // Transferable
  [86400n, 86400n * 4n], // Cliff for one day, ends after 4 (total) days - starts when the transaction is executed onchain
  ["0x0000000000000000000000000000000000000000", 0n], // Broker - set this to your own address to charge a fee
];

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const LOCKUP_LINEAR_WITH_TIMESTAMPS: ICreateLinearWithTimestamps = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>", // Sender address
  "0xCAFE000000000000000000000000000000000000", // Recipient address
  1000n * 10n ** 18n, // 1000 SEPOLIA_DAI (18 decimals)
  SEPOLIA_DAI,
  true, // Cancelable
  true, // Transferable
  [now, now + 86400n * 1n, now + 86400n * 30n], // Starts on August 25th, 2023 21:46:40 GMT, cliff for one day, ends after 30 (total) days
  ["0x0000000000000000000000000000000000000000", 0n], // Broker - set this to your own address to charge a fee
];

export const LOCKUP_DYNAMIC_WITH_DURATIONS: ICreateDynamicWithDurations = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>", // Sender address
  true, // Cancelable
  true, // Transferable
  "0xCAFE000000000000000000000000000000000000", // Recipient address
  1000n * 10n ** 18n, // 1000 SEPOLIA_DAI (18 decimals)
  SEPOLIA_DAI,
  ["0x0000000000000000000000000000000000000000", 0n], // Broker - set this to your own address to charge a fee
  [
    [250n * 10n ** 18n, 3n * 10n ** 18n, 86400n * 1n], // Distribute SEPOLIA_DAI 250 exponentially (exponent = 3), the first day (86400 seconds)
    [750n * 10n ** 18n, 3n * 10n ** 18n, 86400n * 1n], // Distribute SEPOLIA_DAI 750 exponentially (exponent = 3), the second day (86400 seconds)
  ],
];

export const LOCKUP_DYNAMIC_WITH_TIMESTAMPS: ICreateDynamicWithTimestamps = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>", // Sender address
  now, // August 25th, 2023 21:46:40 GMT
  true, // Cancelable
  true, // Transferable
  "0xCAFE000000000000000000000000000000000000", // Recipient address
  1000n * 10n ** 18n, // 1000 SEPOLIA_DAI (18 decimals)
  SEPOLIA_DAI,
  ["0x0000000000000000000000000000000000000000", 0n], // Broker - set this to your own address to charge a fee
  [
    [250n * 10n ** 18n, 3n * 10n ** 18n, now + 86400n * 1n], // Distribute SEPOLIA_DAI 250 exponentially (exponent = 3), by the end of the first day
    [750n * 10n ** 18n, 3n * 10n ** 18n, now + 86400n * 30n], // Distribute another SEPOLIA_DAI 750 exponentially (exponent = 3), by the end of the month (30 days)
  ],
];

export const LOCKUP_TRANCHED_WITH_DURATIONS: ICreateTranchedWithDurations = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>", // Sender address
  true, // Cancelable
  true, // Transferable
  "0xCAFE000000000000000000000000000000000000", // Recipient address
  1000n * 10n ** 18n, // 1000 SEPOLIA_DAI (18 decimals)
  SEPOLIA_DAI,
  ["0x0000000000000000000000000000000000000000", 0n], // Broker - set this to your own address to charge a fee
  [
    [250n * 10n ** 18n, 86400n * 1n], // Distribute SEPOLIA_DAI 250 in a step, at the end of the first day (86400 seconds)
    [750n * 10n ** 18n, 86400n * 1n], // Distribute SEPOLIA_DAI 750 in a step, at the end of the second day (86400 seconds)
  ],
];

export const LOCKUP_TRANCHED_WITH_TIMESTAMPS: ICreateTranchedWithTimestamps = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>", // Sender address
  now, // August 25th, 2023 21:46:40 GMT
  true, // Cancelable
  true, // Transferable
  "0xCAFE000000000000000000000000000000000000", // Recipient address
  1000n * 10n ** 18n, // 1000 SEPOLIA_DAI (18 decimals)
  SEPOLIA_DAI,
  ["0x0000000000000000000000000000000000000000", 0n], // Broker - set this to your own address to charge a fee
  [
    [250n * 10n ** 18n, now + 86400n * 1n], // Distribute SEPOLIA_DAI 250 in a step, at the end of the first day
    [750n * 10n ** 18n, now + 86400n * 30n], // Distribute another SEPOLIA_DAI 750 in a step, at the end of the month (30 days)
  ],
];
