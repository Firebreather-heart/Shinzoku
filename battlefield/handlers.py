class SpecialAbilityHandler:
    def __init__(self, battlefield):
        """
        For example, the battlefield parameter is a reference to your AutoBattleField instance.
        This allows the handler to log actions or call other battle-related methods.
        """
        self.battlefield = battlefield

    def execute(self, ability, caster, target=None):
        """
        Executes the given special ability.
        
        :param ability: a SpecialAbility instance (the ability to execute)
        :param caster: the Character using the ability
        :param target: the target Character (if needed)
        """
        if ability.name == "evasion":
            return self._evasion(caster)
        elif ability.name == "critical strike":
            return self._critical_strike(caster, target)
        elif ability.name == "poison":
            return self._poison(caster, target)
        elif ability.name == "stun":
            return self._stun(caster, target)
        elif ability.name == "heal self":
            return self._heal_self(caster)
        elif ability.name == "heal others":
            return self._heal_others(caster, target)
        elif ability.name == "buff":
            return self._buff(caster)
        else:
            raise ValueError(
                f"Special ability '{ability.name}' is not implemented.")

    def _evasion(self, caster):
        # For example, increase a temporary 'evasion' or dodge stat.
        bonus = 20  # Arbitrary bonus value
        # In an extended implementation, you might adjust an "evasion" attribute or add a flag.
        self.battlefield.log(
            f"{caster.name} activates Evasion, temporarily increasing dodge by {bonus}.", dest='console')
        # For now, simply return the bonus so the battle engine may factor it in.
        return bonus

    def _critical_strike(self, caster, target):
        # Double the attack damage, for instance.
        base_damage = caster.get_attribute("dmg")
        multiplier = 2
        extra_damage = base_damage * (multiplier - 1)
        # Apply the extra damage directly to the target.
        target.modify_attribute("hp", -extra_damage)
        self.battlefield.log(
            f"{caster.name} performs Critical Strike on {target.name} for an extra {extra_damage} damage.", dest='console')
        return extra_damage

    def _poison(self, caster, target):
        # Apply a poison status effect for damage over time.
        poison_damage = 10  # damage per turn
        duration = 3  # lasting for 3 turns
        # Assuming your battlefield engine can apply status effects:
        self.battlefield.apply_status_effect(
            target, "poison", poison_damage, duration)
        self.battlefield.log(
            f"{caster.name} poisons {target.name}, causing {poison_damage} damage each turn for {duration} turns.", dest='console')
        return (poison_damage, duration)

    def _stun(self, caster, target):
        # Apply a stun effect that may skip the target's next action.
        duration = 1  # skip the next turn
        self.battlefield.apply_status_effect(target, "stun", None, duration)
        self.battlefield.log(
            f"{caster.name} stuns {target.name}, causing them to miss their next turn.", dest='console')
        return duration

    def _heal_self(self, caster):
        # Heal the caster.
        heal_amount = 50
        caster.modify_attribute("hp", heal_amount)
        self.battlefield.log(
            f"{caster.name} heals self for {heal_amount} HP.", dest='console')
        return heal_amount

    def _heal_others(self, caster, target):
        # Heal another character.
        heal_amount = 50
        target.modify_attribute("hp", heal_amount)
        self.battlefield.log(
            f"{caster.name} heals {target.name} for {heal_amount} HP.", dest='console')
        return heal_amount

    def _buff(self, caster):
        # Increase an attribute temporarily. For example, a damage buff.
        buff_amount = 20
        caster.modify_attribute("dmg", buff_amount)
        self.battlefield.log(
            f"{caster.name} buffs their attack by {buff_amount}.", dest='console')
        return buff_amount
