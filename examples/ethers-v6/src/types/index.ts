declare global {
  interface Window {
    ethereum: any;
  }
}

export type IAddress = string;
export type ISeconds = bigint;
export type IAmount = bigint;
export type IAmountWithDecimals = bigint;
export type IAmountWithDecimals18 = bigint;

export type ICreateLinearWithDurations = [
  sender: IAddress,
  recipient: IAddress,
  totalAmount: IAmountWithDecimals,
  asset: IAddress,
  cancelable: boolean,
  transferable: boolean,
  durations: [cliff: ISeconds, total: ISeconds],
  broker: [account: IAddress, fee: 0n], // TIP: you can set this to your own address to charge a fee
];

export type ICreateLinearWithTimestamps = [
  sender: IAddress,
  recipient: IAddress,
  totalAmount: IAmountWithDecimals,
  asset: IAddress,
  cancelable: boolean,
  transferable: boolean,
  timestamps: [start: ISeconds, cliff: ISeconds, end: ISeconds],
  broker: [account: IAddress, fee: 0n], // TIP: you can set this to your own address to charge a fee
];

export type ISegmentD = [amount: IAmountWithDecimals, exponent: IAmountWithDecimals18, duration: ISeconds];

export type ISegmentT = [amount: IAmountWithDecimals, exponent: IAmountWithDecimals18, timestamp: ISeconds];

export type ICreateDynamicWithDurations = [
  sender: IAddress,
  cancelable: boolean,
  transferable: boolean,
  recipient: IAddress,
  totalAmount: IAmountWithDecimals,
  asset: IAddress,
  broker: [account: IAddress, fee: 0n],
  segments: ISegmentD[],
];

export type ICreateDynamicWithTimestamps = [
  sender: IAddress,
  startTime: ISeconds,
  cancelable: boolean,
  transferable: boolean,
  recipient: IAddress,
  totalAmount: IAmountWithDecimals,
  asset: IAddress,
  broker: [account: IAddress, fee: 0n],
  segments: ISegmentT[],
];

export type ITrancheD = [amount: IAmountWithDecimals, duration: ISeconds];

export type ITrancheT = [amount: IAmountWithDecimals, timestamp: ISeconds];

export type ICreateTranchedWithDurations = [
  sender: IAddress,
  cancelable: boolean,
  transferable: boolean,
  recipient: IAddress,
  totalAmount: IAmountWithDecimals,
  asset: IAddress,
  broker: [account: IAddress, fee: 0n],
  tranches: ITrancheD[],
];

export type ICreateTranchedWithTimestamps = [
  sender: IAddress,
  startTime: ISeconds,
  cancelable: boolean,
  transferable: boolean,
  recipient: IAddress,
  totalAmount: IAmountWithDecimals,
  asset: IAddress,
  broker: [account: IAddress, fee: 0n],
  tranches: ITrancheT[],
];
