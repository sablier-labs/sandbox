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
      const rpc = createSolanaRpc("https://api.devnet.solana.com");
      const rpcSubscriptions = createSolanaRpcSubscriptions("wss://api.devnet.solana.com");
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

      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayerSigner(signer, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx) => appendTransactionMessageInstructions(instructions, tx),
      );

      const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
      assertIsTransactionWithinSizeLimit(signedTransaction);
      await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(signedTransaction, { commitment: "confirmed" });

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
