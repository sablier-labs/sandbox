import { TOKEN_PROGRAM_ADDRESS, fetchMint, findAssociatedTokenPda } from "@solana-program/token";
import {
  TransactionSigner,
  address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithinSizeLimit,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import { sign } from "crypto";
import _ from "lodash";
import { parse as uuidParse, v4 as uuidV4 } from "uuid";
import { zeroAddress } from "viem";
import { getAccount, readContract, readContracts, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { DEVNET_CHAIN_ID, contracts } from "../constants";
import { getCreateWithDurationsLlInstructionAsync } from "../generated/linear/instructions";
import type {
  IAddress,
  IAmountWithDecimals,
  IAmountWithDecimals18,
  ICreateLinearWithDurations,
  ICreateLinearWithTimestamps,
  ISeconds,
  ISegmentD,
  IWithdrawLockup,
} from "../types";
import { erroneous, expect } from "../utils";

function doGenerateSalt() {
  const uuid = uuidV4();
  const bytes = uuidParse(uuid);

  const hex =
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  return new BigNumber(hex);
}

class LockupCore {
  static async doCreateLinear(
    state: {
      amount: string | undefined;
      cancelability: boolean;
      cliff: string | undefined;
      duration: string | undefined;
      recipient: string | undefined;
      token: string | undefined;
    },
    signer: TransactionSigner,
    log: (value: string) => void,
  ) {
    try {
      if (
        !expect(state.amount, "amount") ||
        !expect(state.cancelability, "cancelability") ||
        !expect(state.duration, "duration") ||
        !expect(state.recipient, "recipient") ||
        !expect(state.token, "token")
      ) {
        return;
      }

      const mint = address(state.token);
      const rpc = createSolanaRpc("https://api.devnet.solana.com");
      const rpcSubscriptions = createSolanaRpcSubscriptions("wss://api.devnet.solana.com");
      const mintInfo = await fetchMint(rpc, mint);
      const decimals = mintInfo.data.decimals;

      /** We use BigNumber to convert float values to decimal padded BigInts */
      const padding = new BigNumber(10).pow(new BigNumber(decimals.toString()));
      const amount = BigInt(new BigNumber(state.amount).times(padding).toFixed());

      if (!expect(signer, "signer")) {
        return;
      }

      const cliff = (() => {
        try {
          if (!_.isNil(state.cliff) && BigInt(state.cliff).toString() === state.cliff) {
            return Number(state.cliff);
          }
        } catch (_error) {}
        return 0;
      })();

      const salt = doGenerateSalt().toNumber();

      const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint,
        owner: signer.address,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });

      const createWithDurationLl = await getCreateWithDurationsLlInstructionAsync({
        creator: signer,
        sender: signer.address,
        recipient: address(state.recipient),
        depositTokenMint: mint,
        nftTokenProgram: address(TOKEN_PROGRAM_ID.toString()),
        creatorAta: associatedTokenAddress,
        depositTokenProgram: mintInfo.programAddress,
        salt,
        depositAmount: amount,
        cliffDuration: cliff,
        totalDuration: _.toNumber(state.duration),
        startUnlockAmount: 0,
        cliffUnlockAmount: 0,
        isCancelable: state.cancelability,
      });

      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      console.info("Latest blockhash", latestBlockhash);

      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(
            { lastValidBlockHeight: latestBlockhash.lastValidBlockHeight, blockhash: latestBlockhash.blockhash },
            tx,
          ),
        (tx) => appendTransactionMessageInstructions([createWithDurationLl], tx),
      );

      const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
      assertIsTransactionWithinSizeLimit(signedTransaction);
      await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(signedTransaction, {
        commitment: "confirmed",
        skipPreflight: true,
      });
      console.info("LL Stream successfully created.");
    } catch (error) {
      console.error("LL Stream creation failed.", error);
      erroneous(error);
    }
  }

  static async doCreateLinearWithDurationsRaw(payload: ICreateLinearWithDurations) {
    const data = _.clone(payload);
    if (data.sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }
      data.sender = sender;
    }

    console.info("Payload", data);

    const hash = await writeContract(config, {
      address: contracts[DEVNET_CHAIN_ID].SablierLockupLinear,
      abi: ABI.SablierLockupLinear.abi,
      functionName: "createWithDurations",
      args: [data],
    });
    return waitForTransactionReceipt(config, { hash });
  }

  static async doCreateLinearWithTimestampsRaw(payload: ICreateLinearWithTimestamps) {
    const data = _.clone(payload);
    if (data.sender.toString() === "<< YOUR CONNECTED ADDRESS AS THE SENDER >>") {
      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }
      data.sender = sender;
    }

    console.info("Payload", data);

    const hash = await writeContract(config, {
      address: contracts[DEVNET_CHAIN_ID].SablierLockupLinear,
      abi: ABI.SablierLockupLinear.abi,
      functionName: "createWithTimestamps",
      args: [data],
    });
    return waitForTransactionReceipt(config, { hash });
  }

  static async doWithdraw(
    state: {
      contract: string | undefined;
      streamId: string | undefined;
      amount: string | undefined;
    },
    log: (value: string) => void,
  ) {
    try {
      if (
        !expect(state.streamId, "streamId") ||
        !expect(state.contract, "contract") ||
        !expect(state.amount, "amount")
      ) {
        return;
      }

      const [asset, to] = await readContracts(config, {
        contracts: [
          {
            address: state.contract as IAddress,
            abi: ABI.SablierLockupLinear.abi, // These methods are included in the ISablierLockup interfaces, so common across all variants (LL, LT, LD)
            functionName: "getAsset",
            args: [BigInt(state.streamId)],
          },
          {
            address: state.contract as IAddress,
            abi: ABI.SablierLockupLinear.abi, // These methods are included in the ISablierLockup interfaces, so common across all variants (LL, LT, LD)
            functionName: "getRecipient",
            args: [BigInt(state.streamId)],
          },
        ],
        allowFailure: false,
      });

      const decimals = await readContract(config, {
        address: asset,
        abi: ABI.ERC20.abi,
        functionName: "decimals",
      });

      /** We use BigNumber to convert float values to decimal padded BigInts */
      const padding = new BigNumber(10).pow(new BigNumber(decimals.toString()));

      const sender = await getAccount(config).address;
      if (!expect(sender, "sender")) {
        return;
      }

      const amount = BigInt(new BigNumber(state.amount).times(padding).toFixed());

      /** The public withdraw is locked to the recipient's address. Recipients themselves can chose a different withdraw address. */
      const payload: IWithdrawLockup = [BigInt(state.streamId), to, amount];

      console.info("Payload", payload);

      const hash = await writeContract(config, {
        address: contracts[DEVNET_CHAIN_ID].SablierLockupLinear,
        abi: ABI.SablierLockupLinear.abi,
        functionName: "withdraw",
        args: payload,
      });

      if (hash) {
        log(`Withdrawal for Stream #${state.streamId} sent to the blockchain with hash: ${hash}.`);
      }

      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt?.status === "success") {
        log(`Withdrawal for Stream #${state.streamId} successful.`);
      } else {
        log(`Withdrawal for Stream #${state.streamId} failed.`);
      }
    } catch (error) {
      erroneous(error);
    }
  }
}

export default LockupCore;
