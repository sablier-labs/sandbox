import BigNumber from "bignumber.js";
import _ from "lodash";
import { UserRejectedRequestError } from "viem";

export function expect(value: unknown, label: string): value is NonNullable<typeof value> {
  if (_.isNil(value) || _.toString(value).length === 0) {
    throw new Error(`Missing parameter: ${label}`);
  }
  return true;
}

export function toEndDate(time: number) {
  return BigInt(new BigNumber(Date.now()).plus(new BigNumber(time)).dividedToIntegerBy(new BigNumber(1000)).toFixed());
}

export function erroneous(error: unknown): Error | unknown {
  const name = _.get(error, "name") || "";
  const message = _.get(error, "message") || "";

  if (
    name === UserRejectedRequestError.name ||
    message.includes("User denied message signature") ||
    message.includes("User denied transaction signature")
  ) {
    return;
  } else {
    throw error;
  }
}
