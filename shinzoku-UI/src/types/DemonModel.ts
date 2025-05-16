import { Stats, SpecialAbility } from './CharacterModel';

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