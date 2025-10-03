import {
  TOKEN_PROGRAM_ADDRESS,
  fetchMint,
  fetchToken,
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstruction,
} from "@solana-program/token";
import {
  type Instruction,
  TransactionSigner,
  address,
  appendTransactionMessageInstructions,
  assertIsSendableTransaction,
  createSolanaRpc,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  addSignersToTransactionMessage,
  getBase64EncodedWireTransaction,
} from "@solana/kit";
import BigNumber from "bignumber.js";
import _ from "lodash";
import { getMintTokenToInstructionAsync } from "../generated/faucet/instructions";
import type { IAddress } from "../types";
import { erroneous, expect } from "../utils";

// SPL Token Program ID

class TokenFaucet {
  static async doMint(token: IAddress, signer: TransactionSigner) {
    try {
      if (!expect(token, "token")) {
        console.error("token is undefined");
        return;
      }

      if (!expect(signer, "signer")) {
        console.error("signer is undefined");
        return;
      }

      const mint = address(token);
      const rpc = createSolanaRpc("https://devnet.helius-rpc.com/?api-key=22b77efb-b546-4e53-aff5-eacfd2bd1349");
      const mintInfo = await fetchMint(rpc, mint);
      const decimals = mintInfo.data.decimals;

      const symbol = "USDCD";
      const padding = new BigNumber(10).pow(new BigNumber(decimals.toString()));
      const amount = BigInt(new BigNumber("1").times(padding).toFixed());

      //Find the associated token account for the recipient
      const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint,
        owner: signer.address,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });

      // Check if ATA exists, create it if it doesn't
      const instructions: Instruction[] = [];
      try {
        await fetchToken(rpc, associatedTokenAddress);
      } catch (error) {
        console.log("ATA doesn't exist, creating it: ", error);
        const createAtaInstruction = getCreateAssociatedTokenInstruction({
          payer: signer,
          mint,
          owner: signer.address,
          ata: associatedTokenAddress,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
        });
        instructions.push(createAtaInstruction);
      }

      const mintInstruction = await getMintTokenToInstructionAsync({
        mint,
        recipient: signer.address,
        payer: signer,
        symbol,
        quantity: amount,
      });

      instructions.push(mintInstruction);

      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      let transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions(instructions, tx),
      );

      // Explicitly add signers to the transaction message
      transactionMessage = addSignersToTransactionMessage([signer], transactionMessage);

      const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
      assertIsSendableTransaction(signedTransaction);

      // Use direct RPC call instead of sendAndConfirmTransactionFactory
      const encodedTransaction = getBase64EncodedWireTransaction(signedTransaction);
      const signature = await rpc.sendTransaction(encodedTransaction, {
        preflightCommitment: "confirmed",
        encoding: "base64",
        skipPreflight: true,
      }).send();

      // Wait for confirmation
      let confirmed = false;
      let attempts = 0;
      const maxAttempts = 30;

      while (!confirmed && attempts < maxAttempts) {
        try {
          const status = await rpc.getSignatureStatuses([signature]).send();
          if (status.value[0]?.confirmationStatus === "confirmed" || status.value[0]?.confirmationStatus === "finalized") {
            confirmed = true;
            break;
          }
        } catch (error) {
          // Continue waiting
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (!confirmed) {
        throw new Error("Transaction failed to confirm within timeout");
      }

      return {
        success: true,
        transaction: signedTransaction,
        amount: amount.toString(),
        symbol,
        recipient: signer.address,
      };
    } catch (error) {
      erroneous(error);
    }
  }
}

export default TokenFaucet;
