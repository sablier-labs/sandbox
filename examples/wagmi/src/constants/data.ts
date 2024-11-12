import type {
  IAddress,
  IBatchCreateDynamicWithDurations,
  IBatchCreateDynamicWithTimestamps,
  IBatchCreateLinearWithDurations,
  IBatchCreateLinearWithTimestamps,
  IBatchCreateTranchedWithDurations,
  IBatchCreateTranchedWithTimestamps,
  ICreateDynamicWithDurations,
  ICreateDynamicWithTimestamps,
  ICreateLinearWithDurations,
  ICreateLinearWithTimestamps,
  ICreateTranchedWithDurations,
  ICreateTranchedWithTimestamps,
} from "../types";
import { SEPOLIA_CHAIN_ID } from "./chains";
import { contracts } from "./contracts";
import { SEPOLIA_DAI } from "./contracts";

const now = Number(new Date().valueOf().toString().slice(0, -3));

export const APPROVE_BATCH = [
  "SablierBatchLockup",
  {
    amount: "1000000",
    token: SEPOLIA_DAI,
  },
] as const;

export const APPROVE_LOCKUP_DYNAMIC = [
  "SablierLockupDynamic",
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

export const APPROVE_LOCKUP_LINEAR = [
  "SablierLockupLinear",
  {
    amount: "1000000",
    token: SEPOLIA_DAI,
  },
] as const;

export const LOCKUP_LINEAR_WITH_DURATIONS: ICreateLinearWithDurations = {
  sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  recipient: "0xCAFE000000000000000000000000000000000000", // Recipient address
  totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  asset: SEPOLIA_DAI, // DAI address
  cancelable: true, // Cancelable
  transferable: true, // Transferable
  durations: { cliff: 86400, total: 86400 * 4 }, // Cliff for one day, ends after 4 (total) days - starts when the transaction is executed onchain
  broker: {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
};

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const LOCKUP_LINEAR_WITH_TIMESTAMPS: ICreateLinearWithTimestamps = {
  sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  recipient: "0xCAFE000000000000000000000000000000000000", // Recipient address
  totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  asset: SEPOLIA_DAI, // DAI address
  cancelable: true, // Cancelable
  transferable: true, // Transferable
  timestamps: { start: now, cliff: now + 86400 * 1, end: now + 86400 * 30 }, // Starts on August 25th, 2023 21:46:40 GMT, cliff for one day, ends after 30 (total) days
  broker: {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
};

export const LOCKUP_DYNAMIC_WITH_DURATIONS: ICreateDynamicWithDurations = {
  sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  cancelable: true, // Cancelable
  transferable: true, // Transferable
  recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
  totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  asset: SEPOLIA_DAI, // DAI address
  broker: {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
  segments: [
    {
      amount: 250n * 10n ** 18n,
      exponent: 3n * 10n ** 18n,
      duration: 86400 * 1,
    }, // Distribute DAI 250 exponentially (exponent = 3), the first day (86400 seconds)
    {
      amount: 750n * 10n ** 18n,
      exponent: 3n * 10n ** 18n,
      duration: 86400 * 1,
    }, // Distribute DAI 750 exponentially (exponent = 3), the second day (86400 seconds)
  ],
};

export const LOCKUP_DYNAMIC_WITH_TIMESTAMPS: ICreateDynamicWithTimestamps = {
  sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  startTime: now, // August 25th, 2023 21:46:40 GMT
  cancelable: true, // Cancelable
  transferable: true, // Transferable
  recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
  totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  asset: SEPOLIA_DAI, // DAI address
  broker: {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
  segments: [
    {
      amount: 250n * 10n ** 18n,
      exponent: 3n * 10n ** 18n,
      timestamp: now + 86400 * 1,
    }, // Distribute DAI 250 exponentially (exponent = 3), by the end of the first day
    {
      amount: 750n * 10n ** 18n,
      exponent: 3n * 10n ** 18n,
      timestamp: now + 86400 * 30,
    }, // Distribute another DAI 750 exponentially (exponent = 3), by the end of the month (30 days)
  ],
};

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */

export const LOCKUP_TRANCHED_WITH_DURATIONS: ICreateTranchedWithDurations = {
  sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  cancelable: true, // Cancelable
  transferable: true, // Transferable
  recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
  totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  asset: SEPOLIA_DAI, // DAI address
  broker: {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
  tranches: [
    {
      amount: 250n * 10n ** 18n,
      duration: 86400 * 1,
    }, // Distribute DAI 250 in a step, after the first day (86400 seconds)
    {
      amount: 750n * 10n ** 18n,
      duration: 86400 * 1,
    }, // Distribute DAI 750 in a step, after the second day (86400 seconds)
  ],
};

export const LOCKUP_TRANCHED_WITH_TIMESTAMPS: ICreateTranchedWithTimestamps = {
  sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  startTime: now, // August 25th, 2023 21:46:40 GMT
  cancelable: true, // Cancelable
  transferable: true, // Transferable
  recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
  totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  asset: SEPOLIA_DAI, // DAI address
  broker: {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
  tranches: [
    {
      amount: 250n * 10n ** 18n,
      timestamp: now + 86400 * 1,
    }, // Distribute DAI 250 in a step (exponent = 3), at the end of the first day
    {
      amount: 750n * 10n ** 18n,
      timestamp: now + 86400 * 30,
    }, // Distribute another DAI 750 in a step , at the end of the month (30 days)
  ],
};

/** ---------------------------------------------------------------------------------- */

export const BATCH_LOCKUP_LINEAR_WITH_DURATIONS: IBatchCreateLinearWithDurations = [
  contracts[SEPOLIA_CHAIN_ID].SablierLockupLinear,
  SEPOLIA_DAI,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      durations: { cliff: 86400, total: 86400 * 4 }, // Cliff for one day, ends after 4 (total) days - starts when the transaction is executed onchain
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee]
    },
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 2000n * 10n ** 18n, // 2000 DAI (18 decimals)
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      durations: { cliff: 86400, total: 86400 * 4 }, // Cliff for one day, ends after 4 (total) days - starts when the transaction is executed onchain
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee]
    },
  ],
];

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const BATCH_LOCKUP_LINEAR_WITH_TIMESTAMPS: IBatchCreateLinearWithTimestamps = [
  contracts[SEPOLIA_CHAIN_ID].SablierLockupLinear,
  SEPOLIA_DAI,
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
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee]
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
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee]
    },
  ],
];

export const BATCH_LOCKUP_DYNAMIC_WITH_TIMESTAMPS: IBatchCreateDynamicWithTimestamps = [
  contracts[SEPOLIA_CHAIN_ID].SablierLockupDynamic,
  SEPOLIA_DAI,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      startTime: now, // August 25th, 2023 21:46:40 GMT
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee
      segments: [
        {
          amount: 250n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          timestamp: now + 86400 * 1,
        }, // Distribute DAI 250 exponentially (exponent = 3), by the end of the first day
        {
          amount: 750n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          timestamp: now + 86400 * 30,
        }, // Distribute another DAI 750 exponentially (exponent = 3), by the end of the month (30 days)
      ],
    },
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      startTime: now, // August 25th, 2023 21:46:40 GMT
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 2000n * 10n ** 18n, // 2000 DAI (18 decimals)
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee
      segments: [
        {
          amount: 1250n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          timestamp: now + 86400 * 1,
        }, // Distribute DAI 1250 exponentially (exponent = 3), by the end of the first day
        {
          amount: 750n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          timestamp: now + 86400 * 30,
        }, // Distribute another DAI 750 exponentially (exponent = 3), by the end of the month (30 days)
      ],
    },
  ],
];

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const BATCH_LOCKUP_DYNAMIC_WITH_DURATIONS: IBatchCreateDynamicWithDurations = [
  contracts[SEPOLIA_CHAIN_ID].SablierLockupDynamic,
  SEPOLIA_DAI,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      segments: [
        {
          amount: 250n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          duration: 86400 * 1,
        }, // Distribute DAI 250 exponentially (exponent = 3), the first day (86400 seconds)
        {
          amount: 750n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          duration: 86400 * 1,
        }, // Distribute DAI 750 exponentially (exponent = 3), the second day (86400 seconds)
      ],
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee
    },
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 2000n * 10n ** 18n, // 2000 DAI (18 decimals)
      segments: [
        {
          amount: 1250n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          duration: 86400 * 1,
        }, // Distribute DAI 1250 exponentially (exponent = 3), the first day (86400 seconds)
        {
          amount: 750n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          duration: 86400 * 1,
        }, // Distribute DAI 750 exponentially (exponent = 3), the second day (86400 seconds)
      ],
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee
    },
  ],
];

export const BATCH_LOCKUP_TRANCHES_WITH_TIMESTAMPS: IBatchCreateTranchedWithTimestamps = [
  contracts[SEPOLIA_CHAIN_ID].SablierLockupTranched,
  SEPOLIA_DAI,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      startTime: now, // August 25th, 2023 21:46:40 GMT
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee
      tranches: [
        {
          amount: 250n * 10n ** 18n,
          timestamp: now + 86400 * 1,
        }, // Distribute DAI 1250 in a step, at the end of the first day
        {
          amount: 750n * 10n ** 18n,
          timestamp: now + 86400 * 30,
        }, // Distribute another DAI 750 in a step, at the end of the month (30 days)
      ],
    },
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      startTime: now, // August 25th, 2023 21:46:40 GMT
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 2000n * 10n ** 18n, // 2000 DAI (18 decimals)
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee
      tranches: [
        {
          amount: 1250n * 10n ** 18n,
          timestamp: now + 86400 * 1,
        }, // Distribute DAI 1250 in a step, at the end of the first day
        {
          amount: 750n * 10n ** 18n,
          timestamp: now + 86400 * 30,
        }, // Distribute another DAI 750 in a step, at the end of the month (30 days)
      ],
    },
  ],
];

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const BATCH_LOCKUP_TRANCHED_WITH_DURATIONS: IBatchCreateTranchedWithDurations = [
  contracts[SEPOLIA_CHAIN_ID].SablierLockupTranched,
  SEPOLIA_DAI,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      tranches: [
        {
          amount: 250n * 10n ** 18n,
          duration: 86400 * 1,
        }, // Distribute DAI 250 in a step, after the first day (86400 seconds)
        {
          amount: 750n * 10n ** 18n,
          duration: 86400 * 1,
        }, // Distribute DAI 750 in a step, after the second day (86400 seconds)
      ],
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee
    },
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      cancelable: true, // Cancelable
      transferable: true, // Transferable
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 2000n * 10n ** 18n, // 2000 DAI (18 decimals)
      tranches: [
        {
          amount: 1250n * 10n ** 18n,
          duration: 86400 * 1,
        }, // Distribute DAI 1250 in a step, after the first day (86400 seconds)
        {
          amount: 750n * 10n ** 18n,
          duration: 86400 * 1,
        }, // Distribute DAI 750  in a step, after the second day (86400 seconds)
      ],
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee
    },
  ],
];
