"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoBattleField = void 0;
var handlers_1 = require("./handlers");
var statusEffect_1 = require("./statusEffect");
var AutoBattleField = /** @class */ (function () {
    function AutoBattleField(team1, team2, movesPerTurn) {
        this.commentary = [];
        this.statusEffects = [];
        if (!movesPerTurn)
            this.movesPerTurn = 3;
        else
            this.movesPerTurn = movesPerTurn;
        this.team1 = team1;
        this.team2 = team2;
        this.turnStateMarker = team1;
        this.turnCount = 1;
        this.specialAbilityHandler = new handlers_1.SpecialAbilityHandler(this);
    }
    AutoBattleField.prototype.log = function (message, destination) {
        if (destination === void 0) { destination = 'console'; }
        this.commentary.push(message);
        if (destination == 'console')
            console.log(message);
    };
    AutoBattleField.prototype.getCharByTeam = function (name, team) {
        var char = team.getMembers().filter(function (c) { return c.getName() === name; })[0];
        return char;
    };
    AutoBattleField.prototype.getTeamByChar = function (char) {
        for (var _i = 0, _a = this.team1.getMembers(); _i < _a.length; _i++) {
            var member = _a[_i];
            if (char === member)
                return this.team1;
        }
        return this.team2;
    };
    AutoBattleField.prototype.nextTurn = function () {
        if (this.turnStateMarker == this.team1)
            this.turnStateMarker = this.team2;
        else
            this.turnStateMarker = this.team1;
        this.turnCount += 1;
        this.checkAndApplyPoisonEffects();
        this.log("Turn ".concat(this.turnCount), 'console');
    };
    AutoBattleField.prototype.getActiveTeam = function () {
        return this.turnStateMarker;
    };
    AutoBattleField.prototype.getInactiveTeam = function () {
        if (this.turnStateMarker == this.team1)
            return this.team2;
        return this.team1;
    };
    AutoBattleField.prototype.attack = function (attacker, target) {
        var _a, _b, _c, _d, _e;
        if (this.checkActiveStunEffect(attacker)) {
            this.log("".concat(attacker.getName(), " is stunned and cannot attack"), 'console');
            return { hpDamage: 0, armorDamage: 0 };
        }
        var damage = (_a = attacker.getAttribute('dmg')) === null || _a === void 0 ? void 0 : _a.getValue();
        var targetArmor = (_b = target.getAttribute('armor')) === null || _b === void 0 ? void 0 : _b.getValue();
        if (!damage || !targetArmor)
            throw Error("damage or target armor not specified");
        var _f = this.calculateHPArmorDamage(targetArmor, damage), hpDamage = _f.hpDamage, armorDamage = _f.armorDamage;
        var attackerSpeed = this.effectiveSpeed(attacker);
        var targetSpeed = this.effectiveSpeed(target);
        if (this.checkActiveEvasionSkill(target))
            return { hpDamage: 0, armorDamage: 0 };
        var damageFactor;
        if (targetSpeed === 0)
            damageFactor = 1;
        else
            damageFactor = attackerSpeed / targetSpeed;
        hpDamage *= damageFactor;
        hpDamage = Math.max(1, hpDamage);
        armorDamage = Math.max(0, armorDamage);
        var attackerStamina = (_c = attacker.getAttribute('stamina')) === null || _c === void 0 ? void 0 : _c.getValue();
        var targetStamina = (_d = target.getAttribute('stamina')) === null || _d === void 0 ? void 0 : _d.getValue();
        var targetHP = (_e = target.getAttribute('hp')) === null || _e === void 0 ? void 0 : _e.getValue();
        if (!attackerStamina || !targetStamina || !targetHP)
            throw Error("attributes dont exist");
        attacker.modifyAttribute('stamina', attackerStamina - 4);
        target.modifyAttribute('stamina', targetStamina - 4);
        target.modifyAttribute('hp', targetHP - hpDamage);
        target.modifyAttribute('armor', targetArmor - armorDamage);
        return { hpDamage: hpDamage, armorDamage: armorDamage };
    };
    AutoBattleField.prototype.effectiveSpeed = function (character, maxStamina) {
        var _a, _b;
        if (maxStamina === void 0) { maxStamina = 1000; }
        var baseSpeed = (_a = character.getAttribute("speed")) === null || _a === void 0 ? void 0 : _a.getValue();
        var stamina = (_b = character.getAttribute("stamina")) === null || _b === void 0 ? void 0 : _b.getValue();
        if (!baseSpeed || !stamina)
            throw Error("no speed or stamina value");
        return baseSpeed * (stamina / maxStamina);
    };
    AutoBattleField.prototype.calculateHPArmorDamage = function (armor, damage) {
        var hpDamage = damage * 100 / (100 + armor);
        var armorDamage = (1 - hpDamage / damage) * armor * 0.3;
        return { hpDamage: hpDamage, armorDamage: armorDamage };
    };
    AutoBattleField.prototype.initiatePlayerAction = function (character) {
        var _a, _b;
        var opponent = this.pickOpponent();
        if (!opponent)
            return null;
        if (this.turnCount % 3 === 0) {
            var ability = this.randomizer(character.getSpecialAbilities());
            this.specialAbilityHandler.execute(ability, character, opponent);
        }
        else {
            var _c = this.attack(character, opponent), hpDamage = _c.hpDamage, armorDamage = _c.armorDamage;
            var comment = void 0;
            var oppHP = (_a = opponent.getAttribute('hp')) === null || _a === void 0 ? void 0 : _a.getValue();
            var oppArm = (_b = opponent.getAttribute('armor')) === null || _b === void 0 ? void 0 : _b.getValue();
            if (hpDamage === 0)
                comment = "".concat(character.getName(), " attacks ").concat(opponent.getName(), ", ").concat(opponent.getName(), " dodges the attack");
            else
                comment = "".concat(character.getName(), " attacks ").concat(opponent.getName(), ", dealing ").concat(hpDamage, " damage to HP and ").concat(armorDamage, " to armor. ").concat(opponent.getName(), " has ").concat(oppHP, " hp ad ").concat(oppArm, " armor left");
            this.log(comment, 'console');
        }
        var opponentTeam = this.getInactiveTeam();
        this.checkPlayerStatus(opponent, opponentTeam);
    };
    AutoBattleField.prototype.randomizer = function (array) {
        return array[Math.floor(Math.random() * array.length)];
    };
    AutoBattleField.prototype.pickOpponent = function () {
        var _this = this;
        var activeTeam = this.getActiveTeam();
        var oppTeam = activeTeam === this.team1 ? this.team2 : this.team1;
        var opps = oppTeam.getMembers();
        if (opps.length === 0)
            return null;
        var oppsVulnerability = opps.map(function (char) {
            return { vulnerability: _this.getVulnerability(char), char: char };
        });
        var target = oppsVulnerability.sort(function (a, b) { return b.vulnerability - a.vulnerability; });
        // console.log("heree",opps)
        return target[0].char;
    };
    AutoBattleField.prototype.checkPlayerStatus = function (player, opponentTeam) {
        var _a;
        var playerHP = (_a = player.getAttribute('hp')) === null || _a === void 0 ? void 0 : _a.getValue();
        if (playerHP === undefined)
            throw Error("hp attribute not defined");
        if (playerHP <= 0) {
            this.log("".concat(player.getName(), " has been killed"), 'console');
            var foundPlayer = false;
            for (var _i = 0, _b = opponentTeam.getMembers(); _i < _b.length; _i++) {
                var member = _b[_i];
                if (member === player) {
                    var newMembers = opponentTeam.getMembers().filter(function (m) { return m !== player; });
                    // console.log(newMembers)
                    opponentTeam.setMembers(newMembers);
                    foundPlayer = true;
                }
            }
            console.log(foundPlayer);
            // if (!foundPlayer) {
            //     for (let member of this.team2.getMembers()) {
            //         if (member === player) {
            //             this.team2.setMembers(this.team2.getMembers().filter(m => m !== player))
            //         }
            //         foundPlayer = true
            //     }
            // }
        }
    };
    AutoBattleField.prototype.checkTeamStatus = function (team) {
        if (team.getMembers().length === 0) {
            this.log("".concat(team.getName(), " has been defeated"), 'console');
            return true;
        }
        return false;
    };
    AutoBattleField.prototype.getVulnerability = function (character) {
        var _a, _b;
        var charHp = (_a = character.getAttribute('hp')) === null || _a === void 0 ? void 0 : _a.getValue();
        var charArmor = (_b = character.getAttribute('armor')) === null || _b === void 0 ? void 0 : _b.getValue();
        if (!charArmor || !charHp)
            throw Error("No hp or armor attribute");
        return -(charHp + (charArmor * 0.5));
    };
    AutoBattleField.prototype.applyStatusEffect = function (character, effect, target) {
        var ability = character.getSpecialAbility(effect);
        var duration = effect === "poison" ? 3 : 1;
        var statusEffect = new statusEffect_1.StatusEffect(effect, ability.getValue(), duration, target);
        statusEffect.activate();
        this.statusEffects.push(statusEffect);
        // this.log(`${character.getName()} has activated ${effect} for ${duration} turns`, 'console');
    };
    AutoBattleField.prototype.processStatusEffects = function () {
        var expiredEffects = [];
        for (var _i = 0, _a = this.statusEffects; _i < _a.length; _i++) {
            var effect = _a[_i];
            if (effect.getName() === 'poison')
                continue;
            effect.setDuration(effect.getDuration() - 1);
            if (effect.getDuration() <= 0)
                expiredEffects.push(effect);
        }
        var _loop_1 = function (effect) {
            this_1.statusEffects = this_1.statusEffects.filter(function (e) { return e !== effect; });
            this_1.log("".concat(effect.getReceipient(), "'s ").concat(effect.getName(), " effect has worn off"), 'console');
        };
        var this_1 = this;
        for (var _b = 0, expiredEffects_1 = expiredEffects; _b < expiredEffects_1.length; _b++) {
            var effect = expiredEffects_1[_b];
            _loop_1(effect);
        }
    };
    AutoBattleField.prototype.checkActiveEvasionSkill = function (character) {
        for (var _i = 0, _a = this.statusEffects; _i < _a.length; _i++) {
            var effect = _a[_i];
            if (effect.getName() === 'evasion' && effect.getReceipient() === character)
                return true;
        }
        return false;
    };
    AutoBattleField.prototype.checkActiveStunEffect = function (character) {
        for (var _i = 0, _a = this.statusEffects; _i < _a.length; _i++) {
            var effect = _a[_i];
            if (effect.getName() === 'stun' && effect.getReceipient() === character)
                return true;
        }
        return false;
    };
    AutoBattleField.prototype.checkAndApplyPoisonEffects = function () {
        var _a;
        var _loop_2 = function (effect) {
            if (effect.getName() === 'poison') {
                var receipient = effect.getReceipient();
                var receipientHP = (_a = receipient.getAttribute('hp')) === null || _a === void 0 ? void 0 : _a.getValue();
                if (!receipientHP)
                    throw new Error('Character has no HP attribute');
                receipient.modifyAttribute("hp", receipientHP - effect.getValue());
                this_2.log("".concat(receipient.getName(), " -").concat(effect.getValue(), " hp"), 'console');
                effect.setDuration(effect.getDuration() - 1);
                if (effect.getDuration() === 0) {
                    this_2.statusEffects = this_2.statusEffects.filter(function (e) { return e !== effect; });
                    this_2.log("".concat(receipient.getName(), " is no longer poisoned"), 'console');
                }
                else
                    this_2.log("".concat(receipient.getName(), " is still poisoned for ").concat(effect.getDuration(), " turn(s)"), 'console');
            }
        };
        var this_2 = this;
        for (var _i = 0, _b = this.statusEffects; _i < _b.length; _i++) {
            var effect = _b[_i];
            _loop_2(effect);
        }
    };
    AutoBattleField.prototype.executeTurn = function () {
        var activeTeam = this.getActiveTeam();
        var opponentTeam = activeTeam === this.team1 ? this.team2 : this.team1;
        if (opponentTeam.getMembers().length === 0) {
            this.log("No opponent left for ".concat(activeTeam), 'console');
            return;
        }
        var i;
        for (i = 0; i < this.movesPerTurn; i++) {
            if (activeTeam.getMembers() && opponentTeam.getMembers()) {
                var player = this.randomizer(activeTeam.getMembers());
                var playerAction = this.initiatePlayerAction(player);
                if (playerAction === null)
                    break;
            }
            else
                break;
        }
        this.nextTurn();
    };
    AutoBattleField.prototype.runBattle = function (maxTurns) {
        if (maxTurns === void 0) { maxTurns = 200; }
        this.log("Battle Started", 'console');
        this.log("".concat(this.team1.getName(), " ").concat(this.team1.getTeamRating(), " VS ").concat(this.team2.getName(), " ").concat(this.team2.getTeamRating()));
        this.log("".concat(this.team1.getName(), " members ").concat(this.team1.getMembers().map(function (m) { return m.getName(); })));
        this.log("".concat(this.team2.getName(), " members ").concat(this.team2.getMembers().map(function (m) { return m.getName(); })));
        var winner;
        var team1Ratings;
        var team2Ratings;
        while (true) {
            this.executeTurn();
            team1Ratings = this.team1.getTeamRating();
            team2Ratings = this.team2.getTeamRating();
            if (this.checkTeamStatus(this.team1)) {
                winner = this.team2;
                break;
            }
            else if (this.checkTeamStatus(this.team2)) {
                winner = this.team1;
                break;
            }
            if (this.turnCount >= maxTurns) {
                this.log('Maximum number of turns reached', 'console');
                winner = team1Ratings > team2Ratings ? this.team1 : this.team2;
                break;
            }
        }
        this.log('Battle Simulation Finshed', 'console');
        this.log("The winner is ".concat(winner.getName(), ", team ratings: ").concat(this.team1.getName(), ":: ").concat(team1Ratings, " / ").concat(this.team2.getName(), ":: ").concat(team2Ratings));
        return winner;
    };
    return AutoBattleField;
}());
exports.AutoBattleField = AutoBattleField;
