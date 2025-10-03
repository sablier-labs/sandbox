export type IAddress = string;
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

  api: {
    log: (value: string) => void;
    update: (updates: Partial<IStoreFormLinear>) => void;
    reset: () => void;
  };
}

export interface IStoreFormLockupWithdraw {
  logs: string[];
  error: string | undefined;

  amount: string | undefined;
  nftMint: string | undefined;

  api: {
    log: (value: string) => void;
    update: (updates: Partial<IStoreFormLockupWithdraw>) => void;
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
};

export type ICreateLinearWithTimestamps = {
  sender: IAddress;
  recipient: IAddress;
  totalAmount: IAmountWithDecimals;
  asset: IAddress;
  cancelable: boolean;
  transferable: boolean;
  timestamps: { start: ISeconds<number>; cliff: ISeconds<number>; end: ISeconds<number> };
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

export type IWithdrawLockup = [streamId: bigint, to: IAddress, amount: bigint];

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
  }[], // Array of streams
];
