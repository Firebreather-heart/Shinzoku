import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Metaplex } from "@metaplex-foundation/js";
import { CharacterModel } from '@/types/CharacterModel';
import { ItemModel } from '@/types/ItemModel';

interface ShinzokuNftInventory {
    characters: CharacterModel[];
    items: ItemModel[];
    loading: boolean;
    error: string | null;
    lastUpdated: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const INVENTORY_CACHE_KEY = 'shinzoku-nft-inventory';
const BASE_URL = 'shinzoku-admin.vercel.app';
const API_URL = `https://${BASE_URL}/api`;
const API_KEY = process.env.NEXT_PUBLIC_SHINZOKU_API_KEY || 'your_api_key_here';
const getRequestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${API_KEY}`
    }
};

// Add this fetchMetadataSafely function above your scanWallet function
const fetchMetadataSafely = async (nft: any) => {
    try {
        // First try direct fetch if the URL looks valid
        if (nft.uri && !nft.uri.includes('shinzoku.com')) {
            console.log(`  Fetching metadata from original URI: ${nft.uri}`);
            const response = await fetch(nft.uri);
            if (response.ok) {
                return await response.json();
            }
        }

        // Try to extract ID from the URI or name
        let id = null;

        // Extract from URI
        if (nft.uri) {
            const uriMatches = nft.uri.match(/shinzok[u_]+([a-zA-Z0-9_-]+)/i);
            if (uriMatches && uriMatches[1]) {
                id = uriMatches[1];
            }
        }

        // If no ID from URI, try name
        if (!id && nft.name) {
            const nameMatches = nft.name.match(/shinzok[u_]+([a-zA-Z0-9_-]+)/i);
            if (nameMatches && nameMatches[1]) {
                id = nameMatches[1];
            }
        }

        // If we found an ID, try the correct metadata URL format
        if (id) {
            console.log(`  Extracted ID from NFT: ${id}`);

            // First try character metadata
            const characterMetadataUrl = `https://${BASE_URL}/characters/${id}/metadata`;
            console.log(`  Trying character metadata URL: ${characterMetadataUrl}`);
            try {
                const charResponse = await fetch(characterMetadataUrl);
                if (charResponse.ok) {
                    const data = await charResponse.json();
                    console.log(`  Successfully fetched character metadata`);
                    return data;
                }
            } catch (error) {
                console.log(`  Error fetching character metadata: ${error}`);
            }

            // If character metadata fails, try item metadata
            const itemMetadataUrl = `https://${BASE_URL}/items/${id}/metadata`;
            console.log(`  Trying item metadata URL: ${itemMetadataUrl}`);
            try {
                const itemResponse = await fetch(itemMetadataUrl);
                if (itemResponse.ok) {
                    const data = await itemResponse.json();
                    console.log(`  Successfully fetched item metadata`);
                    return data;
                }
            } catch (error) {
                console.log(`  Error fetching item metadata: ${error}`);
            }
        }

        // If we got here, we couldn't fetch metadata properly

        console.log(`  Failed to fetch metadata through all available methods`);

        // Create minimal metadata from NFT data
        return {
            name: nft.name || 'Unknown Shinzoku NFT',
            image: '',
            attributes: [
                {
                    trait_type: 'shinzoku_id',
                    value: id || `shinzok_${nft.address.toString().substring(0, 16)}`
                }
            ]
        };
    } catch (error) {
        console.error(`  Error in fetchMetadataSafely: ${error}`);
        return null;
    }
};

export function useNftInventory(isOpen: boolean) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [inventory, setInventory] = useState<ShinzokuNftInventory>({
        characters: [],
        items: [],
        loading: false,
        error: null,
        lastUpdated: 0
    });

    const scanWallet = useCallback(async (forceRefresh = false) => {
        if (!wallet.connected || !wallet.publicKey) {
            console.log("Cannot scan: wallet not connected");
            return;
        }

        const walletAddress = wallet.publicKey.toString();
        const cacheKey = `${INVENTORY_CACHE_KEY}-${walletAddress}`;

        // Check for cached data
        if (!forceRefresh) {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData) as ShinzokuNftInventory;
                    const isRecent = Date.now() - parsed.lastUpdated < CACHE_TTL;

                    if (isRecent) {
                        console.log("Using cached NFT inventory data");
                        setInventory(parsed);
                        return;
                    }
                } catch (error) {
                    console.error("Error parsing cached inventory data:", error);
                }
            }
        }

        // No valid cache, scan the wallet
        setInventory(prev => ({ ...prev, loading: true, error: null }));
        console.log("Starting NFT scan for wallet:", walletAddress);

        try {
            // Initialize Metaplex
            const metaplex = Metaplex.make(connection);

            // Fetch all NFTs owned by the wallet
            const nfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
            console.log(`Found ${nfts.length} total NFTs in wallet`);

            // Log all NFTs before filtering
            console.group("All NFTs in wallet (before filtering)");
            nfts.forEach((nft, index) => {
                console.log(`NFT #${index + 1}:`, {
                    name: nft.name,
                    symbol: nft.symbol,
                    address: nft.address.toString(),
                    uri: nft.uri,
                    isMutable: nft.isMutable,
                    primarySaleHappened: nft.primarySaleHappened,
                    sellerFeeBasisPoints: nft.sellerFeeBasisPoints,
                    editionNonce: nft.editionNonce,
                    tokenStandard: nft.tokenStandard,
                    collection: nft.collection ? {
                        verified: nft.collection.verified,
                        address: nft.collection.address.toString()
                    } : null,
                    creators: nft.creators?.map(creator => ({
                        address: creator.address.toString(),
                        verified: creator.verified,
                        share: creator.share
                    }))
                });
            });
            console.groupEnd();

            const characters: CharacterModel[] = [];
            const items: ItemModel[] = [];

            // Process each NFT
            for (const nft of nfts) {
                try {
                    if (!nft.uri) {
                        console.log(`Skipping NFT ${nft.address.toString()} - missing URI`);
                        continue;
                    }

                    console.log(`Checking NFT: ${nft.name} (${nft.address.toString()})`);
                    console.log(`  URI: ${nft.uri}`);

                    // Fetch metadata from URI
                    const metadata = await fetchMetadataSafely(nft);
                    if (!metadata) {
                        console.log(`  Could not fetch metadata, skipping NFT`);
                        continue;
                    }

                    console.group(`  Metadata for ${nft.name}`);
                    console.log("  Raw metadata:", metadata);
                    if (metadata.attributes?.length > 0) {
                        console.table(metadata.attributes.map((attr: any) => ({
                            trait_type: attr.trait_type,
                            value: attr.value
                        })));
                    }
                    console.groupEnd();

                    // Check if this is a Shinzoku NFT
                    const isShinzoku = isShinzokuNFT(nft, metadata);
                    console.log(`  Is Shinzoku NFT: ${isShinzoku ? 'Yes' : 'No'}`);

                    if (isShinzoku) {
                        const shinzokuId = extractShinzokuId(nft, metadata);
                        console.log(`  Extracted Shinzoku ID: ${shinzokuId || 'None'}`);

                        if (!shinzokuId) continue;

                        // Determine if it's a character or item
                        const isCharacter = isCharacterNFT(nft, metadata);
                        const isItem = isItemNFT(nft, metadata);

                        console.log(`  NFT Type: ${isCharacter ? 'Character' : (isItem ? 'Item' : 'Unknown')}`);

                        if (isCharacter) {
                            try {
                                // Validate shinzokuId
                                if (!shinzokuId || shinzokuId.length < 10) {
                                    console.log(`  Invalid shinzokuId: ${shinzokuId}, skipping API call`);
                                    continue;
                                }

                                console.log(`  Fetching character data for ID: ${shinzokuId}`);

                                // Convert any ID format variations to consistent format for API
                                const apiId = shinzokuId.replace(/^shinzoku_/, 'shinzok_').replace(/^shinzok_0*/, 'shinzok_');

                                // Create mock character data since API may not be ready
                                const mockCharacter: CharacterModel = {
                                    shinzoku_id: shinzokuId,
                                    name: metadata.name || 'Unknown Character',
                                    rarity: metadata.attributes?.find((a: any) => a.trait_type === 'rarity')?.value || 'Common',
                                    rank_name: metadata.attributes?.find((a: any) => a.trait_type === 'rank')?.value || 'Bronze',
                                    image_url: metadata.image || '',
                                    special_abilities: [],
                                    stats: {
                                        power: Math.floor(Math.random() * 100) + 50,
                                        defense: Math.floor(Math.random() * 100) + 30,
                                        speed: Math.floor(Math.random() * 100) + 20
                                    }
                                };

                                try {
                                    // Try to fetch from API first
                                    const response = await fetch(`${API_URL}/characters/${apiId}`, getRequestOptions);

                                    if (response.ok) {
                                        const characterData = await response.json();
                                        characters.push(characterData);
                                        console.log(`  Added character from API: ${characterData.name}`);
                                    } else {
                                        // Fall back to mock data if API fails
                                        console.log(`  API fetch failed, using mock data for: ${mockCharacter.name}`);
                                        characters.push(mockCharacter);
                                    }
                                } catch (error) {
                                    // Also fall back to mock data on error
                                    console.error(`  Error fetching character data: ${error}`);
                                    console.log(`  Using mock data for: ${mockCharacter.name}`);
                                    characters.push(mockCharacter);
                                }
                            } catch (error) {
                                console.error(`  Error processing character: ${error}`);
                            }
                        } else if (isItem) {
                            try {
                                // Validate shinzokuId
                                if (!shinzokuId || shinzokuId.length < 10) {
                                    console.log(`  Invalid shinzokuId: ${shinzokuId}, skipping API call`);
                                    continue;
                                }

                                console.log(`  Fetching item data for ID: ${shinzokuId}`);

                                // Convert any ID format variations to consistent format for API
                                const apiId = shinzokuId.replace(/^shinzoku_/, 'shinzok_');

                                // Create mock item data
                                const mockItem: ItemModel = {
                                    shinzoku_id: shinzokuId,
                                    name: metadata.name || 'Unknown Item',
                                    rarity: metadata.attributes?.find((a: any) => a.trait_type === 'rarity')?.value || 'Common',
                                    rank_name: metadata.attributes?.find((a: any) => a.trait_type === 'rank')?.value || 'Bronze',
                                    image_url: metadata.image || '',
                                    special_abilities: [],
                                    stats: {
                                        power: Math.floor(Math.random() * 50) + 10,
                                        defense: Math.floor(Math.random() * 50) + 5
                                    }
                                };

                                try {
                                    // Try to fetch from API first
                                    const response = await fetch(`${API_URL}/items/${apiId}`, getRequestOptions);

                                    if (response.ok) {
                                        const itemData = await response.json();
                                        items.push(itemData);
                                        console.log(`  Added item from API: ${itemData.name}`);
                                    } else {
                                        // Fall back to mock data if API fails
                                        console.log(`  API fetch failed, using mock data for: ${mockItem.name}`);
                                        items.push(mockItem);
                                    }
                                } catch (error) {
                                    // Also fall back to mock data on error
                                    console.error(`  Error fetching item data: ${error}`);
                                    console.log(`  Using mock data for: ${mockItem.name}`);
                                    items.push(mockItem);
                                }
                            } catch (error) {
                                console.error(`  Error processing item: ${error}`);
                            }
                        }

                        // After the isCharacter/isItem checks, add a fallback to look at the raw metadata for item indicators
                        if (!isCharacter && !isItem) {
                            // Try examining the raw metadata for the item ID pattern
                            if (metadata.shinzoku_id && metadata.shinzoku_id.toString().includes('item')) {
                                console.log(`  Special case: Detected item from raw metadata shinzoku_id`);
                                isItem = true;

                                // Set the shinzokuId if it wasn't extracted properly
                                if (!shinzokuId) {
                                    shinzokuId = metadata.shinzoku_id.toString();
                                    console.log(`  Setting shinzokuId from raw metadata: ${shinzokuId}`);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing NFT ${nft.address.toString()}:`, error);
                }
            }

            // Log final results
            console.group("Final NFT Inventory");
            console.log(`Found ${characters.length} Shinzoku characters:`);
            characters.forEach((char, i) => console.log(`${i + 1}. ${char.name} (${char.shinzoku_id})`));

            console.log(`\nFound ${items.length} Shinzoku items:`);
            items.forEach((item, i) => console.log(`${i + 1}. ${item.name} (${item.shinzoku_id})`));
            console.groupEnd();

            const newInventory = {
                characters,
                items,
                loading: false,
                error: null,
                lastUpdated: Date.now()
            };

            // Store in localStorage
            localStorage.setItem(cacheKey, JSON.stringify(newInventory));

            // Update state
            setInventory(newInventory);
            console.log("NFT scan complete!");
        } catch (error) {
            console.error("Error scanning wallet for NFTs:", error);
            setInventory(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : "Unknown error scanning wallet"
            }));
        }
    }, [connection, wallet]);

    // This effect runs when the inventory is opened
    useEffect(() => {
        console.log("Inventory open state changed:", isOpen);

        if (isOpen && wallet.connected) {
            console.log("Inventory is open and wallet is connected, starting scan");
            scanWallet();
        }
    }, [isOpen, wallet.connected, scanWallet]);

    // This effect runs when the wallet connection changes
    useEffect(() => {
        console.log("Wallet connection changed:", {
            connected: wallet.connected,
            publicKey: wallet.publicKey?.toString()
        });

        if (isOpen && wallet.connected) {
            console.log("Wallet connected while inventory is open, scanning");
            scanWallet(true); // Force refresh when wallet changes
        }
    }, [wallet.connected, wallet.publicKey?.toString()]);

    return {
        ...inventory,
        refresh: () => scanWallet(true)
    };
}

// Helper function to check if an NFT is a Shinzoku NFT
function isShinzokuNFT(nft: any, metadata: any): boolean {
    // Check for Shinzoku ID attribute with the correct format
    const hasShinzokuID = metadata.attributes?.some((attr: any) =>
        attr.trait_type === "shinzoku_id" &&
        (attr.value?.toString().startsWith("shinzok_") || attr.value?.toString().startsWith("shinzoku_"))
    );

    if (hasShinzokuID) return true;

    // Additional checks, less specific but still useful as fallback
    return (
        (nft.name?.includes("Shinzoku") || metadata.name?.includes("Shinzoku")) ||
        nft.symbol === "SHINZ" ||
        metadata.symbol === "SHINZ" ||
        metadata.collection?.name?.includes("Shinzoku") ||
        nft.uri?.includes("shinzoku") ||
        metadata.external_url?.includes("shinzoku")
    );
}

// Helper function to check if an NFT is a character
function isCharacterNFT(nft: any, metadata: any): boolean {
    // Check for specific Shinzoku character ID format
    const shinzokuId = getShinzokuId(metadata);
    if (shinzokuId && shinzokuId.startsWith("shinzok_") && !shinzokuId.includes("_item_")) {
        return true;
    }

    // Additional checks as fallback
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

    return false;
}

// Helper function to check if an NFT is an item
function isItemNFT(nft: any, metadata: any): boolean {
    // Check if shinzoku_id exists directly in the metadata and contains "item"
    if (metadata.shinzoku_id && metadata.shinzoku_id.toString().includes("item")) {
        return true;
    }

    // Check for specific Shinzoku item ID format
    const shinzokuId = getShinzokuId(metadata);
    if (shinzokuId && (shinzokuId.includes("_item_") || shinzokuId.includes("item"))) {
        return true;
    }

    // Additional checks as fallback
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

// Helper function to get Shinzoku ID from metadata
function getShinzokuId(metadata: any): string | null {
    // First check if shinzoku_id exists directly in metadata (top level)
    if (metadata.shinzoku_id) {
        return metadata.shinzoku_id.toString();
    }

    // Then check in the attributes array
    const idAttribute = metadata.attributes?.find((attr: any) =>
        attr.trait_type === "shinzoku_id"
    );
    return idAttribute?.value?.toString() || null;
}

// Improved helper function to extract Shinzoku ID from metadata
function extractShinzokuId(nft: any, metadata: any): string | null {
    // First check if it exists directly in the metadata object
    if (metadata.shinzoku_id) {
        const id = metadata.shinzoku_id.toString();
        if ((id.startsWith("shinzok_") || id.startsWith("shinzoku_")) && id.length > 10) {
            return id;
        }
    }

    // Then check attributes for the specific ID format we expect
    const shinzokuId = getShinzokuId(metadata);
    if (shinzokuId) {
        // Validate the format
        if (
            (shinzokuId.startsWith("shinzok_") || shinzokuId.startsWith("shinzoku_")) &&
            shinzokuId.length > 10
        ) {
            // Clean up any potential typos in the ID format (shinzok vs shinzoku)
            return shinzokuId;
        }
    }

    // Secondary attribute checks
    const idAttribute = metadata.attributes?.find((attr: any) =>
        attr.trait_type === "id" || attr.trait_type === "assetId"
    );

    if (idAttribute?.value) {
        const id = idAttribute.value.toString();
        if (id.length > 5) return id;
    }

    // Try to extract from NFT name if it contains an ID
    if (metadata.name) {
        const idMatches = metadata.name.match(/shinzok[u_]+([a-f0-9_]+)/i);
        if (idMatches && idMatches[1]) {
            return `shinzok_${idMatches[1]}`;
        }
    }

    // Try to extract from external URL
    if (metadata.external_url && metadata.external_url.includes("shinzoku")) {
        const matches = metadata.external_url.match(/shinzok[u_]+([a-f0-9_]+)/i);
        if (matches && matches[1]) {
            return `shinzok_${matches[1]}`;
        }
    }

    // Try extracting from URI
    if (nft.uri) {
        // Pattern for shinzok_ID.json
        const fileMatches = nft.uri.match(/shinzok[u_]+([a-f0-9_]+)/i);
        if (fileMatches && fileMatches[1]) {
            return `shinzok_${fileMatches[1]}`;
        }
    }

    return null;
}