import { Attribute, Character, SpecialAbility } from "./classes/characters";
import { Ability, StatusEffect } from "./enums";
import { ability, getAbilityDescription } from "./utils";

// let name:string = Ability.evasion
// console.log(name)
// if(name in StatusEffect){
//     const res = getAbilityDescription(name)
//     console.log(res)
// }

const attributes = [
    { name: "hp", value: 5000 },
    { name: "mp", value: 7000 },
    { name: "armor", value: 500 },
    { name: "range", value: 350 },
    { name: "dmg", value: 500 },
    { name: "speed", value: 450 },
    { name: "stamina", value: 1100 }
]
const power = new SpecialAbility("poison", 1000, 100, "testing");
console.log(power)
const attrArray = attributes.map(a => new Attribute(a.name, a.value))
const hidan = new Character("Hidan", "Rogue ninja", attrArray, [power])
console.log(hidan.toJSON())
hidan.modifyAttribute("stamina", 100)
hidan.modifyAttribute("mp", 6000)
console.log(hidan.getAttribute("hp")?.getValue())