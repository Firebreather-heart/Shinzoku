"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePlayerFromData = exports.getAbilityDescription = exports.ability = void 0;
var characters_1 = require("./classes/characters");
exports.ability = [
    { name: "evasion", description: "Evade attacks to certain extent" },
    { name: 'critical strike', description: 'Chance to deal certain multiple of damage' },
    { name: 'poison', description: 'Deal damage over time' },
    { name: 'stun', description: 'Stun the enemy for a turn' },
    { name: 'heal self', description: 'Heal self' },
    { name: 'heal others', description: 'Heal others' },
    { name: 'buff', description: 'Increase hp to certain extent' }
];
var getAbilityDescription = function (name) {
    var abilityObj = exports.ability.filter(function (a) { return a.name === name; })[0];
    return abilityObj.description;
};
exports.getAbilityDescription = getAbilityDescription;
var initiatePlayerFromData = function (playerData) {
    var attrArray = playerData.attributes.map(function (a) { return new characters_1.Attribute(a.name, a.value); });
    var specialAbilityArray = playerData.specialAbilities.map(function (s) { return new characters_1.SpecialAbility(s.name, s.value, s.mpCost, s.abilityName); });
    return new characters_1.Character(playerData.name, playerData.class, attrArray, specialAbilityArray);
};
exports.initiatePlayerFromData = initiatePlayerFromData;
