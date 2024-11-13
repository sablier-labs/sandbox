import type { Address as IViemAddress } from "viem";

export type IAddress = IViemAddress;
export type ISeconds<T extends number | bigint = bigint> = T;
export type IAmount<T extends number | bigint = bigint> = T;
export type IAmountWithDecimals<T extends number | bigint = bigint> = T;
export type IAmountWithDecimals18<T extends number | bigint = bigint> = T;

export interface IStoreFormLinear {
  logs: string[];
  error: string | undefined;

  amount: string | undefined;
  cancelability: boolean;
  cliff: string | undefined;
  duration: string | undefined;
  recipient: string | undefined;
  token: string | undefined;
  transferability: boolean;

  api: {
    log: (value: string) => void;
    update: (updates: Partial<IStoreFormLinear>) => void;
    reset: () => void;
  };
}

export interface IStoreFormLockupWithdraw {
  logs: string[];
  error: string | undefined;

  contract: string | undefined;
  amount: string | undefined;
  streamId: string | undefined;

  api: {
    log: (value: string) => void;
    update: (updates: Partial<IStoreFormLockupWithdraw>) => void;
    reset: () => void;
  };
}

export interface IStoreFormDynamic {
  logs: string[];
  error: string | undefined;

  cancelability: boolean;
  recipient: string | undefined;
  token: string | undefined;
  transferability: boolean;

  segments: {
    amount: string | undefined;
    exponent: string | undefined;
    duration: string | undefined;
  }[];

  api: {
    log: (value: string) => void;
    update: (updates: Partial<IStoreFormDynamic>) => void;
    reset: () => void;
  };
}

export interface IStoreFormTranched {
  logs: string[];
  error: string | undefined;

  cancelability: boolean;
  recipient: string | undefined;
  token: string | undefined;
  transferability: boolean;

  tranches: {
    amount: string | undefined;
    duration: string | undefined;
  }[];

  api: {
    log: (value: string) => void;
    update: (updates: Partial<IStoreFormTranched>) => void;
    reset: () => void;
  };
}

export interface IStoreFormFlow {
  logs: string[];
  error: string | undefined;

  ratePerSecond: string | undefined;
  initialDeposit: string | undefined;
  recipient: string | undefined;
  token: string | undefined;
  transferability: boolean;

  api: {
    log: (value: string) => void;
    update: (updates: Partial<IStoreFormFlow>) => void;
    reset: () => void;
  };
}

export interface IStoreFormFlowWithdraw {
  logs: string[];
  error: string | undefined;

  amount: string | undefined;
  streamId: string | undefined;

  api: {
    log: (value: string) => void;
    update: (updates: Partial<IStoreFormFlowWithdraw>) => void;
    reset: () => void;
  };
}

export type ICreateLinearWithDurations = {
  sender: IAddress;
  recipient: IAddress;
  totalAmount: IAmountWithDecimals;
  asset: IAddress;
  cancelable: boolean;
  transferable: boolean;
  durations: { cliff: ISeconds<number>; total: ISeconds<number> };
  broker: { account: IAddress; fee: 0n }; // TIP: you can set this to your own address to charge a fee
};

export type ICreateLinearWithTimestamps = {
  sender: IAddress;
  recipient: IAddress;
  totalAmount: IAmountWithDecimals;
  asset: IAddress;
  cancelable: boolean;
  transferable: boolean;
  timestamps: { start: ISeconds<number>; cliff: ISeconds<number>; end: ISeconds<number> };
  broker: { account: IAddress; fee: 0n }; // TIP: you can set this to your own address to charge a fee
};

export type ISegmentD<T extends number | bigint = bigint> = {
  amount: IAmountWithDecimals;
  exponent: IAmountWithDecimals18;
  duration: ISeconds<T>;
};

export type ISegmentT<T extends number | bigint = bigint> = {
  amount: IAmountWithDecimals;
  exponent: IAmountWithDecimals18;
  timestamp: ISeconds<T>;
};

export type ICreateDynamicWithDurations = {
  sender: IAddress;
  cancelable: boolean;
  transferable: boolean;
  recipient: IAddress;
  totalAmount: IAmountWithDecimals;
  asset: IAddress;
  broker: { account: IAddress; fee: 0n };
  segments: ISegmentD<number>[];
};

export type ICreateDynamicWithTimestamps = {
  sender: IAddress;
  startTime: ISeconds<number>;
  cancelable: boolean;
  transferable: boolean;
  recipient: IAddress;
  totalAmount: IAmountWithDecimals;
  asset: IAddress;
  broker: { account: IAddress; fee: 0n };
  segments: ISegmentT<number>[];
};

export type ITrancheD<T extends number | bigint = bigint> = {
  amount: IAmountWithDecimals;
  duration: ISeconds<T>;
};

export type ITrancheT<T extends number | bigint = bigint> = {
  amount: IAmountWithDecimals;
  timestamp: ISeconds<T>;
};

export type ICreateTranchedWithDurations = {
  sender: IAddress;
  cancelable: boolean;
  transferable: boolean;
  recipient: IAddress;
  totalAmount: IAmountWithDecimals;
  asset: IAddress;
  broker: { account: IAddress; fee: 0n };
  tranches: ITrancheD<number>[];
};

export type ICreateTranchedWithTimestamps = {
  sender: IAddress;
  startTime: ISeconds<number>;
  cancelable: boolean;
  transferable: boolean;
  recipient: IAddress;
  totalAmount: IAmountWithDecimals;
  asset: IAddress;
  broker: { account: IAddress; fee: 0n };
  tranches: ITrancheT<number>[];
};

export type IWithdrawLockup = [streamId: bigint, to: IAddress, amount: bigint];

/** --------- */

export type ICreateAndDepositFlow = [
  sender: IAddress,
  recipient: IAddress,
  ratePerSecond: IAmountWithDecimals,
  asset: IAddress,
  transferable: boolean,
  initialDeposit: IAmountWithDecimals,
];

export type IWithdrawFlow = [streamId: bigint, to: IAddress, amount: bigint];

/** --------- */

export type IBatchCreateLinearWithDurations = [
  lockup: IAddress,
  asset: IAddress,
  batch: {
    sender: IAddress;
    recipient: IAddress;
    totalAmount: IAmountWithDecimals;
    cancelable: boolean;
    transferable: boolean;
    durations: { cliff: ISeconds<number>; total: ISeconds<number> };
    broker: { account: IAddress; fee: 0n };
  }[], // Array of streams
];

export type IBatchCreateLinearWithTimestamps = [
  lockup: IAddress,
  asset: IAddress,
  batch: {
    sender: IAddress;
    recipient: IAddress;
    totalAmount: IAmountWithDecimals;
    cancelable: boolean;
    transferable: boolean;
    timestamps: {
      start: ISeconds<number>;
      cliff: ISeconds<number>;
      end: ISeconds<number>;
    };
    broker: { account: IAddress; fee: 0n };
  }[], // Array of streams
];

export type IBatchCreateDynamicWithDurations = [
  lockup: IAddress,
  asset: IAddress,
  batch: {
    sender: IAddress;
    recipient: IAddress;
    totalAmount: IAmountWithDecimals;
    cancelable: boolean;
    transferable: boolean;
    segments: ISegmentD<number>[];
    broker: { account: IAddress; fee: 0n };
  }[], // Array of streams
];

export type IBatchCreateDynamicWithTimestamps = [
  lockup: IAddress,
  asset: IAddress,
  batch: {
    sender: IAddress;
    recipient: IAddress;
    totalAmount: IAmountWithDecimals;
    startTime: ISeconds<number>;
    cancelable: boolean;
    transferable: boolean;
    segments: ISegmentT<number>[];
    broker: { account: IAddress; fee: 0n };
  }[], // Array of streams
];

export type IBatchCreateTranchedWithDurations = [
  lockup: IAddress,
  asset: IAddress,
  batch: {
    sender: IAddress;
    recipient: IAddress;
    totalAmount: IAmountWithDecimals;
    cancelable: boolean;
    transferable: boolean;
    tranches: ITrancheD<number>[];
    broker: { account: IAddress; fee: 0n };
  }[], // Array of streams
];

export type IBatchCreateTranchedWithTimestamps = [
  lockup: IAddress,
  asset: IAddress,
  batch: {
    sender: IAddress;
    recipient: IAddress;
    totalAmount: IAmountWithDecimals;
    startTime: ISeconds<number>;
    cancelable: boolean;
    transferable: boolean;
    tranches: ITrancheT<number>[];
    broker: { account: IAddress; fee: 0n };
  }[], // Array of streams
];
