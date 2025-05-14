import { Stats, SpecialAbility } from './CharacterModel';

export interface ItemModel {
    shinzoku_id: string;
    name: string;
    stats: Stats;
    special_abilities: SpecialAbility[];
    image_url: string;
    price: number;
    rarity: string;
    rank: number;
    rank_name: string;
}