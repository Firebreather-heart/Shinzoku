import { Attribute, Character, SpecialAbility } from "./classes/characters";
import { Ability, PlayerData } from "./types";

export const ability: Ability[] = [
    { name: "evasion", description: "Evade attacks to certain extent" },
    { name: 'critical strike', description: 'Chance to deal certain multiple of damage' },
    { name: 'poison', description: 'Deal damage over time' },
    { name: 'stun', description: 'Stun the enemy for a turn' },
    { name: 'heal self', description: 'Heal self' },
    { name: 'heal others', description: 'Heal others' },
    { name: 'buff', description: 'Increase hp to certain extent' }
]

export const getAbilityDescription = (name: string): string => {
    const [abilityObj] = ability.filter(a => a.name === name);
    return abilityObj.description
}

export const initiatePlayerFromData = (playerData: PlayerData) => {
    const attrArray = playerData.attributes.map(a => new Attribute(a.name, a.value));
    const specialAbilityArray = playerData.specialAbilities.map(s => new SpecialAbility(s.name, s.value, s.mpCost, s.abilityName));

    return new Character(playerData.name, playerData.class, attrArray, specialAbilityArray)
}