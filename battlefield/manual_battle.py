import random
from typing import List, Tuple, Optional
from characters import Character, Position
from teams import Team
from handlers import SpecialAbilityHandler
from battle_bot import BattleAI
from engine import AutoBattleField


class ManualBattleField(AutoBattleField):
    def __init__(self, human_team: Team, ai_team: Team, grid_size: Tuple[int, int] = (20, 10)):
        super().__init__(human_team, ai_team, 3)
        self.human_team = human_team
        self.ai_team = ai_team
        self.width, self.height = grid_size
        self.turn_count = 1
        # We'll consider human_team always plays first.
        self.current_active_team = human_team
        if human_team.control == 'ai':
            self.human_team_controller = BattleAI(difficulty="easy")
        self.commentary: List[str] = []
        # self.special_ability_handler = SpecialAbilityHandler(self)
        # Create an AI instance to control the AI team.
        self.ai_controller = BattleAI(difficulty="easy")
        self._initialize_positions()

    def _initialize_positions(self) -> None:
        """Place teams on opposite sides of the grid and assign controllers."""
        # Assign positions and controllers for human team
        for character in self.human_team.characters:
            character.position = Position()
            character.controller = "human" if self.human_team.control == "human" else "ai"
        # Assign positions and controllers for AI team
        for character in self.ai_team.characters:
            character.position = Position()
            character.controller = "ai"
        # Place human team on the left side
        for i, character in enumerate(self.human_team.characters):
            y = (i + 1) * (self.height // (len(self.human_team.characters) + 1))
            character.position = Position(1, y)
        # Place AI team on the right side
        for i, character in enumerate(self.ai_team.characters):
            y = (i + 1) * (self.height // (len(self.ai_team.characters) + 1))
            character.position = Position(self.width - 2, y)

    def display_grid(self) -> None:
        """Display the current state of the battlefield."""
        grid = [['.'] * self.width for _ in range(self.height)]
        # Mark human team positions
        for character in self.human_team.characters:
            if character.position and character.position.x is not None and character.position.y is not None:
                x, y = int(character.position.x), int(character.position.y)
                grid[y][x] = 'H'  # H for human
        # Mark AI team positions
        for character in self.ai_team.characters:
            if character.position and character.position.x is not None and character.position.y is not None:
                x, y = int(character.position.x), int(character.position.y)
                grid[y][x] = 'A'  # A for AI
        print("\n" + "=" * (self.width * 2))
        for row in grid:
            print(" ".join(row))
        print("=" * (self.width * 2) + "\n")

    def manhattan_distance(self, pos1: Position, pos2: Position) -> int:
        """The actual implementation is a chebysev distance"""
        return max(abs(pos1.x - pos2.x), abs(pos1.y - pos2.y))

    def is_valid_move(self, character: Character, new_pos: Position) -> bool:
        if not (0 <= new_pos.x < self.width and 0 <= new_pos.y < self.height):
            return False
        for team in [self.human_team, self.ai_team]:
            for other in team.characters:
                if other != character and other.position == new_pos:
                    return False
        move_distance = self.manhattan_distance(character.position, new_pos)
        return move_distance <= character.range #type:ignore

    def get_valid_moves(self, character: Character) -> List[Position]:
        valid_moves = []
        max_move = character.get_attribute('speed') // 100
        for dx in range(-max_move, max_move + 1):
            for dy in range(-max_move, max_move + 1):
                if abs(dx) + abs(dy) <= max_move:
                    new_x = character.position.x + dx  # type: ignore
                    new_y = character.position.y + dy  # type: ignore
                    new_pos = Position(new_x, new_y)
                    if self.is_valid_move(character, new_pos):
                        valid_moves.append(new_pos)
        return valid_moves

    def is_in_range(self, attacker: Character, target: Character) -> bool:
        distance = self.manhattan_distance(attacker.position, target.position)
        attack_range = attacker.get_attribute(
            'range')   # grid range conversion
        return distance <= attack_range

    def human_turn(self, character: Character) -> None:
        """Execute a human player's turn for a given character."""
        pass

    def _human_attack(self, character: Character) -> None:
        valid_targets = []
        enemy_team = self.ai_team
        for target in enemy_team.characters:
            if self.is_in_range(character, target):
                valid_targets.append(target)
        if not valid_targets:
            self.log("No enemy targets in range!")
            return
        print("\nValid targets:")
        for i, target in enumerate(valid_targets):
            print(f"{i}: {target.name} at {target.position}")
        target_choice = input("Choose target number: ")
        try:
            target = valid_targets[int(target_choice)]
            self._execute_attack(character, target)
        except (ValueError, IndexError):
            self.log("Invalid target, skipping attack.")

    def _execute_attack(self, player: Character, opponent: Character):
        dmg, armor = self.attack(player, opponent)
        comment = f'{player.name} attacks {opponent.name}, dealing {dmg} damage, {opponent.name} has {opponent.get_attribute("hp"):.0f} hp  ,{opponent.get_attribute("armor"):.0f} armor left'
        if dmg == 0:
            comment = f'{player.name} attacks {opponent.name}, but {opponent.name} dodges the attack'
        self.log(comment, dest='console')
        self.check_player_status(opponent)

    def _execute_special_attack(self, character, target):
        abilities = character.special_abilities
        if len(abilities) == 0:
            pass 
        else:
            ability = random.choice(character.special_abilities)
            self.special_ability_handler.execute(ability, character, target)
        self.check_player_status(target)

    def ai_turn(self, character: Character) -> None:
        """Execute an AI-controlled turn using the BattleAI module."""
        self.log(f"\n{character.name}'s turn (AI):")
        # Determine proper ally and enemy teams based on character membership.
        if character in self.human_team.characters:
            ally_team = self.human_team
            enemy_team = self.ai_team
        else:
            ally_team = self.ai_team
            enemy_team = self.human_team

        # Determine new position using the AI.
        new_pos, target = self.ai_controller.choose_move(
            character,
            ally_team.characters,
            enemy_team.characters,
            (self.width, self.height)
        )

        self.log(f"checking to move player to {new_pos}")
        if new_pos and self.is_valid_move(character, Position(*new_pos)):
            # new_pos is assumed to be a tuple (x, y)
            character.position = Position(new_pos[0], new_pos[1])
            self.log(f"AI {character.name} moves to {character.position}")

        # Choose an attack target from the enemy team.
        # target = self.ai_controller.choose_attack_target(
        #     character, enemy_team.characters)
        if target:
            self.log(f'Targeting {target}')
            if self.is_in_range(character, target):
                if self.turn_count % 3 == 0:
                    self._execute_special_attack(character, target)
                else:
                    self._execute_attack(character, target)
            else:
                self.log(f"{character.name} target {target.name} is out of range!")
        else:
            self.log(f"{character.name} takes no action.")

    def agent_turn(self, character: Character) -> None:
        """
        Execute the turn for any agent, based on its controller.
        The controller is set by the battlefield (_initialize_positions).
        """
        if character.controller == "human":
            self.human_turn(character)
        elif character.controller == "ai":
            self.ai_turn(character)
        else:
            self.log(
                f"{character.name} has an unrecognized controller ({character.controller}), skipping turn.")

    def next_turn(self) -> None:
        """
        Execute a single turn for all characters,
        with each turn driven by its assigned controller.
        """
        for team in [self.human_team, self.ai_team]:
            for character in team.characters:
                if character.get_attribute('hp') > 0:
                    self.agent_turn(character)
        self.turn_count += 1
        self.log(f"Turn {self.turn_count} completed.")
