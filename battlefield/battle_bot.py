from enum import Enum
import random
from math import floor
from typing import List, Tuple, Set, Optional
from characters import Character, Position


def manhattan_distance(pos1: tuple, pos2: tuple) -> int:
    """Calculate Manhattan distance between two positions."""
    return abs(pos1[0] - pos2[0]) + abs(pos1[1] - pos2[1])

class AIStrategy(Enum):
    RANDOM = "random"
    DEFENSIVE = "defensive"
    AGGRESSIVE = "aggressive"
    TACTICAL = "tactical"


class BattleAI:
    def __init__(self, difficulty: str = "hard"):
        self.difficulty = difficulty.lower()
        # Different strategies per difficulty
        self.strategies = {
            "easy": [AIStrategy.RANDOM, AIStrategy.DEFENSIVE],
            "medium": [AIStrategy.DEFENSIVE, AIStrategy.AGGRESSIVE],
            "hard": [AIStrategy.AGGRESSIVE, AIStrategy.TACTICAL]
        }
        self.current_strategy = self.pick_strategy()
        self.memory = {}  # Remember past actions and their outcomes
        self.allies = []
        self.enemies = []

    def pick_strategy(self) -> AIStrategy:
        """Picks a strategy based on difficulty."""
        return random.choice(self.strategies.get(self.difficulty, [AIStrategy.RANDOM]))

    def analyze_battlefield(self, character, allies: list, enemies: list, grid_size: tuple) -> dict:
        """Analyzes battlefield state and returns tactical information."""
        analysis = {
            'threats': [],
            'opportunities': [],
            'safe_spots': set(),
            'danger_zones': set(),
            'team_formation': None,
            'enemies': [enemies],
            'allies': [allies]
        }
        self.allies = allies 
        self.enemies = enemies
        # Identify immediate threats
        for enemy in enemies:
            threat_level = self._calculate_threat_level(enemy)
            if threat_level > 0.7:  # High threat
                analysis['threats'].append((enemy, threat_level))
                # Mark danger zones around high-threat enemies
                attack_range = self._get_attack_range(enemy)
                analysis['danger_zones'].update(
                    self._get_area_positions(enemy.position, attack_range))

        # Find tactical opportunities
        for enemy in enemies:
            if enemy.get_attribute('hp') < character.get_attribute('dmg') * 2:
                analysis['opportunities'].append(('finishing_blow', enemy))
            elif enemy.get_attribute('hp') < enemy.get_attribute('hp') * 0.3:
                analysis['opportunities'].append(('wounded_target', enemy))

        # Analyze team formation
        ally_positions = [ally.position for ally in allies]
        analysis['team_formation'] = self._analyze_formation(ally_positions)

        return analysis

    def _calculate_threat_level(self, character:Character) -> float:
        """Calculate how dangerous a character is based on their attributes."""
        hp_ratio = character.get_attribute('hp') / 1000  # Normalize HP
        damage_ratio = character.get_attribute('dmg') / 300  # Normalize damage
        speed_ratio = character.get_attribute('speed') / 500  # Normalize speed

        # Weight the factors based on importance
        return (0.3 * hp_ratio + 0.4 * damage_ratio + 0.3 * speed_ratio)

    def choose_move(self, character, allies: list, enemies: list, grid_size: tuple) -> tuple:
        """Choose next move based on current strategy and battlefield analysis."""
        analysis = self.analyze_battlefield(
            character, allies, enemies, grid_size)
        print(analysis)
        enemy = self.choose_attack_target(character, enemies)
        if enemy is not None:
            return self._approach_and_optimize_move(character, enemy, grid_size), enemy
        else:
            # Fallback: stay in the current position if no enemy is found
            return (character.position.x, character.position.y), enemy

    def choose_action(self, character, allies: list, enemies: list) -> tuple:
        """Decide what action to take (attack, heal, buff, etc.)."""
        if self.difficulty == "hard":
            # Consider multiple factors before deciding
            if character.get_attribute('hp') < character.get_attribute('hp') * 0.3:
                # Try to heal if critically wounded
                heal_ability = self._find_healing_ability(character)
                if heal_ability:
                    return ('heal', heal_ability, character)

            # Check if any ally needs immediate healing
            wounded_ally = self._find_critical_ally(allies)
            if wounded_ally and self._can_heal_others(character):
                return ('heal', self._find_healing_ability(character), wounded_ally)

            # Look for high-value targets
            priority_target = self._identify_priority_target(enemies)
            if priority_target:
                return ('attack', None, priority_target)

        # Default to basic attack on best target
        target = self._select_best_target(character, enemies)
        return ('attack', None, target) if target else ('wait', None, None)

    def _identify_priority_target(self, enemies: list) -> Optional[object]:
        """Identify high-priority targets based on multiple factors."""
        if not enemies:
            return None

        target_scores = {}
        for enemy in enemies:
            score = 0
            # Prioritize low HP targets
            hp_percentage = enemy.get_attribute(
                'hp') / enemy.get_attribute('hp')
            score += (1 - hp_percentage) * 50

            # Prioritize high-damage dealers
            score += min(50, enemy.get_attribute('dmg') / 4)

            # Prioritize healers or support characters
            if self._is_support_character(enemy):
                score += 30

            target_scores[enemy] = score

        return max(target_scores.items(), key=lambda x: x[1])[0]

    def _is_support_character(self, character) -> bool:
        """Identify if a character is a support/healer type."""
        healing_abilities = [ability for ability in character.special_abilities
                             if ability.name in ['heal self', 'heal others']]
        return len(healing_abilities) > 0

    def update_strategy(self, battlefield_state: dict):
        """Update AI strategy based on battle conditions."""
        if self.difficulty == "hard":
            # Switch strategies based on conditions
            team_hp_ratio = battlefield_state.get('team_hp_ratio', 1.0)
            enemy_hp_ratio = battlefield_state.get('enemy_hp_ratio', 1.0)

            if team_hp_ratio < 0.3:  # Critical condition
                self.current_strategy = AIStrategy.DEFENSIVE
            elif enemy_hp_ratio < 0.3:  # Enemy nearly defeated
                self.current_strategy = AIStrategy.AGGRESSIVE
            elif team_hp_ratio > 0.7:  # Good condition
                self.current_strategy = AIStrategy.TACTICAL

    def _get_attack_range(self, character) -> int:
        """Convert character's range attribute to grid distance."""
        return character.get_attribute('range')


    def _get_area_positions(self, center: tuple, radius: int) -> set:
        """Get all grid positions within given Chebyshev distance (radius) of center point."""
        positions = set()
        x, y = center
        for dx in range(-radius, radius + 1):
            for dy in range(-radius, radius + 1):
                if max(abs(dx), abs(dy)) <= radius:
                    positions.add((x + dx, y + dy))
        return positions


    def _analyze_formation(self, positions: list) -> dict:
        """Analyze current team formation and suggest improvements."""
        if not positions:
            return None #type:ignore

        formation = {
            'center': self._get_formation_center(positions),
            'spread': self._get_formation_spread(positions),
            'type': self._determine_formation_type(positions)
        }
        return formation


    def _get_formation_center(self, positions: list) -> tuple:
        """Calculate the center point of the formation."""
        if not positions:
            return (0, 0)
        x_avg = sum(p[0] for p in positions) / len(positions)
        y_avg = sum(p[1] for p in positions) / len(positions)
        return (int(x_avg), int(y_avg))


    def _get_formation_spread(self, positions: list) -> float:
        """Calculate how spread out the formation is."""
        if not positions:
            return 0
        center = self._get_formation_center(positions)
        distances = [manhattan_distance(pos, center) for pos in positions]
        return sum(distances) / len(distances)


    def _determine_formation_type(self, positions: list) -> str:
        """Determine the current formation type."""
        if len(positions) <= 1:
            return "solo"

        spread = self._get_formation_spread(positions)
        if spread < 2:
            return "clustered"
        elif spread < 4:
            return "balanced"
        else:
            return "scattered"


    def _get_possible_moves(self, character:Character, grid_size: tuple) -> set:
        """Get all possible move positions for a character."""
        current_pos = character.position.x, character.position.y
        move_range = character.get_attribute('range')
        possible = set()
        occupied = [(i.position.x, i.position.y)
                    for i in self.enemies] + [(i.position.x, i.position.y) for i in self.allies]

        for dx in range(-move_range, move_range + 1):
            for dy in range(-move_range, move_range + 1):
                new_x = current_pos[0] + dx
                new_y = current_pos[1] + dy
                if 0 <= new_x < grid_size[0] and 0 <= new_y < grid_size[1]:
                    possible.add((new_x, new_y))

        #remove the current position from the list of possible moves
        if current_pos in possible:
            possible.remove(current_pos)
        possible = {pos for pos in possible if pos not in occupied}
        return possible

    def move_towards(self, current: Tuple[int, int], target: Tuple[int, int]) -> Tuple[int, int]:
        """
        Returns a new position that is one step from 'current' toward 'target'
        along each axis.
        """
        cur_x, cur_y = current
        tar_x, tar_y = target

        # Step in x-direction
        if tar_x > cur_x:
            step_x = 1
        elif tar_x < cur_x:
            step_x = -1
        else:
            step_x = 0

        # Step in y-direction
        if tar_y > cur_y:
            step_y = 1
        elif tar_y < cur_y:
            step_y = -1
        else:
            step_y = 0

        return (cur_x + step_x, cur_y + step_y)
    
    def _approach_and_optimize_move(self, character: Character, enemy:Character, 
                                      grid_size: tuple) -> Tuple[int, int]:
        """
        Always try to close the distance toward the nearest enemy.
        If the enemy is far (more than attack_range + buffer), move directly toward it.
        Otherwise, when just outside of range, choose an optimized move based on difficulty.
        """
        current_pos = (character.position.x, character.position.y)
        attack_range = self._get_attack_range(character) 
        buffer = 1  


        # Find the nearest enemy by Manhattan distance
        enemy_pos = (enemy.position.x, enemy.position.y)
        current_distance = manhattan_distance(current_pos, enemy_pos)

        # If enemy is far, take maximum steps toward enemy
        if current_distance > attack_range + buffer:
            new_pos = current_pos
            for _ in range(character.range): #type:ignore
                new_pos = self.move_towards(new_pos, enemy_pos)
            # Ensure new position stays within grid boundaries
            new_x = max(0, min(new_pos[0], grid_size[0] - 1))
            new_y = max(0, min(new_pos[1], grid_size[1] - 1))
            return (new_x, new_y)
        else:
            # Enemy is close but just outside range; choose from moves that put you as near as possible.
            moves = self._get_possible_moves(character, grid_size)
            # Filter moves that are within attack_range + buffer of enemy
            valid_moves = [move for move in moves if manhattan_distance(
                move, enemy_pos) <= attack_range + buffer]
            if valid_moves:
                # For "easy" and "medium", simply choose the move that minimizes distance.
                # For "hard" you could extend this to consider threats/formation; here we choose minimum distance.
                return min(valid_moves, key=lambda move: manhattan_distance(move, enemy_pos))
            # Fallback: if no filtered move found, return a move that minimizes distance among all moves.
            return min(moves, key=lambda move: manhattan_distance(move, enemy_pos))

    def _find_healing_ability(self, character) -> Optional[object]:
            """Find a healing ability if the character has one."""
            for ability in character.special_abilities:
                if ability.name in ['heal self', 'heal others']:
                    return ability
            return None


    def _find_critical_ally(self, allies: list) -> Optional[object]:
        """Find an ally that needs immediate healing."""
        for ally in allies:
            hp_ratio = ally.get_attribute('hp') / ally.get_attribute('hp')
            if hp_ratio < 0.3:
                return ally
        return None


    def _can_heal_others(self, character) -> bool:
        """Check if character has ability to heal others."""
        return any(ability.name == 'heal others' for ability in character.special_abilities)


    def _select_best_target(self, character, enemies: list) -> Optional[object]:
        """Select best target for basic attack."""
        if not enemies:
            return None

        attack_range = self._get_attack_range(character)
        in_range_enemies = [
            enemy for enemy in enemies
            if manhattan_distance(character.position, enemy.position) <= attack_range
        ]

        if not in_range_enemies:
            return None

        # In easy mode, choose random target
        if self.difficulty == "easy":
            return random.choice(in_range_enemies)

        # Otherwise use priority targeting
        return self._identify_priority_target(in_range_enemies)

    
    def choose_attack_target(self, character: Character, enemy_characters: List[Character]) -> Optional[Character]:
        """
        Choose an enemy target that factors both difficulty criteria and proximity.
        For all difficulties, a candidate's score is affected by its distance.
        - Easy: candidates are chosen randomly with a bias favoring closer enemies.
        - Medium: choose the enemy with the lowest (HP + distance_weight * distance).
        - Hard: choose the enemy with the highest (threat / (distance + 1)).
        """
        valid_targets = [
            enemy for enemy in enemy_characters if enemy.get_attribute('hp') > 0]
        if not valid_targets:
            return None

        att_pos = (character.position.x, character.position.y)

        if self.difficulty == "easy":
            # Weight each enemy by the inverse of its distance (closer enemies are more likely)
            total_weight = sum(1 / (manhattan_distance(att_pos, (enemy.position.x, enemy.position.y)) + 1)
                            for enemy in valid_targets)
            r = random.uniform(0, total_weight)
            cumulative = 0
            for enemy in valid_targets:
                weight = 1 / (manhattan_distance(att_pos,
                            (enemy.position.x, enemy.position.y)) + 1)
                cumulative += weight
                if cumulative >= r:
                    return enemy
            return random.choice(valid_targets)

        elif self.difficulty == "medium":
            # Define a score where lower HP and closer distance yield a lower score.
            distance_weight = 5  # tweak this multiplier to adjust the importance of distance

            def score_(enemy):
                hp = enemy.get_attribute('hp')
                distance = manhattan_distance(
                    att_pos, (enemy.position.x, enemy.position.y))
                return hp + distance_weight * distance
            return min(valid_targets, key=score_)

        elif self.difficulty == "hard":
            # Calculate a ratio: high threat level and low distance are preferred.
            def score(enemy):
                threat = self._calculate_threat_level(enemy)
                distance = manhattan_distance(
                    att_pos, (enemy.position.x, enemy.position.y))
                return threat / (distance + 1)  # add 1 to avoid division by zero
            return max(valid_targets, key=score)

        else:
            return random.choice(valid_targets)
