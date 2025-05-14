import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { createHash } from 'crypto';

// NFT Minter Program ID
const NFT_MINTER_PROGRAM_ID = new PublicKey(
  "23YMuS5hCGw6h8AQSNTbiREtwPENebAg9g9VQ8VfSKGA"
);

// Token Metadata Program ID (Metaplex)
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Base URIs for metadata
const METADATA_BASE_URLS = {
  characters: "https://shinzoku-admin.vercel.app/api/characters/",
  items: "https://shinzoku-admin.vercel.app/api/items/"
};

// Calculate the discriminator for mint_nft (first 8 bytes of sha256 hash)
// This is the Anchor standard way to calculate discriminators
function calculateDiscriminator(namespace: string, name: string): Buffer {
  const preimage = `${namespace}:${name}`;
  const hash = createHash('sha256').update(preimage).digest();
  return Buffer.from(hash.slice(0, 8));
}

// Discriminator for "mint_nft"
const MINT_NFT_DISCRIMINATOR = calculateDiscriminator("global", "mint_nft");

/**
 * NFT Type enum
 */
export enum NftType {
  CHARACTER = 'characters',
  ITEM = 'items'
}

/**
 * Mints an NFT using the NFT Minter program
 */
export async function mintNFT(
  connection: Connection,
  wallet: WalletContextState,
  id: string,
  name: string,
  type: NftType = NftType.CHARACTER
) {
  try {
    // Check if wallet is connected
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected");
    }

    console.log(`Starting NFT minting for ${type} ${name} (ID: ${id})`);

    // Generate a new keypair for the mint
    const mintKeypair = Keypair.generate();
    console.log("Mint Public Key:", mintKeypair.publicKey.toString());

    // Calculate minimum rent for the mint account
    const MINT_SIZE = 82;
    const mintRent = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

    // Get the associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      wallet.publicKey
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

    // Set up NFT metadata
    const nftName = `Shinzoku: ${name}`;
    const nftSymbol = "SHINZ";

    // Build the correct metadata URL based on the NFT type
    const nftUri = `${METADATA_BASE_URLS[type]}${id}/metadata/`;
    console.log(`Metadata URI: ${nftUri}`);

    // Convert strings to byte arrays
    const nameBytes = Buffer.from(nftName);
    const symbolBytes = Buffer.from(nftSymbol);
    const uriBytes = Buffer.from(nftUri);

    // Create buffers for the lengths (4 bytes each, little endian)
    const nameLenBytes = Buffer.alloc(4);
    nameLenBytes.writeUInt32LE(nameBytes.length, 0);

    const symbolLenBytes = Buffer.alloc(4);
    symbolLenBytes.writeUInt32LE(symbolBytes.length, 0);

    const uriLenBytes = Buffer.alloc(4);
    uriLenBytes.writeUInt32LE(uriBytes.length, 0);

    // Construct the complete instruction data
    const instructionData = Buffer.concat([
      MINT_NFT_DISCRIMINATOR, // 8 bytes for instruction discriminator
      nameLenBytes,           // 4 bytes for name length
      nameBytes,              // variable bytes for name
      symbolLenBytes,         // 4 bytes for symbol length
      symbolBytes,            // variable bytes for symbol
      uriLenBytes,            // 4 bytes for uri length
      uriBytes                // variable bytes for uri
    ]);

    // Add the mint NFT instruction with accounts in the EXACT order from the Rust program
    const mintNftInstruction = new TransactionInstruction({
      keys: [
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },         // payer (Signer)
        { pubkey: metadataAddress, isSigner: false, isWritable: true },         // metadata_account
        { pubkey: masterEditionAddress, isSigner: false, isWritable: true },    // edition_account
        { pubkey: mintKeypair.publicKey, isSigner: true, isWritable: true },    // mint_account
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },  // associated_token_account
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },       // token_program
        { pubkey: TOKEN_METADATA_PROGRAM_ID, isSigner: false, isWritable: false }, // token_metadata_program
        { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // associated_token_program
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // system_program
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },     // rent
      ],
      programId: NFT_MINTER_PROGRAM_ID,
      data: instructionData,
    });

    transaction.add(mintNftInstruction);

    // Get a recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    // Make sure the mint account is marked as a signer
    transaction.partialSign(mintKeypair);

    // Sign with the wallet
    const signedTransaction = await wallet.signTransaction(transaction);

    // Send transaction
    console.log("Sending transaction...");
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: true,
      maxRetries: 3,
    });

    console.log("Waiting for confirmation...");
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    }, "confirmed");

    console.log("Transaction confirmed:", signature);
    console.log(`Explorer URL: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    return {
      success: true,
      mintAddress: mintKeypair.publicKey.toString(),
      signature,
    };
  } catch (error: any) {
    console.error("Error minting NFT:", error);

    // Enhanced error handling
    if (error.name === 'SendTransactionError') {
      try {
        const logs = error.logs || [];
        console.error("Transaction logs:", logs.join('\n'));

        // Special handling for the fallback error
        if (logs.some((log: string) => log.includes("InstructionFallbackNotFound"))) {
          console.error("This is a discriminator issue. The program cannot recognize the instruction.");

          return {
            success: false,
            errorMessage: `The NFT minting program does not recognize this instruction. Please contact support with error code: FALLBACK_101`,
          };
        }

        return {
          success: false,
          errorMessage: `Transaction failed: ${error.message}\n\nLogs: ${logs.join('\n')}`,
        };
      } catch (logError) {
        // Fall back to standard error
      }
    }

    return {
      success: false,
      errorMessage: error.message || "Unknown error occurred",
    };
  }
}

/**
 * Mints an NFT for a character using the NFT Minter program
 * @deprecated Use mintNFT with NftType.CHARACTER instead
 */
export async function mintCharacterNFT(
  connection: Connection,
  wallet: WalletContextState,
  characterId: string,
  characterName: string
) {
  return mintNFT(connection, wallet, characterId, characterName, NftType.CHARACTER);
}

/**
 * Mints an NFT for an item using the NFT Minter program
 */
export async function mintItemNFT(
  connection: Connection,
  wallet: WalletContextState,
  itemId: string,
  itemName: string
) {
  return mintNFT(connection, wallet, itemId, itemName, NftType.ITEM);
}