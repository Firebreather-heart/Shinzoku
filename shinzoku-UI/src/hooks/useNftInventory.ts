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

const API_KEY = "shinzoku-katen-kyotsu-tensa-zangetsu";
const CACHE_TTL = 5 * 60 * 1000;
const INVENTORY_CACHE_KEY = 'shinzoku-nft-inventory';
const getRequestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${API_KEY}`
    }
};
const API_URL = 'https://shinzoku-admin.vercel.app/api';

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
        // Skip if wallet not connected
        if (!wallet.connected || !wallet.publicKey) return;

        // Check cache first
        const walletAddress = wallet.publicKey.toString();
        const cacheKey = `${INVENTORY_CACHE_KEY}-${walletAddress}`;

        if (!forceRefresh) {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData) as ShinzokuNftInventory;
                    if (Date.now() - parsed.lastUpdated < CACHE_TTL) {
                        setInventory(parsed);
                        return;
                    }
                } catch (error) {
                    // Cache invalid, continue with scan
                }
            }
        }

        // Start scan
        setInventory(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Get NFTs from wallet
            const metaplex = Metaplex.make(connection);
            const nfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
            console.log(`Found ${nfts.length} total NFTs in wallet`);

            const characters: CharacterModel[] = [];
            const items: ItemModel[] = [];

            // Process each NFT
            for (const nft of nfts) {
                try {
                    // Skip NFTs without URI
                    if (!nft.uri) continue;

                    // Fetch metadata
                    let metadata;
                    try {
                        const response = await fetch(nft.uri, getRequestOptions);
                        if (!response.ok) continue;
                        metadata = await response.json();
                    } catch (error) {
                        continue; // Skip if metadata fetch fails
                    }

                    // Check if the NFT has a shinzoku_id
                    if (!metadata.shinzoku_id) {
                        console.log("NFT missing shinzoku_id, skipping:", metadata.name);
                        continue;
                    }

                    const shinzokuId = metadata.shinzoku_id.toString();
                    console.log("Found Shinzoku NFT with ID:", shinzokuId);

                    // Simple classification: if ID contains "item", it's an item
                    const isItem = shinzokuId.toLowerCase().includes("item");
                    console.log(`${metadata.name} classified as: ${isItem ? "item" : "character"}`);

                    if (isItem) {
                        // Fetch item data from API
                        try {
                            const response = await fetch(`${API_URL}/items/${shinzokuId}`, getRequestOptions);

                            if (response.ok) {
                                const itemData = await response.json();
                                // Ensure we have stats even if empty
                                // if (!itemData.stats) {
                                //     itemData.stats = {
                                //         power: 0,
                                //         defense: 0
                                //     };
                                // }

                                // // Make sure shinzoku_id is set
                                // itemData.shinzoku_id = shinzokuId;

                                // console.log("Added item:", itemData.name);
                                // items.push(itemData);
                            } else {
                                console.log(`API returned ${response.status} for item ${shinzokuId}, using metadata`);
                            }
                        } catch (error) {
                            console.error(`Error fetching item data: ${error}`);
                        }
                    } else {
                        // Fetch character data from API
                        try {
                            const response = await fetch(`${API_URL}/characters/${shinzokuId}`, getRequestOptions);

                            if (response.ok) {
                                const characterData = await response.json();
                                // Ensure we have stats even if empty

                                // Make sure shinzoku_id is set
                                characterData.shinzoku_id = shinzokuId;

                                console.log("Added character:", characterData.name);
                                characters.push(characterData);
                            } else {
                                console.log(`API returned ${response.status} for character ${shinzokuId}, using metadata`);
                            }
                        } catch (error) {
                            console.error(`Error fetching character data: ${error}`);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing NFT: ${error}`);
                }
            }

            // Update inventory state
            const newInventory = {
                characters,
                items,
                loading: false,
                error: null,
                lastUpdated: Date.now()
            };

            // Cache results
            localStorage.setItem(cacheKey, JSON.stringify(newInventory));
            setInventory(newInventory);
            console.log(`Inventory scan complete: ${characters.length} characters, ${items.length} items`);

        } catch (error) {
            // Handle scan errors
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Error scanning wallet for NFTs:", errorMessage);
            setInventory(prev => ({
                ...prev,
                loading: false,
                error: errorMessage
            }));
        }
    }, [connection, wallet]);

    // Scan when inventory panel is opened
    useEffect(() => {
        if (isOpen && wallet.connected) {
            scanWallet();
        }
    }, [isOpen, wallet.connected, scanWallet]);

    // Rescan when wallet changes
    useEffect(() => {
        if (isOpen && wallet.connected) {
            scanWallet(true);
        }
    }, [wallet.publicKey?.toString()]);

    return {
        ...inventory,
        refresh: () => scanWallet(true)
    };
}