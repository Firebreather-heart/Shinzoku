import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
} from "@solana/spl-token";
import bs58 from "bs58";

// NFT Minter Program ID
const NFT_MINTER_PROGRAM_ID = new PublicKey(
  "23YMuS5hCGw6h8AQSNTbiREtwPENebAg9g9VQ8VfSKGA"
);

// Token Metadata Program ID (Metaplex)
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export interface DirectMintResult {
  success: boolean;
  txId?: string;
  mintAddress?: string;
  error?: string;
}

/**
 * Directly mints an NFT using the provided parameters without Anchor
 */
export async function directMintNft(
  connection: Connection,
  payerPrivateKey: string, // Base58 encoded private key
  nftName: string,
  nftSymbol: string,
  nftUri: string
): Promise<DirectMintResult> {
  try {
    console.log("Starting direct NFT minting process");

    // Decode the payer private key
    const payerKeypair = Keypair.fromSecretKey(
      bs58.decode(payerPrivateKey)
    );
    console.log("Payer Public Key:", payerKeypair.publicKey.toString());

    // Generate a new keypair for the mint
    const mintKeypair = Keypair.generate();
    console.log("Mint Public Key:", mintKeypair.publicKey.toString());

    // Get the associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      payerKeypair.publicKey
    );
    console.log("Associated Token Account:", associatedTokenAddress.toString());

    // Derive the metadata account address
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    console.log("Metadata Address:", metadataAddress.toString());

    // Derive the master edition account address
    const [masterEditionAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    console.log("Master Edition Address:", masterEditionAddress.toString());

    // Create a new transaction
    const transaction = new Transaction();

    // Add the mint NFT instruction
    const data = Buffer.from(
      JSON.stringify({
        name: nftName,
        symbol: nftSymbol,
        uri: nftUri
      })
    );

    // Create the instruction with all required accounts
    const mintNftInstruction = new TransactionInstruction({
      keys: [
        { pubkey: payerKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: metadataAddress, isSigner: false, isWritable: true },
        { pubkey: masterEditionAddress, isSigner: false, isWritable: true },
        { pubkey: mintKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: TOKEN_METADATA_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: NFT_MINTER_PROGRAM_ID,
      data: data,
    });

    transaction.add(mintNftInstruction);

    // Send and confirm the transaction
    console.log("Sending transaction...");
    const txId = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeypair, mintKeypair],
      {
        commitment: "confirmed",
        skipPreflight: false,
      }
    );
    console.log("Transaction confirmed:", txId);

    return {
      success: true,
      txId,
      mintAddress: mintKeypair.publicKey.toString(),
    };
  } catch (error: any) {
    console.error("Error minting NFT:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
}