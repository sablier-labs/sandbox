import {
  TOKEN_PROGRAM_ADDRESS,
  fetchMint,
  fetchToken,
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstruction,
} from "@solana-program/token";
import {
  Instruction,
  TransactionSigner,
  addSignersToTransactionMessage,
  address,
  appendTransactionMessageInstructions,
  assertIsSendableTransaction,
  assertIsTransactionWithinSizeLimit,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getAddressEncoder,
  getBase64EncodedWireTransaction,
  getBytesEncoder,
  getProgramDerivedAddress,
  getPublicKeyFromAddress,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import _ from "lodash";
import { parse as uuidParse, v4 as uuidV4 } from "uuid";
import { fetchStreamData } from "../generated/linear/accounts/streamData";
import {
  getCreateWithDurationsLlInstructionAsync,
  getWithdrawInstructionAsync,
} from "../generated/linear/instructions";
import { SABLIER_LOCKUP_PROGRAM_ADDRESS } from "../generated/linear/programs/sablierLockup";
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

async function getStreamDataPda(nftMint: ReturnType<typeof address>) {
  return await getProgramDerivedAddress({
    programAddress: SABLIER_LOCKUP_PROGRAM_ADDRESS,
    seeds: [getBytesEncoder().encode(new TextEncoder().encode("stream_data")), getAddressEncoder().encode(nftMint)],
  });
}

async function getNftRecipient(rpc: ReturnType<typeof createSolanaRpc>, nftMint: ReturnType<typeof address>) {
  try {
    const largestAccounts = await rpc.getTokenLargestAccounts(nftMint).send();
    const largestAccount = largestAccounts.value?.[0]?.address;

    if (!largestAccount) {
      throw new Error("No token accounts found for NFT mint");
    }
    const tokenAccount = await fetchToken(rpc, largestAccount);
    return tokenAccount.data.owner;
  } catch (error) {
    throw new Error(`Failed to get NFT recipient: ${error}`);
  }
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
      const rpc = createSolanaRpc("https://devnet.helius-rpc.com/?api-key=22b77efb-b546-4e53-aff5-eacfd2bd1349");
      const rpcSubscriptions = createSolanaRpcSubscriptions(
        "wss://devnet.helius-rpc.com/?api-key=22b77efb-b546-4e53-aff5-eacfd2bd1349",
      );
      const mintInfo = await fetchMint(rpc, mint);
      const decimals = mintInfo.data.decimals;

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

  static async doWithdraw(
    state: {
      nftMint: string | undefined;
      amount: string | undefined;
    },
    signer: TransactionSigner,
    log: (value: string) => void,
  ) {
    try {
      if (!expect(state.nftMint, "nftMint") || !expect(state.amount, "amount")) {
        return;
      }

      const nftMint = address(state.nftMint);
      const rpc = createSolanaRpc("https://devnet.helius-rpc.com/?api-key=22b77efb-b546-4e53-aff5-eacfd2bd1349");

      const [streamDataPda] = await getStreamDataPda(nftMint);
      const streamData = await fetchStreamData(rpc, streamDataPda);

      const sender = streamData.data.sender;
      const mint = streamData.data.depositedTokenMint;
      const recipient = await getNftRecipient(rpc, nftMint);
      const mintInfo = await fetchMint(rpc, mint);
      const decimals = mintInfo.data.decimals;

      const padding = new BigNumber(10).pow(new BigNumber(decimals.toString()));
      const amount = BigInt(new BigNumber(state.amount).times(padding).toFixed());

      const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint,
        owner: recipient,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });

      const instructions: Instruction[] = [];
      try {
        await fetchToken(rpc, associatedTokenAddress);
      } catch (error) {
        console.log("ATA doesn't exist, creating it: ", error);
        const createAtaInstruction = getCreateAssociatedTokenInstruction({
          payer: signer,
          mint,
          owner: recipient,
          ata: associatedTokenAddress,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
        });
        instructions.push(createAtaInstruction);
      }

      const withdrawInstruction = await getWithdrawInstructionAsync({
        signer,
        amount,
        depositedTokenMint: mint,
        streamRecipient: recipient,
        streamNftMint: nftMint,
        withdrawalRecipient: recipient,
        withdrawalRecipientAta: associatedTokenAddress,
        depositedTokenProgram: mintInfo.programAddress,
        nftTokenProgram: address(TOKEN_PROGRAM_ID.toString()),
        chainlinkProgram: address("HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny"),
        chainlinkSolUsdFeed: address("99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR"),
      });

      instructions.push(withdrawInstruction);

      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      let transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions(instructions, tx),
      );

      transactionMessage = addSignersToTransactionMessage([signer], transactionMessage);
      const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
      assertIsSendableTransaction(signedTransaction);
      const encodedTransaction = getBase64EncodedWireTransaction(signedTransaction);
      const signature = await rpc
        .sendTransaction(encodedTransaction, {
          preflightCommitment: "confirmed",
          encoding: "base64",
          skipPreflight: true,
        })
        .send();

      // Wait for confirmation
      let confirmed = false;
      let attempts = 0;
      const maxAttempts = 30;

      while (!confirmed && attempts < maxAttempts) {
        try {
          const status = await rpc.getSignatureStatuses([signature]).send();
          if (
            status.value[0]?.confirmationStatus === "confirmed" ||
            status.value[0]?.confirmationStatus === "finalized"
          ) {
            confirmed = true;
            break;
          }
        } catch (error) {
          // Continue waiting
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      }

      if (!confirmed) {
        throw new Error("Transaction failed to confirm within timeout");
      }

      return {
        sender,
        mint,
        recipient,
      };
    } catch (error) {
      log(`Failed to withdraw from stream: ${error}`);
      erroneous(error);
    }
  }
}

export default LockupCore;
