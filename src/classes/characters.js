"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = exports.SpecialAbility = exports.Attribute = void 0;
var enums_1 = require("../enums");
var utils_1 = require("../utils");
var Attribute = /** @class */ (function () {
    function Attribute(name, rank) {
        var _this = this;
        this.getName = function () {
            return _this.name;
        };
        this.name = name;
        this.value = rank;
    }
    Attribute.prototype.getValue = function () {
        return this.value;
    };
    Attribute.prototype.setValue = function (value) {
        this.value = value;
    };
    return Attribute;
}());
exports.Attribute = Attribute;
var Position = /** @class */ (function () {
    function Position(x, y) {
        var _this = this;
        this.getPosition = function () {
            return { x: _this.x, y: _this.y };
        };
        this.x = x;
        this.y = y;
    }
    return Position;
}());
var SpecialAbility = /** @class */ (function () {
    function SpecialAbility(name, value, mpCost, skillName) {
        var _this = this;
        this.statusEffect = false;
        this.description = '';
        this.duration = 0;
        this.getValue = function () {
            return _this.value;
        };
        this.getName = function () {
            return _this.name;
        };
        this.getDecrption = function () {
            return _this.description;
        };
        this.mpCost = mpCost;
        this.name = name;
        this.skillName = skillName;
        this.value = value;
        if (name in enums_1.StatusEffect) {
            this.statusEffect = true;
            if (name === 'poison')
                this.duration = 3;
            else
                this.duration = 1;
        }
        this.description = (0, utils_1.getAbilityDescription)(name);
    }
    SpecialAbility.prototype.getMPCost = function () {
        return this.mpCost;
    };
    return SpecialAbility;
}());
exports.SpecialAbility = SpecialAbility;
var Character = /** @class */ (function () {
    function Character(name, chracterClass, attributes, specialAbilities) {
        var _this = this;
        this.CharRank = 0;
        this.AttrRank = 0;
        this.AbilityRank = 0;
        this.position = new Position(0, 0);
        this.statusEffect = {
            evasion: 0,
            buff: 0,
            poison: 0,
            stun: 0
        };
        this.getAttributes = function () {
            var obj = {
                mp: 0,
                hp: 0,
                dmg: 0,
                speed: 0,
                range: 0,
                armor: 0,
                stamina: 0
            };
            for (var _i = 0, _a = _this.attributes; _i < _a.length; _i++) {
                var a = _a[_i];
                _this.AttrRank += a.getValue();
                if (a.getName() === "mp")
                    obj.mp = a.getValue();
                else if (a.getName() === "hp")
                    obj.hp = a.getValue();
                else if (a.getName() === "dmg")
                    obj.dmg = a.getValue();
                else if (a.getName() === "speed")
                    obj.speed = a.getValue();
                else if (a.getName() === "range")
                    obj.range = a.getValue();
                else if (a.getName() === "armor")
                    obj.armor = a.getValue();
                else
                    obj.stamina = a.getValue();
            }
            return obj;
        };
        this.name = name;
        this.attributes = attributes;
        this.chracterClass = chracterClass;
        this.properties = this.getAttributes();
        var arr = [];
        for (var _i = 0, specialAbilities_1 = specialAbilities; _i < specialAbilities_1.length; _i++) {
            var ability_1 = specialAbilities_1[_i];
            this.AbilityRank += ability_1.getValue();
            arr.push({ name: ability_1.getName(), value: ability_1.getValue(), description: ability_1.getDecrption() });
        }
        // this.specialAbilities = arr;
        this.specialAbilities = specialAbilities;
        this.CharRank = this.AbilityRank + this.AttrRank;
    }
    Character.prototype.toJSON = function () {
        return {
            name: this.name,
            class: this.chracterClass,
            attributes: this.properties,
            rank: "".concat(this.CharRank, " (").concat(this.getBattleRank(), ")"),
            specialAbility: this.specialAbilities
        };
    };
    Character.prototype.describe = function () {
        console.log("Name: ", this.name);
        console.log("Class: ", this.chracterClass);
        console.log("Attributes: ");
        for (var prop in this.properties)
            console.log("".concat(prop, ": ").concat(this.properties[prop]));
        console.log("Special Ability: ");
        for (var _i = 0, _a = this.specialAbilities; _i < _a.length; _i++) {
            var ability_2 = _a[_i];
            console.log("".concat(ability_2.getName(), ": ").concat(ability_2.getDecrption(), " - ").concat(ability_2.getValue()));
        }
    };
    Character.prototype.getName = function () {
        return this.name;
    };
    Character.prototype.getSpecialAbilities = function () {
        return this.specialAbilities;
    };
    Character.prototype.getAttribute = function (name) {
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var attr = _a[_i];
            if (attr.getName() === name) {
                return attr;
            }
        }
        return null;
    };
    Character.prototype.modifyAttribute = function (name, value) {
        var attr = this.getAttribute(name);
        if (attr) {
            attr.setValue(value);
            this.CharRank -= this.AttrRank;
            this.AttrRank = 0;
            this.properties = this.getAttributes();
            this.CharRank += this.AttrRank;
        }
        else
            console.log("No attribute with name ".concat(name));
    };
    Character.prototype.getSpecialAbility = function (abilityName) {
        for (var _i = 0, _a = this.specialAbilities; _i < _a.length; _i++) {
            var ability_3 = _a[_i];
            if (ability_3.getName() === abilityName) {
                return ability_3;
            }
        }
        throw Error("No special ablity with name ".concat(abilityName));
    };
    Character.prototype.getDescription = function () {
        return "\n        Name: ".concat(this.name, "\n        Class: ").concat(this.chracterClass, "\n        Attributes: ").concat(this.attributes, "\n        SpecialAbilities: ").concat(this.specialAbilities, "\n        ");
    };
    Character.prototype.getCharRank = function () {
        return this.CharRank;
    };
    Character.prototype.getBattleRank = function () {
        if (this.CharRank <= 4000)
            return 'E';
        else if (this.CharRank > 4000 && this.CharRank <= 6000)
            return 'D';
        else if (this.CharRank > 6000 && this.CharRank <= 8000)
            return 'C';
        else if (this.CharRank > 8000 && this.CharRank <= 10000)
            return 'B';
        else if (this.CharRank > 10000 && this.CharRank <= 14000)
            return 'A';
        else
            return 'S';
    };
    return Character;
}());
exports.Character = Character;
