import { AutoBattleField } from "./autoBattlefield";
import { Character, SpecialAbility } from "./characters";

export class SpecialAbilityHandler {
    private battlefield: AutoBattleField;

    constructor(battlefield: AutoBattleField) {
        this.battlefield = battlefield
    }

    execute(ability: SpecialAbility, caster: Character, target: Character) {
        const casterMP = caster.getAttribute('mp')!.getValue();
        const abilityName = ability.getName();
        if (casterMP < ability.getMPCost()) {
            this.battlefield.log(`${caster.getName()} lacks MP to acivate ${abilityName}`, 'console')
            return null;
        }

        caster.modifyAttribute('mp', casterMP - ability.getMPCost());
        
        switch (abilityName) {
            case 'evasion':
                return this.evasion(caster, abilityName)
            case 'critical strike':
                return this.criticalStrike(caster, target, abilityName)
            case 'poison':
                return this.poison(caster, target, abilityName)
            case 'stun':
                return this.stun(caster, target, abilityName)
            case 'heal self':
                return this.healSelf(caster, abilityName)
            case 'heal others':
                return this.healOthers(caster, abilityName)
            case 'buff':
                return this.buff(caster, abilityName)
            default:
                throw Error(`${abilityName} is not implemented`)
        }
    }
    private evasion(caster: Character, abilityName: string) {
        let duration = 1;
        this.battlefield.applyStatusEffect(caster, 'evasion', caster);
        this.battlefield.log(`${caster.getName()} activates ${abilityName} for  ${duration} turns`)
        return { effect: 'evasion', duration: duration };
    }

    private criticalStrike(caster: Character, target: Character, abilityName: string) {
        const baseDamage = caster.getAttribute('dmg')?.getValue();
        const multiplier = caster.getSpecialAbility('critical strike').getValue()
        if (!baseDamage) throw Error('dmg attribute does not exist');
        const extraDamage = baseDamage * multiplier;
        const targetHP = target.getAttribute('hp')!.getValue()
        target.modifyAttribute('hp', targetHP - extraDamage);
        this.battlefield.log(`${caster.getName()} uses ${abilityName} on ${target.getName()} dealing an extra ${extraDamage} damage. ${target.getName()} has ${targetHP - extraDamage} HP left`, 'console')
        return { effect: 'critical strike', extraDamage }
    }

    private poison(caster: Character, target: Character, abilityName: string) {
        let duration = 3;
        let poisonDamage = 10
        this.battlefield.applyStatusEffect(caster, 'poison', target);
        this.battlefield.log(`${caster.getName()} uses ${abilityName} on ${target.getName()} for  ${duration} turns (damage: ${poisonDamage}/turn)`, 'console')
        return { effect: 'poison', duration: duration, damage: poisonDamage };
    }

    private stun(caster: Character, target: Character, abilityName: string) {
        let duration = 1
        this.battlefield.applyStatusEffect(caster, 'stun', target);
        this.battlefield.log(`${caster.getName()} uses ${abilityName} on ${target.getName()} causing them to miss their next turn`, 'console')
        return { effect: 'stun', duration: duration };
    }

    private healSelf(caster: Character, abilityName: string) {
        let healAmount = caster.getSpecialAbility('heal self').getValue()
        caster.modifyAttribute('hp', caster.getAttribute('hp')!.getValue() + healAmount);
        this.battlefield.log(`${caster.getName()} uses ${abilityName} on self for ${healAmount} HP`, 'console')
        return { effect: 'heal self', healAmount };
    }

    private healOthers(caster: Character, abilityName: string) {
        let healAmount = caster.getSpecialAbility('heal others').getValue()
        const teamMates = this.battlefield.getTeamByChar(caster).getMembers().filter(m => m !== caster);
        const teamMatesAndHP = teamMates.map(teamMate => {
            return { teamMate, hp: teamMate.getAttribute('hp')!.getValue() }
        })
        const target = teamMatesAndHP.sort((a, b) => a.hp - b.hp)[0]
        target.teamMate.modifyAttribute('hp', target.hp + healAmount);
        this.battlefield.log(`${caster.getName()} uses ${abilityName} on ${target.teamMate.getName()} self for ${healAmount} HP`, 'console')
        return { effect: 'heal others', healAmount };
    }

    private buff(caster: Character, abilityName: string) {
        let buffAmount = caster.getSpecialAbility('buff').getValue()
        caster.modifyAttribute('armor', caster.getAttribute('armor')!.getValue() + buffAmount);
        this.battlefield.log(`${caster.getName()} uses ${abilityName} to buff their armor by ${buffAmount}`, 'console')
        return { effect: 'buff', buffAmount };
    }
}