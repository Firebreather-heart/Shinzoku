"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var characters_1 = require("./classes/characters");
// let name:string = Ability.evasion
// console.log(name)
// if(name in StatusEffect){
//     const res = getAbilityDescription(name)
//     console.log(res)
// }
var attributes = [
    { name: "hp", value: 5000 },
    { name: "mp", value: 7000 },
    { name: "armor", value: 500 },
    { name: "range", value: 350 },
    { name: "dmg", value: 500 },
    { name: "speed", value: 450 },
    { name: "stamina", value: 1100 }
];
var power = new characters_1.SpecialAbility("poison", 1000, 100, "testing");
console.log(power);
var attrArray = attributes.map(function (a) { return new characters_1.Attribute(a.name, a.value); });
var hidan = new characters_1.Character("Hidan", "Rogue ninja", attrArray, [power]);
console.log(hidan.toJSON());
hidan.modifyAttribute("stamina", 100);
hidan.modifyAttribute("mp", 6000);
console.log((_a = hidan.getAttribute("hp")) === null || _a === void 0 ? void 0 : _a.getValue());
