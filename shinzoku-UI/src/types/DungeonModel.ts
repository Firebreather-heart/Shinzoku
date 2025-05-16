import { Stats, SpecialAbility } from './CharacterModel';

export interface DungeonRewardItem {
    item: string; // shinzoku_id of the item
    dropRate: number;
}

export interface DemonModel {
    _id: string;
    demon_id: string;
    name: string;
    stats: Stats;
    image_url: string;
    special_abilities: SpecialAbility[];
    type: string; // "Elite", "Normal", "Boss", etc.
    rank: number;
    rank_name: string;
    createdAt: string;
    updatedAt: string;
}

export interface DungeonRewards {
    exp: number;
    gold: number;
    kino: number;
    items: DungeonRewardItem[];
}

export interface DungeonDemon {
    _id: string;
    name: string;
    image_url: string;
    type: string;
    rank: number;
    rank_name: string;
}

export interface DungeonModel {
    _id: string;
    dungeon_id: string;
    name: string;
    description: string;
    image_url: string;
    boss: DemonModel;
    members: DemonModel[];
    rank: number;
    rank_name: string;
    rewards: DungeonRewards;
    createdAt: string;
    updatedAt: string;
}



