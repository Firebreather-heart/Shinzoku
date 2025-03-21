"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialAbilityHandler = void 0;
var SpecialAbilityHandler = /** @class */ (function () {
    function SpecialAbilityHandler(battlefield) {
        this.battlefield = battlefield;
    }
    SpecialAbilityHandler.prototype.execute = function (ability, caster, target) {
        var casterMP = caster.getAttribute('mp').getValue();
        var abilityName = ability.getName();
        if (casterMP < ability.getMPCost()) {
            this.battlefield.log("".concat(caster.getName(), " lacks MP to acivate ").concat(abilityName), 'console');
            return null;
        }
        caster.modifyAttribute('mp', casterMP - ability.getMPCost());
        switch (abilityName) {
            case 'evasion':
                return this.evasion(caster, abilityName);
            case 'critical strike':
                return this.criticalStrike(caster, target, abilityName);
            case 'poison':
                return this.poison(caster, target, abilityName);
            case 'stun':
                return this.stun(caster, target, abilityName);
            case 'heal self':
                return this.healSelf(caster, abilityName);
            case 'heal others':
                return this.healOthers(caster, abilityName);
            case 'buff':
                return this.buff(caster, abilityName);
            default:
                throw Error("".concat(abilityName, " is not implemented"));
        }
    };
    SpecialAbilityHandler.prototype.evasion = function (caster, abilityName) {
        var duration = 1;
        this.battlefield.applyStatusEffect(caster, 'evasion', caster);
        this.battlefield.log("".concat(caster.getName(), " activates ").concat(abilityName, " for  ").concat(duration, " turns"));
        return { effect: 'evasion', duration: duration };
    };
    SpecialAbilityHandler.prototype.criticalStrike = function (caster, target, abilityName) {
        var _a;
        var baseDamage = (_a = caster.getAttribute('dmg')) === null || _a === void 0 ? void 0 : _a.getValue();
        var multiplier = caster.getSpecialAbility('critical strike').getValue();
        if (!baseDamage)
            throw Error('dmg attribute does not exist');
        var extraDamage = baseDamage * multiplier;
        var targetHP = target.getAttribute('hp').getValue();
        target.modifyAttribute('hp', targetHP - extraDamage);
        this.battlefield.log("".concat(caster.getName(), " uses ").concat(abilityName, " on ").concat(target.getName(), " dealing an extra ").concat(extraDamage, " damage. ").concat(target.getName(), " has ").concat(targetHP - extraDamage, " HP left"), 'console');
        return { effect: 'critical strike', extraDamage: extraDamage };
    };
    SpecialAbilityHandler.prototype.poison = function (caster, target, abilityName) {
        var duration = 3;
        var poisonDamage = 10;
        this.battlefield.applyStatusEffect(caster, 'poison', target);
        this.battlefield.log("".concat(caster.getName(), " uses ").concat(abilityName, " on ").concat(target.getName(), " for  ").concat(duration, " turns (damage: ").concat(poisonDamage, "/turn)"), 'console');
        return { effect: 'poison', duration: duration, damage: poisonDamage };
    };
    SpecialAbilityHandler.prototype.stun = function (caster, target, abilityName) {
        var duration = 1;
        this.battlefield.applyStatusEffect(caster, 'stun', target);
        this.battlefield.log("".concat(caster.getName(), " uses ").concat(abilityName, " on ").concat(target.getName(), " causing them to miss their next turn"), 'console');
        return { effect: 'stun', duration: duration };
    };
    SpecialAbilityHandler.prototype.healSelf = function (caster, abilityName) {
        var healAmount = caster.getSpecialAbility('heal self').getValue();
        caster.modifyAttribute('hp', caster.getAttribute('hp').getValue() + healAmount);
        this.battlefield.log("".concat(caster.getName(), " uses ").concat(abilityName, " on self for ").concat(healAmount, " HP"), 'console');
        return { effect: 'heal self', healAmount: healAmount };
    };
    SpecialAbilityHandler.prototype.healOthers = function (caster, abilityName) {
        var healAmount = caster.getSpecialAbility('heal others').getValue();
        var teamMates = this.battlefield.getTeamByChar(caster).getMembers().filter(function (m) { return m !== caster; });
        var teamMatesAndHP = teamMates.map(function (teamMate) {
            return { teamMate: teamMate, hp: teamMate.getAttribute('hp').getValue() };
        });
        var target = teamMatesAndHP.sort(function (a, b) { return a.hp - b.hp; })[0];
        target.teamMate.modifyAttribute('hp', target.hp + healAmount);
        this.battlefield.log("".concat(caster.getName(), " uses ").concat(abilityName, " on ").concat(target.teamMate.getName(), " self for ").concat(healAmount, " HP"), 'console');
        return { effect: 'heal others', healAmount: healAmount };
    };
    SpecialAbilityHandler.prototype.buff = function (caster, abilityName) {
        var buffAmount = caster.getSpecialAbility('buff').getValue();
        caster.modifyAttribute('armor', caster.getAttribute('armor').getValue() + buffAmount);
        this.battlefield.log("".concat(caster.getName(), " uses ").concat(abilityName, " to buff their armor by ").concat(buffAmount), 'console');
        return { effect: 'buff', buffAmount: buffAmount };
    };
    return SpecialAbilityHandler;
}());
exports.SpecialAbilityHandler = SpecialAbilityHandler;
