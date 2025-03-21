"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ability = exports.StatusEffect = void 0;
var StatusEffect;
(function (StatusEffect) {
    StatusEffect[StatusEffect["evasion"] = 0] = "evasion";
    StatusEffect[StatusEffect["poison"] = 1] = "poison";
    StatusEffect[StatusEffect["stun"] = 2] = "stun";
})(StatusEffect || (exports.StatusEffect = StatusEffect = {}));
var Ability;
(function (Ability) {
    Ability["evasion"] = "Evade attacks to certain extent";
    Ability["criticalStrike"] = "Chance to deal certain multiple of damage";
    Ability["poison"] = "Deal damage over time";
    Ability["stun"] = "Stun the enemy for a turn";
    Ability["healSelf"] = "Heal self";
    Ability["healOthers"] = "Heal others";
    Ability["buff"] = "Increase hp to certain extent";
})(Ability || (exports.Ability = Ability = {}));
