from typing import List, Tuple, Optional
from characters import Character, Position
from teams import Team
from handlers import SpecialAbilityHandler
from battle_bot import BattleAI

class ManualBattleField:
    def __init__(self, human_team: Team, ai_team: Team, grid_size: Tuple[int, int] = (20, 10)):
        self.human_team = human_team
        self.ai_team = ai_team
        self.width, self.height = grid_size
        self.turn_count = 1
        # We'll consider human_team always plays first.
        self.active_team = human_team
        self.commentary: List[str] = []
        self.special_ability_handler = SpecialAbilityHandler(self)
        # Create an AI instance to control the AI team.
        self.ai_controller = BattleAI(difficulty="hard")
        self._initialize_positions()

    def _initialize_positions(self) -> None:
        """Place teams on opposite sides of the grid."""
        # Initialize positions for all characters
        for character in self.human_team.characters:
            character.position = Position()
        for character in self.ai_team.characters:
            character.position = Position()
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

    def log(self, message: str) -> None:
        self.commentary.append(message)
        print(message)

    def manhattan_distance(self, pos1: Position, pos2: Position) -> int:
        return abs(pos1.x - pos2.x) + abs(pos1.y - pos2.y)

    def is_valid_move(self, character: Character, new_pos: Position) -> bool:
        if not (0 <= new_pos.x < self.width and 0 <= new_pos.y < self.height):
            return False
        for team in [self.human_team, self.ai_team]:
            for other in team.characters:
                if other != character and other.position == new_pos:
                    return False
        move_distance = self.manhattan_distance(character.position, new_pos)
        max_move = character.get_attribute('speed') // 100  # grid moves available
        return move_distance <= max_move

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
        attack_range = attacker.get_attribute('range') // 50  # grid range conversion
        return distance <= attack_range

    def human_turn(self, character: Character) -> None:
        """Execute a human player's turn for a given character."""
        self.display_grid()
        print(f"\n{character.name}'s turn (Human):")
        print(f"Current position: {character.position}")
        # Movement phase
        valid_moves = self.get_valid_moves(character)
        print("\nValid moves:")
        for i, move in enumerate(valid_moves):
            print(f"{i}: {move}")
        move_choice = input("Enter move number (or 's' to skip movement): ")
        if move_choice.lower() != 's':
            try:
                new_pos = valid_moves[int(move_choice)]
                character.position = new_pos
                self.log(f"{character.name} moves to {new_pos}")
            except (ValueError, IndexError):
                self.log("Invalid move choice - skipping movement.")
        # Action phase
        print("\nAction options:")
        print("1: Attack")
        print("2: Use special ability")
        print("3: Skip action")
        action = input("Choose action: ")
        if action == "1":
            self._human_attack(character)
        elif action == "2":
            self._handle_special_ability(character)
        else:
            self.log(f"{character.name} skips action.")

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

    def _execute_attack(self, attacker: Character, target: Character) -> None:
        damage = attacker.get_attribute('dmg')
        armor = target.get_attribute('armor')
        actual_damage = max(1, int(damage * 100 / (100 + armor)))
        target.modify_attribute('hp', -actual_damage)
        self.log(f"{attacker.name} attacks {target.name} for {actual_damage} damage!")
        if target.get_attribute('hp') <= 0:
            self.log(f"{target.name} has been defeated!")
            if target in self.ai_team.characters:
                self.ai_team.characters.remove(target)
            elif target in self.human_team.characters:
                self.human_team.characters.remove(target)

    def _handle_special_ability(self, character: Character) -> None:
        """Handle special ability usage for human-controlled characters."""
        if not character.special_abilities:
            self.log("No special abilities available!")
            return
        print("\nAvailable abilities:")
        for i, ability in enumerate(character.special_abilities):
            print(f"{i}: {ability.jutsu_name} (MP cost: {ability.mp_cost})")
        choice = input("Choose ability number (or 'c' to cancel): ")
        if choice.lower() == 'c':
            return
        try:
            ability = character.special_abilities[int(choice)]
            # For self-targeting abilities
            if ability.name in ['heal self', 'buff']:
                self.special_ability_handler.execute(ability, character, character)
            else:
                # Show valid targets from the AI team
                valid_targets = [target for target in self.ai_team.characters if self.is_in_range(character, target)]
                if not valid_targets:
                    self.log("No valid targets in range!")
                    return
                print("\nValid targets:")
                for i, target in enumerate(valid_targets):
                    print(f"{i}: {target.name} at {target.position}")
                target_choice = input("Choose target number: ")
                target = valid_targets[int(target_choice)]
                self.special_ability_handler.execute(ability, character, target)
        except (ValueError, IndexError):
            self.log("Invalid ability choice.")

    def ai_turn(self, character: Character) -> None:
        """Execute an AI-controlled turn using the BattleAI module."""
        self.log(f"\n{character.name}'s turn (AI):")
        # Determine new position using the AI
        enemy_positions = [c.position for c in self.human_team.characters if c.position]
        allies_positions = [c.position for c in self.ai_team.characters if c.position]
        new_pos = self.ai_controller.choose_move(character,allies_positions,  enemy_positions, (self.width, self.height))
        if new_pos and self.is_valid_move(character, Position(*new_pos)):
            character.position = Position(new_pos[0], new_pos[1])  # new_pos is assumed to be a tuple (x,y)
            self.log(f"AI {character.name} moves to {character.position}")
        # Determine action using the AI: choose_attack_target returns an enemy Character or None
        target = self.ai_controller.choose_attack_target(character, self.human_team.characters)
        if target:
            self._execute_attack(character, target)
        else:
            self.log(f"{character.name} takes no action.")

    def next_turn(self) -> None:
        """
        Execute a single turn for both teams:
         - Human-controlled characters get manual input.
         - AI-controlled characters use the AI module.
        Does not loop the entire battle.
        """
        # Process turns for human team
        for character in self.human_team.characters:
            if character.get_attribute('hp') > 0:
                self.human_turn(character)
        # Process turns for AI team
        for character in self.ai_team.characters:
            if character.get_attribute('hp') > 0:
                self.ai_turn(character)
        self.turn_count += 1
        self.log(f"Turn {self.turn_count} completed.")
