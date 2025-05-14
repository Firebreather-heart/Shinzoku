export interface Stats {
    hp: number;
    armor: number;
    dmg: number;
    range: number;
    speed: number;
    kp: number;
}

export interface SpecialAbility {
    name: string;
    value: number;
    mp_cost: number;
    jutsu_name: string;
    rank: number;
}

export interface CharacterModel {
    shinzoku_id: string;
    name: string;
    stats: Stats;
    image_url: string;
    special_abilities: SpecialAbility[];
    price: number;
    rarity: string;
    rank: number;
    rank_name: string;
}