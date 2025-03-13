from enum import Enum
import random
from math import floor
from typing import List, Tuple, Set, Optional
from characters import Character


def manhattan_distance(pos1: tuple, pos2: tuple) -> int:
    """Calculate Manhattan distance between two positions."""
    return abs(pos1[0] - pos2[0]) + abs(pos1[1] - pos2[1])

class AIStrategy(Enum):
    RANDOM = "random"
    DEFENSIVE = "defensive"
    AGGRESSIVE = "aggressive"
    TACTICAL = "tactical"


class BattleAI:
    def __init__(self, difficulty: str = "medium"):
        self.difficulty = difficulty.lower()
        # Different strategies per difficulty
        self.strategies = {
            "easy": [AIStrategy.RANDOM, AIStrategy.DEFENSIVE],
            "medium": [AIStrategy.DEFENSIVE, AIStrategy.AGGRESSIVE],
            "hard": [AIStrategy.AGGRESSIVE, AIStrategy.TACTICAL]
        }
        self.current_strategy = self.pick_strategy()
        self.memory = {}  # Remember past actions and their outcomes

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
            'team_formation': None
        }

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

    def _calculate_threat_level(self, character) -> float:
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

        if self.current_strategy == AIStrategy.TACTICAL:
            return self._tactical_move(character, analysis, grid_size)
        elif self.current_strategy == AIStrategy.AGGRESSIVE:
            return self._aggressive_move(character, analysis, grid_size)
        elif self.current_strategy == AIStrategy.DEFENSIVE:
            return self._defensive_move(character, analysis, grid_size)
        else:
            return self._random_move(character, grid_size)
        
    def choose_attack_target(self, character: Character, enemy_characters: List[Character]) -> Optional[Character]:
        """
        Choose an enemy to attack.
        This sample implementation chooses the enemy with the lowest HP.
        """
        if not enemy_characters:
            return None
        return min(enemy_characters, key=lambda enemy: enemy.get_attribute('hp'))

    def _tactical_move(self, character, analysis: dict, grid_size: tuple) -> tuple:
        """Smart positioning considering threats, opportunities, and team formation."""
        current_pos = character.position
        moves = self._get_possible_moves(character, grid_size)

        # Score each possible move
        move_scores = {}
        for move in moves:
            score = 0
            # Avoid danger zones
            if move in analysis['danger_zones']:
                score -= 50

            # Stay near allies but not too close
            for ally in analysis['team_formation']:
                dist = manhattan_distance(move, ally)
                if 2 <= dist <= 4:  # Ideal formation distance
                    score += 20

            # Position for opportunities
            for opportunity_type, target in analysis['opportunities']:
                if manhattan_distance(move, target.position) <= character.get_attribute('range') // 50:
                    score += 30 if opportunity_type == 'finishing_blow' else 15

            move_scores[move] = score

        # Choose the best scoring move
        return max(move_scores.items(), key=lambda x: x[1])[0]

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
        return max(1, character.get_attribute('range') // 50)


    def _get_area_positions(self, center: tuple, radius: int) -> set:
        """Get all grid positions within given radius of center point."""
        positions = set()
        x, y = center
        for dx in range(-radius, radius + 1):
            for dy in range(-radius, radius + 1):
                if abs(dx) + abs(dy) <= radius:  # Manhattan distance check
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


    def _get_possible_moves(self, character, grid_size: tuple) -> set:
        """Get all possible move positions for a character."""
        current_pos = character.position
        move_range = self.get_move_steps(character)
        possible = set()

        for dx in range(-move_range, move_range + 1):
            for dy in range(-move_range, move_range + 1):
                if abs(dx) + abs(dy) <= move_range:
                    new_x = current_pos[0] + dx
                    new_y = current_pos[1] + dy
                    if 0 <= new_x < grid_size[0] and 0 <= new_y < grid_size[1]:
                        possible.add((new_x, new_y))
        return possible


    def _aggressive_move(self, character, analysis: dict, grid_size: tuple) -> tuple:
        """Move aggressively toward nearest enemy or opportunity."""
        moves = self._get_possible_moves(character, grid_size)
        if not moves:
            return character.position

        # Prioritize moves that get us closer to wounded targets
        best_move = character.position
        best_score = float('-inf')

        for move in moves:
            score = 0
            # Score based on proximity to opportunities
            for opp_type, target in analysis['opportunities']:
                dist = manhattan_distance(move, target.position)
                if opp_type == 'finishing_blow':
                    score += 50 - (dist * 5)
                else:
                    score += 30 - (dist * 3)

            if score > best_score:
                best_score = score
                best_move = move

        return best_move


    def _defensive_move(self, character, analysis: dict, grid_size: tuple) -> tuple:
        """Move defensively, avoiding threats and staying near allies."""
        moves = self._get_possible_moves(character, grid_size)
        if not moves:
            return character.position

        best_move = character.position
        best_score = float('-inf')

        for move in moves:
            score = 0
            # Heavily penalize moves into danger zones
            if move in analysis['danger_zones']:
                score -= 100

            # Reward moves that keep us close to allies
            if analysis['team_formation']:
                dist_to_center = manhattan_distance(
                    move, analysis['team_formation']['center'])
                score += 30 - (dist_to_center * 2)

            # Reward moves that keep us away from threats
            for threat, level in analysis['threats']:
                dist = manhattan_distance(move, threat.position)
                score += dist * level * 10

            if score > best_score:
                best_score = score
                best_move = move

        return best_move


    def _random_move(self, character, grid_size: tuple) -> tuple:
        """Make a random valid move."""
        moves = self._get_possible_moves(character, grid_size)
        if not moves:
            return character.position
        return random.choice(list(moves))


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


    def get_move_steps(self, character) -> int:
        """Convert character's speed to movement steps."""
        return max(1, character.get_attribute('speed') // 100)
