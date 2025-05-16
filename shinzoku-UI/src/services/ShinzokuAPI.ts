import { CharacterModel } from "@/types/CharacterModel";
import { ItemModel } from "@/types/ItemModel";
//import { DemonModel } from "@/types/DemonModel";
import { DungeonModel, DemonModel } from "@/types/DungeonModel";

// API base URL - ensure this is a hardcoded string, not undefined
const API_BASE_URL = 'https://shinzoku-admin.vercel.app/api';
const API_KEY = 'shinzoku-katen-kyotsu-tensa-zangetsu';

// Common fetch options with API key
const getRequestOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': `${API_KEY}`
  }
};

export class ShinzokuAPI {
  // Fetch characters from the backend
  static async getCharacters(): Promise<CharacterModel[]> {
    try {
      // Use explicit string for URL to avoid undefined
      const url = `${API_BASE_URL}/characters`;
      const response = await fetch(url, getRequestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch characters: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching characters:", error);
      // Return empty array in case of error
      return [];
    }
  }

  // Fetch items from the backend
  static async getItems(): Promise<ItemModel[]> {
    try {
      const url = `${API_BASE_URL}/items`;
      const response = await fetch(url, getRequestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  }

  // Fetch demons from the backend
  static async getDemons(): Promise<DemonModel[]> {
    try {
      const url = `${API_BASE_URL}/demons`;
      const response = await fetch(url, getRequestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch demons: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching demons:", error);
      return [];
    }
  }

  // Fetch dungeons from the backend
  static async getDungeons(): Promise<DungeonModel[]> {
    try {
      const url = `${API_BASE_URL}/dungeons`;
      const response = await fetch(url, getRequestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch dungeons: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching dungeons:", error);
      return [];
    }
  }

  // Get a specific character by ID
  static async getCharacterById(id: string): Promise<CharacterModel | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/characters/${id}`, getRequestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch character: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching character ${id}:`, error);
      return null;
    }
  }

  // Get a specific item by ID
  static async getItemById(id: string): Promise<ItemModel | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, getRequestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch item: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching item ${id}:`, error);
      return null;
    }
  }

  // Get a specific dungeon by ID
  static async getDungeonById(id: string): Promise<DungeonModel | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/dungeons/${id}`, getRequestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch dungeon: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching dungeon ${id}:`, error);
      return null;
    }
  }

  // Get a specific demon by ID
  static async getDemonById(id: string): Promise<DemonModel | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/demons/${id}`, getRequestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch demon: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching demon ${id}:`, error);
      return null;
    }
  }
}
