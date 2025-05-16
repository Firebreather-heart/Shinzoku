import { Connection, PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Metaplex } from "@metaplex-foundation/js";
import { CharacterModel } from "@/types/CharacterModel";
import { ItemModel } from "@/types/ItemModel";
import { ShinzokuAPI } from "@/services/ShinzokuAPI";

export interface ShinzokuNftInventory {
    characters: CharacterModel[];
    items: ItemModel[];
    loading: boolean;
    error: string | null;
    lastUpdated: number;
}

/**
 * Scans the connected wallet for Shinzoku NFTs and fetches their data
 */
export async function scanWalletForShinzokuNFTs(
    connection: Connection,
    wallet: WalletContextState
): Promise<ShinzokuNftInventory> {
    if (!wallet.connected || !wallet.publicKey) {
        return {
            characters: [],
            items: [],
            loading: false,
            error: "Wallet not connected",
            lastUpdated: Date.now()
        };
    }

    try {
        console.log("Scanning wallet for Shinzoku NFTs...");

        // Initialize Metaplex
        const metaplex = Metaplex.make(connection);

        // Arrays to hold our results
        const characters: CharacterModel[] = [];
        const items: ItemModel[] = [];

        // Fetch all NFTs owned by the wallet using Metaplex
        const nfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
        console.log(`Found ${nfts.length} total NFTs in wallet`);

        // Process each NFT
        for (const nft of nfts) {
            try {
                // Skip if not loaded correctly or missing URI
                if (!nft.uri) continue;

                // Fetch metadata from URI
                const response = await fetch(nft.uri);
                if (!response.ok) continue;

                const metadata = await response.json();

                // Check if this is a Shinzoku NFT
                if (isShinzokuNFT(nft, metadata)) {
                    console.log(`Found Shinzoku NFT: ${metadata.name}`);

                    const shinzokuId = extractShinzokuId(nft, metadata);
                    if (!shinzokuId) continue;

                    // Determine if it's a character or item
                    if (isCharacterNFT(nft, metadata)) {
                        // Fetch full character data from API
                        const characterData = await ShinzokuAPI.getCharacterById(shinzokuId);
                        if (characterData) {
                            characters.push(characterData);
                            console.log(`Added character: ${characterData.name}`);
                        }
                    } else if (isItemNFT(nft, metadata)) {
                        // Fetch full item data from API
                        const itemData = await ShinzokuAPI.getItemById(shinzokuId);
                        if (itemData) {
                            items.push(itemData);
                            console.log(`Added item: ${itemData.name}`);
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing NFT:`, error);
            }
        }

        return {
            characters,
            items,
            loading: false,
            error: null,
            lastUpdated: Date.now()
        };
    } catch (error) {
        console.error("Error scanning wallet for NFTs:", error);
        return {
            characters: [],
            items: [],
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
            lastUpdated: Date.now()
        };
    }
}

// Helper function to check if an NFT is a Shinzoku NFT
function isShinzokuNFT(nft: any, metadata: any): boolean {
    return (
        (nft.name?.includes("Shinzoku") || metadata.name?.includes("Shinzoku")) ||
        nft.symbol === "SHINZ" ||
        metadata.symbol === "SHINZ" ||
        metadata.collection?.name?.includes("Shinzoku") ||
        metadata.attributes?.some((attr: any) =>
            (attr.trait_type === "game" && attr.value === "Shinzoku") ||
            (attr.trait_type === "collection" && attr.value?.includes("Shinzoku"))
        ) ||
        nft.uri?.includes("shinzoku") ||
        metadata.external_url?.includes("shinzoku")
    );
}

// Helper function to check if an NFT is a character
function isCharacterNFT(nft: any, metadata: any): boolean {
    const isExplicitlyCharacter = metadata.attributes?.some((attr: any) =>
        (attr.trait_type === "type" && attr.value === "character") ||
        (attr.trait_type === "category" && attr.value === "character")
    );

    if (isExplicitlyCharacter) return true;

    // Check name patterns
    const nameIndicatesCharacter =
        nft.name?.toLowerCase().includes("character") ||
        metadata.name?.toLowerCase().includes("character") ||
        metadata.name?.toLowerCase().includes("warrior") ||
        metadata.name?.toLowerCase().includes("hero");

    if (nameIndicatesCharacter) return true;

    // Check URI patterns
    const uriIndicatesCharacter = nft.uri?.includes("/characters/");
    if (uriIndicatesCharacter) return true;

    // If it's a Shinzoku NFT but definitely not an item, assume it's a character
    if (!isItemNFT(nft, metadata)) return true;

    return false;
}

// Helper function to check if an NFT is an item
function isItemNFT(nft: any, metadata: any): boolean {
    const isExplicitlyItem = metadata.attributes?.some((attr: any) =>
        (attr.trait_type === "type" && attr.value === "item") ||
        (attr.trait_type === "category" && attr.value === "item")
    );

    if (isExplicitlyItem) return true;

    // Check name patterns
    const nameIndicatesItem =
        nft.name?.toLowerCase().includes("item") ||
        metadata.name?.toLowerCase().includes("item");

    if (nameIndicatesItem) return true;

    // Check URI patterns
    const uriIndicatesItem = nft.uri?.includes("/items/");
    if (uriIndicatesItem) return true;

    return false;
}

// Helper function to extract Shinzoku ID from metadata
function extractShinzokuId(nft: any, metadata: any): string | null {
    // Try to find ID in attributes
    const idAttribute = metadata.attributes?.find((attr: any) =>
        attr.trait_type === "shinzoku_id" ||
        attr.trait_type === "id" ||
        attr.trait_type === "assetId"
    );

    if (idAttribute?.value) return idAttribute.value.toString();

    // Try to extract from external URL
    if (metadata.external_url && metadata.external_url.includes("shinzoku")) {
        const matches = metadata.external_url.match(/shinzoku[^\/]*\/([^\/]+)/i);
        if (matches && matches[1]) return matches[1];
    }

    // Try extracting from URI
    if (nft.uri) {
        // Pattern for /characters/ID or /items/ID
        const uriMatches = nft.uri.match(/\/(characters|items)\/([a-zA-Z0-9_-]+)/i);
        if (uriMatches && uriMatches[2]) return uriMatches[2];

        // Pattern for shinzoku_ID.json
        const fileMatches = nft.uri.match(/shinzoku_([a-zA-Z0-9_-]+)\.json/i);
        if (fileMatches && fileMatches[1]) return `shinzoku_${fileMatches[1]}`;
    }

    return null;
}