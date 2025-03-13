from characters import Character

class SpecialAbilityHandler:
    def __init__(self, battlefield):
        self.battlefield = battlefield

    def execute(self, ability, caster:Character, target:Character):
        # Check MP before executing the ability.
        if caster.get_attribute("mp") < ability.mp_cost:
            self.battlefield.log(
                f"{caster.name} is out of chakra cannot activate {ability.name}.", dest="console")
            return None

        caster.modify_attribute("mp", -ability.mp_cost)
        target_name = target.name if target else "self"

        if ability.name == "evasion":
            return self._evasion(caster, ability.jutsu_name)
        elif ability.name == "critical strike":
            return self._critical_strike(caster, target, ability.jutsu_name)
        elif ability.name == "poison":
            return self._poison(caster, target, ability.jutsu_name)
        elif ability.name == "stun":
            return self._stun(caster, target, ability.jutsu_name)
        elif ability.name == "heal self":
            return self._heal_self(caster, ability.jutsu_name)
        elif ability.name == "heal others":
            return self._heal_others(caster, target, ability.jutsu_name)
        elif ability.name == "buff":
            return self._buff(caster, ability.jutsu_name)
        else:
            raise ValueError(
                f"Special ability '{ability.name}' is not implemented.")

    def _evasion(self, caster, jutsu_name):
        duration = 1  # active until the next attack
        self.battlefield.apply_status_effect(
            caster, "evasion", caster)
        self.battlefield.log(
            f"{caster.name} activates {jutsu_name} for {duration} turn(s), ", dest="console")
        return {"effect": "evasion",  "duration": duration}

    def _critical_strike(self, caster, target, jutsu_name):
        base_damage = caster.get_attribute("dmg")
        multiplier = caster.get_special_ability("critical strike").value
        extra_damage = base_damage * multiplier
        target.modify_attribute("hp", -extra_damage)
        self.battlefield.log(
            f"{caster.name} uses {jutsu_name} on {target.name} dealing an extra {extra_damage} damage.", dest="console")
        return {"effect": "critical strike", "extra_damage": extra_damage}

    def _poison(self, caster, target, jutsu_name):
        poison_damage = 10
        duration = 3
        self.battlefield.apply_status_effect(
            caster, "poison", target)
        self.battlefield.log(
            f"{caster.name} uses {jutsu_name} on {target.name} for {duration} turns (damage: {poison_damage}/turn).", dest="console")
        return {"effect": "poison", "damage": poison_damage, "duration": duration}

    def _stun(self, caster, target, jutsu_name):
        duration = 1
        self.battlefield.apply_status_effect(caster, "stun", target)
        self.battlefield.log(
            f"{caster.name} uses {jutsu_name} {target.name}, causing them to miss their next turn.", dest="console")
        return {"effect": "stun", "duration": duration}

    def _heal_self(self, caster, jutsu_name):
        heal_amount = caster.get_special_ability("heal self").value
        caster.modify_attribute("hp", heal_amount)
        self.battlefield.log(
            f"{caster.name} uses {jutsu_name} on self for {heal_amount} HP.", dest="console")
        return {"effect": "heal self", "heal_amount": heal_amount}

    def _heal_others(self, caster, target, jutsu_name):
        heal_amount = caster.get_special_ability("heal others").value
        caster_team = self.battlefield.get_team_by_player(caster)
        target = min(caster_team, key=lambda x:x.get_attribute("hp"))
        target.modify_attribute("hp", heal_amount)
        self.battlefield.log(
            f"{caster.name} uses {jutsu_name} on {target.name} for {heal_amount} HP.", dest="console")
        return {"effect": "heal others", "heal_amount": heal_amount}

    def _buff(self, caster, jutsu_name):
        buff_amount = caster.get_special_ability("buff").value
        caster.modify_attribute("armor", buff_amount)
        self.battlefield.log(
            f"{caster.name} uses {jutsu_name} to buff their armor by {buff_amount}.", dest="console")
        return {"effect": "buff", "buff_amount": buff_amount}
