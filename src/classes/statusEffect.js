"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusEffect = void 0;
var StatusEffect = /** @class */ (function () {
    function StatusEffect(name, value, duration, recipient) {
        this.isActive = false;
        this.name = name;
        this.value = value;
        this.duration = duration;
        this.receipient = recipient;
    }
    StatusEffect.prototype.getReceipient = function () {
        return this.receipient;
    };
    StatusEffect.prototype.getName = function () {
        return this.name;
    };
    StatusEffect.prototype.getValue = function () {
        return this.value;
    };
    StatusEffect.prototype.getDuration = function () {
        return this.duration;
    };
    StatusEffect.prototype.setDuration = function (duration) {
        this.duration = duration;
    };
    StatusEffect.prototype.activate = function () {
        this.isActive = true;
    };
    StatusEffect.prototype.deactivate = function () {
        this.isActive = false;
    };
    StatusEffect.prototype.use = function () {
        if (this.isActive) {
            this.duration -= 1;
            if (this.duration === 0)
                this.deactivate();
        }
    };
    return StatusEffect;
}());
exports.StatusEffect = StatusEffect;
