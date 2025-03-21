import { StatusEffect } from "../enums";
import { attribute, specialAbility } from "../types";
import { ability, getAbilityDescription } from "../utils";

export class Attribute {
    private name: string;
    private value: number

    constructor(name: string, rank: number) {
        this.name = name;
        this.value = rank
    }

    getValue() {
        return this.value
    }

    setValue(value: number) {
        this.value = value
    }

    getName = () => {
        return this.name
    }
}

class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getPosition = () => {
        return { x: this.x, y: this.y }
    }
}

export class SpecialAbility {
    private name: string;
    private value: number;
    private mpCost: number;
    private skillName: string
    private statusEffect: boolean = false
    private description: string = ''
    private duration: number = 0

    constructor(name: string, value: number, mpCost: number, skillName: string) {
        this.mpCost = mpCost;
        this.name = name;
        this.skillName = skillName;
        this.value = value

        if (name in StatusEffect) {
            this.statusEffect = true
            if (name === 'poison') this.duration = 3
            else this.duration = 1
        }
        this.description = getAbilityDescription(name);
    }

    getValue = () => {
        return this.value
    }

    getName = () => {
        return this.name
    }
    getMPCost(){
        return this.mpCost
    }
    getDecrption = () => {
        return this.description
    }
}

export class Character {
    private name: string;
    private chracterClass: string;
    private attributes: Attribute[];
    private specialAbilities: SpecialAbility[];
    private CharRank: number = 0;
    private AttrRank: number = 0;
    private AbilityRank: number = 0;
    private position: Position = new Position(0, 0)
    private statusEffect = {
        evasion: 0,
        buff: 0,
        poison: 0,
        stun: 0
    }
    private properties: attribute

    constructor(name: string, chracterClass: string, attributes: Attribute[], specialAbilities: SpecialAbility[]) {
        this.name = name;
        this.attributes = attributes;
        this.chracterClass = chracterClass;

        this.properties = this.getAttributes()

        let arr = []
        for (let ability of specialAbilities) {
            this.AbilityRank += ability.getValue();

            arr.push({ name: ability.getName(), value: ability.getValue(), description: ability.getDecrption() })
        }
        // this.specialAbilities = arr;
        this.specialAbilities = specialAbilities
        this.CharRank = this.AbilityRank + this.AttrRank;
    }

    getAttributes = () => {
        let obj: attribute = {
            mp: 0,
            hp: 0,
            dmg: 0,
            speed: 0,
            range: 0,
            armor: 0,
            stamina: 0
        }
        for (let a of this.attributes) {
            this.AttrRank += a.getValue()
            if (a.getName() === "mp") obj.mp = a.getValue()
            else if (a.getName() === "hp") obj.hp = a.getValue()
            else if (a.getName() === "dmg") obj.dmg = a.getValue()
            else if (a.getName() === "speed") obj.speed = a.getValue()
            else if (a.getName() === "range") obj.range = a.getValue()
            else if (a.getName() === "armor") obj.armor = a.getValue()
            else obj.stamina = a.getValue()
        }
        return obj
    }

    toJSON() {
        return {
            name: this.name,
            class: this.chracterClass,
            attributes: this.properties,
            rank: `${this.CharRank} (${this.getBattleRank()})`,
            specialAbility: this.specialAbilities
        }
    }

    describe() {
        console.log("Name: ", this.name)
        console.log("Class: ", this.chracterClass);
        console.log("Attributes: ")
        for (let prop in this.properties) console.log(`${prop}: ${this.properties[prop as keyof typeof this.properties]}`);
        console.log("Special Ability: ")
        for (let ability of this.specialAbilities) console.log(`${ability.getName()}: ${ability.getDecrption()} - ${ability.getValue()}`)
    }

    getName(){
        return this.name
    }

    getSpecialAbilities(){
        return this.specialAbilities
    }
    getAttribute(name: string) {
        for (let attr of this.attributes) {
            if (attr.getName() === name) {
                return attr
            }
        }
        return null;
    }

    modifyAttribute(name: string, value: number) {
        const attr = this.getAttribute(name)
        if (attr) {
            attr.setValue(value);
            this.CharRank -= this.AttrRank;
            this.AttrRank = 0
            this.properties = this.getAttributes()
            this.CharRank += this.AttrRank
        }
        else console.log(`No attribute with name ${name}`);
    }
    getSpecialAbility(abilityName: string){
        for(let ability of this.specialAbilities){
            if(ability.getName() === abilityName){
                return ability;
            }
        }
        throw Error(`No special ablity with name ${abilityName}`)
    }
    getDescription(){
        return `
        Name: ${this.name}
        Class: ${this.chracterClass}
        Attributes: ${this.attributes}
        SpecialAbilities: ${this.specialAbilities}
        `
    }


    getCharRank(){
        return this.CharRank;
    }
    getBattleRank(){
        if(this.CharRank <= 4000) return 'E'
        else if(this.CharRank > 4000 && this.CharRank <= 6000) return 'D'
        else if(this.CharRank > 6000 && this.CharRank <= 8000) return 'C'
        else if(this.CharRank > 8000 && this.CharRank <= 10000) return 'B'
        else if(this.CharRank > 10000 && this.CharRank <= 14000) return 'A'
        else return 'S'
        
    }
}