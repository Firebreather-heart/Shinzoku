import { specialAbility } from "../types";
import { Character, SpecialAbility } from "./characters";
import { SpecialAbilityHandler } from "./handlers";
import { StatusEffect } from "./statusEffect";
import { Team } from "./teams";

export class AutoBattleField {
    private team1: Team
    private team2: Team
    private movesPerTurn: number
    private turnStateMarker: Team
    private commentary: string[] = []
    private specialAbilityHandler: SpecialAbilityHandler
    private turnCount: number
    private statusEffects: StatusEffect[] = []

    constructor(team1: Team, team2: Team, movesPerTurn?: number) {
        if (!movesPerTurn) this.movesPerTurn = 3
        else this.movesPerTurn = movesPerTurn

        this.team1 = team1;
        this.team2 = team2;
        this.turnStateMarker = team1
        this.turnCount = 1
        this.specialAbilityHandler = new SpecialAbilityHandler(this)
    }

    log(message: string, destination: string = 'console') {
        this.commentary.push(message);
        if (destination == 'console') console.log(message);
    }

    getCharByTeam(name: string, team: Team) {
        const [char] = team.getMembers().filter(c => c.getName() === name);
        return char;
    }

    getTeamByChar(char: Character) {
        for (let member of this.team1.getMembers()) {
            if (char === member) return this.team1
        }
        return this.team2
    }

    nextTurn() {
        if (this.turnStateMarker == this.team1) this.turnStateMarker = this.team2;
        else this.turnStateMarker = this.team1

        this.turnCount += 1;
        this.checkAndApplyPoisonEffects();
        this.log(`Turn ${this.turnCount}`, 'console');
    }

    getActiveTeam() {
        return this.turnStateMarker;
    }

    getInactiveTeam() {
        if (this.turnStateMarker == this.team1) return this.team2;
        return this.team1;
    }

    attack(attacker: Character, target: Character): { hpDamage: number, armorDamage: number } {
        if (this.checkActiveStunEffect(attacker)) {
            this.log(`${attacker.getName()} is stunned and cannot attack`, 'console')
            return { hpDamage: 0, armorDamage: 0 }
        }
        const damage = attacker.getAttribute('dmg')?.getValue();
        const targetArmor = target.getAttribute('armor')?.getValue();
        if (!damage || !targetArmor) throw Error("damage or target armor not specified")
        let { hpDamage, armorDamage } = this.calculateHPArmorDamage(targetArmor, damage);

        const attackerSpeed = this.effectiveSpeed(attacker);
        const targetSpeed = this.effectiveSpeed(target);

        if (this.checkActiveEvasionSkill(target)) return { hpDamage: 0, armorDamage: 0 }

        let damageFactor;
        if (targetSpeed === 0) damageFactor = 1;
        else damageFactor = attackerSpeed / targetSpeed
        hpDamage *= damageFactor

        hpDamage = Math.max(1, hpDamage);
        armorDamage = Math.max(0, armorDamage);

        const attackerStamina = attacker.getAttribute('stamina')?.getValue()
        const targetStamina = target.getAttribute('stamina')?.getValue()
        const targetHP = target.getAttribute('hp')?.getValue()

        if (!attackerStamina || !targetStamina || !targetHP) throw Error("attributes dont exist")

        attacker.modifyAttribute('stamina', attackerStamina - 4)
        target.modifyAttribute('stamina', targetStamina - 4)
        target.modifyAttribute('hp', targetHP - hpDamage);
        target.modifyAttribute('armor', targetArmor - armorDamage);

        return { hpDamage, armorDamage }

    }
    effectiveSpeed(character: Character, maxStamina: number = 1000) {
        const baseSpeed = character.getAttribute("speed")?.getValue()
        const stamina = character.getAttribute("stamina")?.getValue()
        if (!baseSpeed || !stamina) throw Error("no speed or stamina value")

        return baseSpeed * (stamina / maxStamina);
    }

    calculateHPArmorDamage(armor: number, damage: number) {
        const hpDamage = damage * 100 / (100 + armor);
        const armorDamage = (1 - hpDamage / damage) * armor * 0.3;
        return { hpDamage, armorDamage }
    }

    initiatePlayerAction(character: Character) {
        const opponent = this.pickOpponent();
        if(!opponent) return null

        if (this.turnCount % 3 === 0) {
            const ability = this.randomizer(character.getSpecialAbilities()) as SpecialAbility
            this.specialAbilityHandler.execute(ability, character, opponent)
        }
        else {
            const { hpDamage, armorDamage } = this.attack(character, opponent)
            let comment;
            const oppHP = opponent.getAttribute('hp')?.getValue();
            const oppArm = opponent.getAttribute('armor')?.getValue();
            if (hpDamage === 0) comment = `${character.getName()} attacks ${opponent.getName()}, ${opponent.getName()} dodges the attack`
            else comment = `${character.getName()} attacks ${opponent.getName()}, dealing ${hpDamage} damage to HP and ${armorDamage} to armor. ${opponent.getName()} has ${oppHP} hp ad ${oppArm} armor left`
            this.log(comment, 'console');
        }
        const opponentTeam = this.getInactiveTeam()
        this.checkPlayerStatus(opponent, opponentTeam)
    }
    private randomizer(array: Array<SpecialAbility | Character>) {
        return array[Math.floor(Math.random() * array.length)]
    }
    pickOpponent() {
        const activeTeam = this.getActiveTeam();
        const oppTeam = activeTeam === this.team1 ? this.team2 : this.team1

        const opps = oppTeam.getMembers();
        if(opps.length === 0) return null
        const oppsVulnerability = opps.map(char => {
            return { vulnerability: this.getVulnerability(char), char }
        });
        const target = oppsVulnerability.sort((a, b) => b.vulnerability - a.vulnerability)
        // console.log("heree",opps)
        return target[0].char
    }
    checkPlayerStatus(player: Character, opponentTeam: Team) {
        const playerHP = player.getAttribute('hp')?.getValue();
        if (playerHP === undefined) throw Error("hp attribute not defined");
        if (playerHP <= 0) {
            this.log(`${player.getName()} has been killed`, 'console');
            let foundPlayer = false
            for (let member of opponentTeam.getMembers()) {
                if (member === player) {
                    const newMembers = opponentTeam.getMembers().filter(m => m !== player)
                    // console.log(newMembers)
                    opponentTeam.setMembers(newMembers)
                    foundPlayer = true
                }
            }
            console.log(foundPlayer)
            // if (!foundPlayer) {
            //     for (let member of this.team2.getMembers()) {
            //         if (member === player) {
            //             this.team2.setMembers(this.team2.getMembers().filter(m => m !== player))
            //         }
            //         foundPlayer = true
            //     }
            // }
        }
    }
    checkTeamStatus(team: Team) {
        if (team.getMembers().length === 0) {
            this.log(`${team.getName()} has been defeated`, 'console');
            return true
        }
        return false
    }
    getVulnerability(character: Character) {
        const charHp = character.getAttribute('hp')?.getValue();
        const charArmor = character.getAttribute('armor')?.getValue();

        if (!charArmor || !charHp) throw Error("No hp or armor attribute")
        return -(charHp + (charArmor * 0.5))
    }
    applyStatusEffect(character: Character, effect: string, target: Character) {
        const ability = character.getSpecialAbility(effect)
        let duration = effect === "poison" ? 3 : 1
        const statusEffect = new StatusEffect(effect, ability.getValue(), duration, target);
        statusEffect.activate();
        this.statusEffects.push(statusEffect);
        // this.log(`${character.getName()} has activated ${effect} for ${duration} turns`, 'console');
    }
    processStatusEffects() {
        let expiredEffects = [];
        for (let effect of this.statusEffects) {
            if (effect.getName() === 'poison') continue
            effect.setDuration(effect.getDuration() - 1);
            if (effect.getDuration() <= 0) expiredEffects.push(effect);
        }
        for (let effect of expiredEffects) {
            this.statusEffects = this.statusEffects.filter(e => e !== effect)
            this.log(`${effect.getReceipient()}'s ${effect.getName()} effect has worn off`, 'console');
        }
    }
    private checkActiveEvasionSkill(character: Character) {
        for (let effect of this.statusEffects) {
            if (effect.getName() === 'evasion' && effect.getReceipient() === character) return true
        }
        return false
    }
    private checkActiveStunEffect(character: Character) {
        for (let effect of this.statusEffects) {
            if (effect.getName() === 'stun' && effect.getReceipient() === character) return true
        }
        return false
    }
    private checkAndApplyPoisonEffects() {
        for (let effect of this.statusEffects) {
            if (effect.getName() === 'poison') {
                const receipient = effect.getReceipient()
                const receipientHP = receipient.getAttribute('hp')?.getValue();

                if (!receipientHP) throw new Error('Character has no HP attribute')
                receipient.modifyAttribute("hp", receipientHP - effect.getValue())
                this.log(`${receipient.getName()} -${effect.getValue()} hp`, 'console')
                effect.setDuration(effect.getDuration() - 1);
                if (effect.getDuration() === 0) {
                    this.statusEffects = this.statusEffects.filter(e => e !== effect);
                    this.log(`${receipient.getName()} is no longer poisoned`, 'console')
                }
                else this.log(`${receipient.getName()} is still poisoned for ${effect.getDuration()} turn(s)`, 'console')
            }
        }
    }
    executeTurn() {
        const activeTeam = this.getActiveTeam();
        const opponentTeam = activeTeam === this.team1 ? this.team2 : this.team1

        if (opponentTeam.getMembers().length === 0) {
            this.log(`No opponent left for ${activeTeam}`, 'console')
            return
        }
        let i
        for (i = 0; i < this.movesPerTurn; i++) {
            if (activeTeam.getMembers() && opponentTeam.getMembers()) {
                const player = this.randomizer(activeTeam.getMembers()) as Character
                const playerAction = this.initiatePlayerAction(player)
                if(playerAction === null) break
            }
            else break
        }
        this.nextTurn()
    }

    runBattle(maxTurns: number = 200) {
        this.log("Battle Started", 'console');
        this.log(`${this.team1.getName()} ${this.team1.getTeamRating()} VS ${this.team2.getName()} ${this.team2.getTeamRating()}`)
        this.log(`${this.team1.getName()} members ${this.team1.getMembers().map(m => m.getName())}`)
        this.log(`${this.team2.getName()} members ${this.team2.getMembers().map(m => m.getName())}`)

        let winner: Team
        let team1Ratings: number
        let team2Ratings: number
        while (true) {
            this.executeTurn();
            team1Ratings = this.team1.getTeamRating()
            team2Ratings = this.team2.getTeamRating()

            if (this.checkTeamStatus(this.team1)) {
                winner = this.team2
                break
            }
            else if (this.checkTeamStatus(this.team2)) {
                winner = this.team1
                break
            }

            if (this.turnCount >= maxTurns) {
                this.log('Maximum number of turns reached', 'console')
                winner = team1Ratings > team2Ratings ? this.team1 : this.team2
                break;
            }
        }

        this.log('Battle Simulation Finshed', 'console')
        this.log(`The winner is ${winner.getName()}, team ratings: ${this.team1.getName()}:: ${team1Ratings} \/ ${this.team2.getName()}:: ${team2Ratings}`)
        return winner
    }
}