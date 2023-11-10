import type {
  IBatchCreateWithRange,
  IBatchCreateWithDurations,
  IBatchCreateWithDeltas,
  IBatchCreateWithMilestones,
  ICreateWithRange,
  ICreateWithDurations,
  ICreateWithDeltas,
  ICreateWithMilestones,
  IAddress,
} from "../types";

const now = BigInt(new Date().valueOf().toString().slice(0, -3));
const now_n = Number(new Date().valueOf().toString().slice(0, -3));

export const APPROVE_LINEAR = [
  "SablierV2LockupLinear",
  {
    amount: "1000000",
    token: "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress,
  },
] as const;

export const APPROVE_DYNAMIC = [
  "SablierV2LockupDynamic",
  {
    amount: "1000000",
    token: "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress,
  },
] as const;

export const APPROVE_BATCH = [
  "SablierV2Batch",
  {
    amount: "1000000",
    token: "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress,
  },
] as const;

export const LOCKUP_LINEAR_WITH_DURATIONS: ICreateWithDurations = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Recipient address
  1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress, // DAI address
  true, // Cancelable
  { cliff: 86400n, total: 86400n * 4n }, // Cliff for one day, ends after 4 (total) days - starts when the transaction is executed onchain
  {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
];

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const LOCKUP_LINEAR_WITH_RANGE: ICreateWithRange = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Recipient address
  1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress, // DAI address
  true, // Cancelable
  { start: now, cliff: now + 86400n * 1n, end: now + 86400n * 30n }, // Starts on August 25th, 2023 21:46:40 GMT, cliff for one day, ends after 30 (total) days
  {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
];

export const LOCKUP_DYNAMIC_WITH_MILESTONES: ICreateWithMilestones = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  now, // August 25th, 2023 21:46:40 GMT
  true, // Cancelable
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
  1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress, // DAI address
  {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
  [
    {
      amount: 250n * 10n ** 18n,
      exponent: 3n * 10n ** 18n,
      milestone: now + 86400n * 1n,
    }, // Distribute DAI 250 exponentially (exponent = 3), by the end of the first day
    {
      amount: 750n * 10n ** 18n,
      exponent: 3n * 10n ** 18n,
      milestone: now + 86400n * 30n,
    }, // Distribute another DAI 750 exponentially (exponent = 3), by the end of the month (30 days)
  ],
];

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */

export const LOCKUP_DYNAMIC_WITH_DELTAS: ICreateWithDeltas = [
  "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
  true, // Cancelable
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
  1000n * 10n ** 18n, // 1000 DAI (18 decimals)
  "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress, // DAI address
  {
    account: "0x0000000000000000000000000000000000000000" as IAddress,
    fee: 0n,
  }, // Broker - set this to your own address to charge a fee
  [
    {
      amount: 250n * 10n ** 18n,
      exponent: 3n * 10n ** 18n,
      delta: 86400n * 1n,
    }, // Distribute DAI 250 exponentially (exponent = 3), the first day (86400 seconds)
    {
      amount: 750n * 10n ** 18n,
      exponent: 3n * 10n ** 18n,
      delta: 86400n * 1n,
    }, // Distribute DAI 750 exponentially (exponent = 3), the second day (86400 seconds)
  ],
];

/** ---------------------------------------------------------------------------------- */

export const BATCH_LOCKUP_LINEAR_WITH_DURATIONS: IBatchCreateWithDurations = [
  "0x6e3678c005815ab34986d8d66a353cd3699103de" as IAddress,
  "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
      cancelable: true, // Cancelable
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
      durations: { cliff: 86400, total: 86400 * 4 }, // Cliff for one day, ends after 4 (total) days - starts when the transaction is executed onchain
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee]
    },
  ],
];

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const BATCH_LOCKUP_LINEAR_WITH_RANGE: IBatchCreateWithRange = [
  "0x6e3678c005815ab34986d8d66a353cd3699103de" as IAddress,
  "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as IAddress, // Recipient address
      totalAmount: 1000n * 10n ** 18n, // 1000 DAI (18 decimals)
      cancelable: true, // Cancelable
      range: {
        start: now_n,
        cliff: now_n + 86400 * 1,
        end: now_n + 86400 * 30,
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
      range: {
        start: now_n,
        cliff: now_n + 86400 * 1,
        end: now_n + 86400 * 30,
      }, // Starts on August 25th, 2023 21:46:40 GMT, cliff for one day, ends after 30 (total) days
      broker: {
        account: "0x0000000000000000000000000000000000000000",
        fee: 0n,
      }, // Broker - set this to your own address to charge a fee]
    },
  ],
];

export const BATCH_LOCKUP_DYNAMIC_WITH_MILESTONES: IBatchCreateWithMilestones =
  [
    "0x4be70ede968e9dba12db42b9869bec66bedc17d7" as IAddress,
    "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress,
    [
      {
        sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
        startTime: now_n, // August 25th, 2023 21:46:40 GMT
        cancelable: true, // Cancelable
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
            milestone: now_n + 86400 * 1,
          }, // Distribute DAI 250 exponentially (exponent = 3), by the end of the first day
          {
            amount: 750n * 10n ** 18n,
            exponent: 3n * 10n ** 18n,
            milestone: now_n + 86400 * 30,
          }, // Distribute another DAI 750 exponentially (exponent = 3), by the end of the month (30 days)
        ],
      },
      {
        sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
        startTime: now_n, // August 25th, 2023 21:46:40 GMT
        cancelable: true, // Cancelable
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
            milestone: now_n + 86400 * 1,
          }, // Distribute DAI 1250 exponentially (exponent = 3), by the end of the first day
          {
            amount: 750n * 10n ** 18n,
            exponent: 3n * 10n ** 18n,
            milestone: now_n + 86400 * 30,
          }, // Distribute another DAI 750 exponentially (exponent = 3), by the end of the month (30 days)
        ],
      },
    ],
  ];

/** 🚨🕣 The END DATE (last parameter in the range tuple) has to be in the future. Make sure to move it at least a few hours after the current moment */
export const BATCH_LOCKUP_DYNAMIC_WITH_DELTAS: IBatchCreateWithDeltas = [
  "0x4be70ede968e9dba12db42b9869bec66bedc17d7" as IAddress,
  "0x97cb342cf2f6ecf48c1285fb8668f5a4237bf862" as IAddress,
  [
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      cancelable: true, // Cancelable
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
          delta: 86400 * 1,
        }, // Distribute DAI 250 exponentially (exponent = 3), the first day (86400 seconds)
        {
          amount: 750n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          delta: 86400 * 1,
        }, // Distribute DAI 750 exponentially (exponent = 3), the second day (86400 seconds)
      ],
    },
    {
      sender: "<< YOUR CONNECTED ADDRESS AS THE SENDER >>" as IAddress, // Sender address
      cancelable: true, // Cancelable
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
          delta: 86400 * 1,
        }, // Distribute DAI 1250 exponentially (exponent = 3), the first day (86400 seconds)
        {
          amount: 750n * 10n ** 18n,
          exponent: 3n * 10n ** 18n,
          delta: 86400 * 1,
        }, // Distribute DAI 750 exponentially (exponent = 3), the second day (86400 seconds)
      ],
    },
  ],
];
