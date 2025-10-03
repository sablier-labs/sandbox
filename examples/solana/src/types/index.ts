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

export type IWithdrawLockup = [streamId: bigint, to: IAddress, amount: bigint];
