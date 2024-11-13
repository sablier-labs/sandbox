import BigNumber from "bignumber.js";
import { Contract, ethers } from "ethers";
import _ from "lodash";
import { ABI, SEPOLIA_CHAIN_ID, contracts } from "../constants";
import type {
  ICreateDynamicWithDurations,
  ICreateDynamicWithTimestamps,
  ICreateLinearWithDurations,
  ICreateLinearWithTimestamps,
  ICreateTranchedWithDurations,
  ICreateTranchedWithTimestamps,
} from "../types";

export default class LockupCore {
  static async doCreateLinearWithDurationsRaw(signer: ethers.Signer, payload: ICreateLinearWithDurations) {
    const contract_lockup = new Contract(
      contracts[SEPOLIA_CHAIN_ID].SablierLockupLinear,
      ABI.SablierLockupLinear.abi,
      signer,
    );

    const data = _.clone(payload);
    if (data[0] === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      data[0] = await signer.getAddress();
    }

    console.info("Payload", data);

    const tx = await contract_lockup.createWithDurations.send(data);
    return tx.wait();
  }

  static async doCreateLinearWithTimestampsRaw(signer: ethers.Signer, payload: ICreateLinearWithTimestamps) {
    const contract_lockup = new Contract(
      contracts[SEPOLIA_CHAIN_ID].SablierLockupLinear,
      ABI.SablierLockupLinear.abi,
      signer,
    );

    const data = _.clone(payload);
    if (data[0] === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      data[0] = await signer.getAddress();
    }

    console.info("Payload", data);

    const tx = await contract_lockup.createWithTimestamps.send(data);
    return tx.wait();
  }

  static async doCreateDynamicWithDurationsRaw(signer: ethers.Signer, payload: ICreateDynamicWithDurations) {
    const contract_lockup = new Contract(
      contracts[SEPOLIA_CHAIN_ID].SablierLockupDynamic,
      ABI.SablierLockupDynamic.abi,
      signer,
    );

    const data = _.clone(payload);
    if (data[0] === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      data[0] = await signer.getAddress();
    }

    console.info("Payload", data);

    const tx = await contract_lockup.createWithDurations.send(data);
    return tx.wait();
  }

  static async doCreateDynamicWithTimestampsRaw(signer: ethers.Signer, payload: ICreateDynamicWithTimestamps) {
    const contract_lockup = new Contract(
      contracts[SEPOLIA_CHAIN_ID].SablierLockupDynamic,
      ABI.SablierLockupDynamic.abi,
      signer,
    );

    const data = _.clone(payload);
    if (data[0] === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      data[0] = await signer.getAddress();
    }

    console.info("Payload", data);

    const tx = await contract_lockup.createWithTimestamps.send(data);
    return tx.wait();
  }

  static async doCreateTranchedWithDurationsRaw(signer: ethers.Signer, payload: ICreateTranchedWithDurations) {
    const contract_lockup = new Contract(
      contracts[SEPOLIA_CHAIN_ID].SablierLockupTranched,
      ABI.SablierLockupTranched.abi,
      signer,
    );

    const data = _.clone(payload);
    if (data[0] === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      data[0] = await signer.getAddress();
    }

    console.info("Payload", data);

    const tx = await contract_lockup.createWithDurations.send(data);
    return tx.wait();
  }

  static async doCreateTranchedWithTimestampsRaw(signer: ethers.Signer, payload: ICreateTranchedWithTimestamps) {
    const contract_lockup = new Contract(
      contracts[SEPOLIA_CHAIN_ID].SablierLockupTranched,
      ABI.SablierLockupTranched.abi,
      signer,
    );

    const data = _.clone(payload);
    if (data[0] === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      data[0] = await signer.getAddress();
    }

    console.info("Payload", data);

    const tx = await contract_lockup.createWithTimestamps.send(data);
    return tx.wait();
  }
}
