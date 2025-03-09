import random, time

from teams import Team 
from characters import Character, Attribute
from handlers import SpecialAbilityHandler


class StatusEffect:
    def __init__(self, name:str, value:int, duration:int, effect_receiver:Character):
        self.name = name
        self.value = value
        self.duration = duration
        self.is_active = False
        self.effect_receiver = effect_receiver
        self.special_ability_handler = SpecialAbilityHandler(self)

    def activate(self):
        self.is_active = True

    def deactivate(self):
        self.is_active = False

    def use(self):
        if self.is_active:
            self.duration -= 1
        if self.duration == 0:
            self.deactivate()

class AutoBattleField:
    def __init__(self, team1:Team, team2:Team, moves_per_turn:int=3):
        """This battlefield only allows two players"""
        self.team1 =  team1
        self.team2 = team2 
        self._turn_state_marker = team1
        self.moves_per_turn = moves_per_turn
        self.turn_count = 1
        self.commentary = []
        self.special_ability_handler = SpecialAbilityHandler(self)
        self.status_effects = []

    
    def log(self, message:str, dest:str='console'):
        """Log a message to the commentary"""
        self.commentary.append(message)
        if dest == 'console':
            print(message)


    def get_player(self, team:Team, name:str):
        """Get player by team name and player name"""
        return next((player for player in team.characters if player.name == name))

    def evaluate_turn(self):
        pass

    def next_turn(self):
        """Change the turn state marker"""
        if self._turn_state_marker == self.team1:
            self._turn_state_marker = self.team2
        else:
            self._turn_state_marker = self.team1
        self.turn_count += 1
        self._check_apply_active_poison_effects()
        time.sleep(0.1)
    
    def active_team(self):
        """Get the active team"""
        return self._turn_state_marker
    
    def inactive_team(self):
        """Get the inactive team"""
        return self.team2 if self._turn_state_marker == self.team1.name else self.team1

    def attack(self, attacker:Character, target:Character):
        #calculate the damage
        if self._check_active_stun_effect(attacker):
            self.log(f'{attacker.name} is stunned and cannot attack', dest='console')
            return 0, 0
        damage = attacker.get_attribute('dmg')
        target_hp = target.get_attribute('hp')
        target_armor = target.get_attribute('armor')
        hp_damage, armor_damage = self.calculate_hp_armor_damage(target_armor, damage)

        attacker_speed = self.effective_speed(attacker)
        target_speed = self.effective_speed(target)

        #evasion skill allows target to dodge completely
        if self._check_active_evasion_skill(target):
            hp_dmg, armor_damage = 0, 0
            return hp_dmg, armor_damage
        
        # compensate for player speed
        if target_speed == 0:
                damage_factor = 1
        else:
            damage_factor =  attacker_speed / target_speed
        hp_damage *= damage_factor

        #reduce stamina and speed accordingly for both
        attacker.modify_attribute('stamina', -4)
        target.modify_attribute('stamina', -4)
        target.modify_attribute('hp', -hp_damage)
        target.modify_attribute('armor', -armor_damage)
        return int(hp_damage), int(armor_damage)

    def effective_speed(self, character: Character, max_stamina: int = 1000) -> float:
        base_speed = character.get_attribute('speed')
        stamina = character.get_attribute('stamina')
        return base_speed * (stamina / max_stamina)

    def calculate_hp_armor_damage(self, armor, damage):
        """returns the actual damage and the armor left after the attack"""
        actual_dmg = damage * 100 / (100 + armor)
        armor_dmg = (1 - actual_dmg/damage) * armor *0.3
        return actual_dmg, armor_dmg


    def initiate_player_action(self, player:Character):
        opponent = self.pick_opponent()
        # Player attacks opponent
        # if turn number is a multiple of 3 use special ability instead of a normal attack
        if self.turn_count % 3 == 0:
            ability = random.choice(player.special_abilities)
            self.special_ability_handler.execute(ability, player, opponent)
             
        else:
            dmg, armor =self.attack(player, opponent)
            comment = f'{player.name} attacks {opponent.name}, dealing {dmg} damage, {opponent.name} has {opponent.get_attribute("hp"):.0f} hp  ,{opponent.get_attribute("armor"):.0f} armor left'
            if dmg == 0:
                comment = f'{player.name} attacks {opponent.name}, but {opponent.name} dodges the attack'
            self.log(comment, dest='console')
        self.check_player_status(opponent)


    def pick_opponent(self,):
        """Choose an opponent based on a simple vulnerability score."""
        active_team = self.active_team()
        opponent_team = self.team1 if active_team is self.team2 else self.team2

        # Evaluate each opponent and score them (here, lower HP means more vulnerable)
        def vulnerability(player: Character):
            return -(player.get_attribute('hp') + player.get_attribute('armor') * 0.5)

        # Get the opponents from the team and pick the one with the highest vulnerability score
        opponents = opponent_team.characters
        target = max(opponents, key=vulnerability)
        return target
    
    def check_player_status(self, player:Character):
        """Check if the player is still alive"""
        if player.get_attribute('hp') <= 0:
            self.log(f'{player.name} has been killed', dest='console')
            if player in self.team1.characters:
                self.team1.characters.remove(player)
            elif player in self.team2.characters:
                self.team2.characters.remove(player)

    def check_team_status(self, team:Team):
        """Check if the team has been defeated, returns true if team has been defeated"""
        if len(team.characters) == 0:
            self.log(f'{team.name} has been defeated', dest='console')
            return True
        return False
    
    def apply_status_effect(self, character:Character, effect:str, target:Character):
        """There are certain special abilities that can apply status effects, their effects are felt over a number of turns as specified in the duration attribute"""
        ability = character.get_special_ability(effect)
        status_effect = StatusEffect(effect, ability.value, ability.duration, target)
        status_effect.activate()
        self.status_effects.append(status_effect)
        self.log(f'{character.name} has activated {effect} for {ability.duration} turns', dest='console')

    def process_status_effects(self):
        expired_effects = []
        for effect in self.status_effects:
            if effect.name == 'poison':
                pass
            # Decrease duration
            effect.duration -= 1
            if effect.duration <= 0:
                expired_effects.append(effect)
        for effect in expired_effects:
            self.status_effects.remove(effect)
            self.log(
                f"{effect.effect_receiver.name}'s {effect.name} effect has worn off.", dest='console')

    def _check_active_evasion_skill(self, player:Character):
        """Check if the player has an active evasion skill"""
        for effect in self.status_effects:
            if effect.name == 'evasion' and effect.effect_receiver == player:
                return True
        return False
    
    def _check_active_stun_effect(self, player:Character):
        """Check if the player has an active stun effect"""
        for effect in self.status_effects:
            if effect.name == 'stun' and effect.effect_receiver == player:
                return True
        return False
    
    def _check_apply_active_poison_effects(self):
        """Check for all poisoned players and apply poison effect"""
        for effect in self.status_effects:
            if effect.name == 'poison':
                effect.effect_receiver.modify_attribute('hp', -effect.value)
                effect.duration -= 1
                if effect.duration == 0:
                    self.status_effects.remove(effect)
                    self.log(f'{effect.effect_receiver.name} has been cured of poison', dest='console')
                else:
                    self.log(f'{effect.effect_receiver.name} has been poisoned for {effect.duration} turns', dest='console')
    
    def execute_turn(self):
        """Execute a single turn for the active team with a maximum number of moves"""
        active_team = self.active_team()
        opponent_team = self.team1 if active_team == self.team2 else self.team2

        # If the opponent team is already defeated, return immediately.
        if not opponent_team.characters:
            self.log(
            f"No opponents remain for {active_team.name}.", dest='console')
            return

        for _ in range(self.moves_per_turn):
            # Check both teams before each move
            if active_team.characters and opponent_team.characters:
                player = random.choice(active_team.characters)
                self.initiate_player_action(player)
            else:
                break

        self.next_turn()

    def run_battle(self):
        """Run the battle simulation until one team is defeated."""
        self.log("Battle started!", dest='console')
        self.log(f"{self.team1.name} vs. {self.team2.name}", dest='console')
        self.log(f"Team {self.team1.name} members: {[player.name for player in self.team1.characters]}", dest='console')
        self.log(f"Team {self.team2.name} members: {[player.name for player in self.team2.characters]}", dest='console')
        while True:
            # Execute a turn for the active team
            self.execute_turn()
            # Check if either team is defeated
            if self.check_team_status(self.team1):
                break
            elif self.check_team_status(self.team2):
                break
        self.log("Battle simulation finished.", dest='console')
