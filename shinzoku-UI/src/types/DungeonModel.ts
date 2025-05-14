export interface DungeonRewardItem {
    item: string; // shinzoku_id of the item
    dropRate: number;
}

export interface DungeonRewards {
    exp: number;
    gold: number;
    items: DungeonRewardItem[];
}

export interface DungeonModel {
    dungeon_id: string;
    name: string;
    description: string;
    image_url: string;
    boss: string; // shinzoku_id of the boss demon
    members: string[]; // array of shinzoku_ids for member demons
    rank: number;
    rank_name: string;
    rewards: DungeonRewards;
}