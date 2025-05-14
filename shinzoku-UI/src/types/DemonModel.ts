import { Stats, SpecialAbility } from './CharacterModel';

export interface DemonModel {
    shinzoku_id: string;
    name: string;
    stats: Stats;
    image_url: string;
    special_abilities: SpecialAbility[];
    type: string; // "Elite", "Normal", etc.
    rank: number;
    rank_name: string;
}