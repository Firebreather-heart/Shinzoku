import * as anchor from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  AnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const idl = {
  address: "5JuwQ9gEGRxFvmFbADkYT47CNxQ5Guust86Rb9Bs6vzN",
  metadata: {
    name: "nft_minter",
    version: "0.1.0",
    spec: "0.1.0",
    description: "NFT minting program deployed via Solana Playground",
  },
  instructions: [
    {
      name: "mintNft",
      discriminator: [53, 103, 229, 118, 191, 42, 10, 215],
      accounts: [
        {
          name: "payer",
          writable: true,
          signer: true,
        },
        {
          name: "metadataAccount",
          writable: true,
        },
        {
          name: "editionAccount",
          writable: true,
        },
        {
          name: "mintAccount",
          writable: true,
          signer: true,
        },
        {
          name: "associatedTokenAccount",
          writable: true,
        },
        {
          name: "tokenProgram",
        },
        {
          name: "tokenMetadataProgram",
        },
        {
          name: "associatedTokenProgram",
        },
        {
          name: "systemProgram",
        },
        {
          name: "rent",
        },
      ],
      args: [
        {
          name: "nftName",
          type: "string",
        },
        {
          name: "nftSymbol",
          type: "string",
        },
        {
          name: "nftUri",
          type: "string",
        },
      ],
    },
  ],
};


const PROGRAM_ID = new PublicKey(
  "5JuwQ9gEGRxFvmFbADkYT47CNxQ5Guust86Rb9Bs6vzN"
);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const NftMint = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const mintNft = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      alert("Connect your wallet");
      return;
    }

    const provider = new anchor.AnchorProvider(
      connection,
      wallet as AnchorWallet,
      anchor.AnchorProvider.defaultOptions()
    );
    const program = new anchor.Program(idl as anchor.Idl, provider);

    const mintKeypair = anchor.web3.Keypair.generate();
    const tokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      wallet.publicKey
    );

    const [metadataAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const [editionAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    try {
      const tx = await program.methods
        .mintNft("Devnet NFT", "DNFT", "https://example.com/metadata.json")
        .accounts({
          payer: wallet.publicKey,
          mintAccount: mintKeypair.publicKey,
          associatedTokenAccount: tokenAccount,
          metadataAccount,
          editionAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([mintKeypair])
        .rpc();

      console.log("✅ NFT Minted: ", tx);
    } catch (err) {
      console.error("❌ Error minting NFT", err);
    }
  };

  return (
    <div>
      <button onClick={mintNft} style={{ padding: 10, marginTop: 20 }}>
        Mint NFT
      </button>
    </div>
  );
};

export default NftMint;