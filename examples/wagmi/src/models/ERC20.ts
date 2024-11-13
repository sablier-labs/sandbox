import BigNumber from "bignumber.js";
import _ from "lodash";
import { getAccount, readContract, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { config } from "../components/Web3";
import { ABI, SEPOLIA_CHAIN_ID, contracts } from "../constants";
import type { IAddress } from "../types";
import { erroneous, expect } from "../utils";

class ERC20 {
  static async doApprove(
    spender: keyof (typeof contracts)[typeof SEPOLIA_CHAIN_ID],
    state: {
      amount: string | undefined;
      token: string | undefined;
    },
    log: (value: string) => void,
  ) {
    try {
      if (!expect(state.amount, "amount") || !expect(state.token, "token")) {
        return;
      }

      const decimals = await readContract(config, {
        address: state.token as IAddress,
        abi: ABI.ERC20.abi,
        functionName: "decimals",
      });

      const amount = BigInt(state.amount) * 10n ** BigInt(decimals);

      const hash = await writeContract(config, {
        address: state.token as IAddress,
        abi: ABI.ERC20.abi,
        functionName: "approve",
        args: [contracts[SEPOLIA_CHAIN_ID][spender], amount],
      });

      if (hash) {
        log(`Token approval sent to the blockchain with hash: ${hash}.`);
      }

      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt?.status === "success") {
        log(`Token approval executed successfully.`);
      } else {
        log(`Token approval failed.`);
      }
    } catch (error) {
      erroneous(error);
    }
  }

  static async doMint(token: IAddress) {
    try {
      if (!expect(token, "token")) {
        console.error("token is undefined");
        return;
      }

      const decimals = await readContract(config, {
        address: token,
        abi: ABI.ERC20.abi,
        functionName: "decimals",
      });

      /** We use BigNumber to convert float values to decimal padded BigInts */
      const padding = new BigNumber(10).pow(new BigNumber(decimals.toString()));
      const amount = BigInt(new BigNumber("100000").times(padding).toFixed());

      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        console.error("sender is undefined");
        return;
      }

      const _hash = await writeContract(config, {
        address: token,
        abi: ABI.ERC20.abi,
        functionName: "mint",
        args: [sender, amount],
      });
    } catch (error) {
      erroneous(error);
    }
  }
}

export default ERC20;
