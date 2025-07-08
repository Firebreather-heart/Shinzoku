import { v4 as uuidv4 } from 'uuid';
import { BattleEntity, SpecialAbility, EntityType } from '../services/BattleSimulator';

/**
 * Converts a character to a battle entity
 */
export function characterToBattleEntity(character: any, position?: { x: number, y: number }): BattleEntity {
    // Setup special abilities (skills)
    const specialAbilities: SpecialAbility[] = [];

    if (character.skills && Array.isArray(character.skills)) {
        character.skills.forEach((skill: any) => {
            // Determine if skill has status effect
            let statusEffectType: any = undefined;
            if (skill.type === 'heal') {
                statusEffectType = 'heal';
            } else if (skill.type === 'buff') {
                statusEffectType = 'buff';
            } else if (skill.type === 'poison' || skill.type === 'dot') {
                statusEffectType = 'poison';
            } else if (skill.type === 'stun' || skill.type === 'paralyze') {
                statusEffectType = 'stun';
            } else if (skill.type === 'evasion' || skill.type === 'dodge') {
                statusEffectType = 'evasion';
            }

            specialAbilities.push({
                name: skill.name || 'Unknown Skill',
                damage: skill.value || skill.damage || skill.power || 30,
                mpCost: skill.mpCost || skill.kpCost || skill.mp_cost || 20,
                cooldown: skill.cooldown || 3,
                currentCooldown: 0,
                jutsuName: skill.jutsuName || skill.jutsu_name,
                isStatusEffect: !!statusEffectType,
                statusEffectType,
                statusEffectDuration: skill.duration || 3,
                statusEffectValue: skill.value || 10
            });
        });
    }

    return {
        id: character.id || uuidv4(),
        name: character.name || 'Unknown Character',
        type: 'character' as EntityType,
        hp: character.health || character.hp || 100,
        maxHp: character.maxHealth || character.maxHp || character.health || character.hp || 100,
        mp: character.mp || character.kp || 100,
        maxMp: character.maxMp || character.maxKp || 100,
        attack: character.attack || character.damage || character.dmg || 20,
        defense: character.defense || character.armor || 10,
        speed: character.speed || 20,
        range: character.range || 1,
        position: position || { x: 0, y: 0 },
        isDead: false,
        specialAbilities
    };
}

/**
 * Converts a demon/enemy to a battle entity
 */
export function demonToBattleEntity(demon: any, position?: { x: number, y: number }): BattleEntity {
    // Setup special abilities
    const specialAbilities: SpecialAbility[] = [];

    if (demon.abilities && Array.isArray(demon.abilities)) {
        demon.abilities.forEach((ability: any) => {
            // Determine if ability has status effect
            let statusEffectType: any = undefined;
            if (ability.type === 'heal') {
                statusEffectType = 'heal';
            } else if (ability.type === 'buff') {
                statusEffectType = 'buff';
            } else if (ability.type === 'poison' || ability.type === 'dot') {
                statusEffectType = 'poison';
            } else if (ability.type === 'stun' || ability.type === 'paralyze') {
                statusEffectType = 'stun';
            } else if (ability.type === 'evasion' || ability.type === 'dodge') {
                statusEffectType = 'evasion';
            }

            specialAbilities.push({
                name: ability.name || 'Unknown Ability',
                damage: ability.damage || ability.value || ability.power || 40,
                mpCost: ability.mpCost || ability.mp_cost || 15,
                cooldown: ability.cooldown || 3,
                currentCooldown: 0,
                jutsuName: ability.jutsuName || ability.jutsu_name,
                isStatusEffect: !!statusEffectType,
                statusEffectType,
                statusEffectDuration: ability.duration || 2,
                statusEffectValue: ability.value || 15
            });
        });
    }

    return {
        id: demon.id || uuidv4(),
        name: demon.name || 'Unknown Demon',
        type: (demon.type === 'boss' ? 'boss' : 'demon') as EntityType,
        hp: demon.health || demon.hp || 120,
        maxHp: demon.maxHealth || demon.maxHp || demon.health || demon.hp || 120,
        mp: demon.mp || 80,
        maxMp: demon.maxMp || 80,
        attack: demon.attack || demon.damage || demon.dmg || 25,
        defense: demon.defense || demon.armor || 15,
        speed: demon.speed || 15,
        range: demon.range || 1,
        position: position || { x: 0, y: 0 },
        isDead: false,
        specialAbilities
    };
}