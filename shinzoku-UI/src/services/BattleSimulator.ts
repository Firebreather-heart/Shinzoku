import { v4 as uuidv4 } from 'uuid';

interface Position {
  x: number;
  y: number;
}

export type EntityType = 'character' | 'demon' | 'boss';

export enum AIStrategy {
  RANDOM = 'random',
  DEFENSIVE = 'defensive',
  AGGRESSIVE = 'aggressive',
  TACTICAL = 'tactical'
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface StatusEffect {
  name: 'poison' | 'stun' | 'evasion' | 'buff';
  source: string;
  target: string;
  duration: number;
  value: number;
}

export interface SpecialAbility {
  name: string;
  damage: number;
  mpCost: number;
  cooldown: number;
  currentCooldown: number;
  jutsuName?: string;  // Name of the special ability (e.g., "Flying thunder god")
  isStatusEffect?: boolean;
  statusEffectType?: 'poison' | 'stun' | 'evasion' | 'buff' | 'heal';
  statusEffectDuration?: number;
  statusEffectValue?: number;
}

export interface BattleEntity {
  id: string;
  name: string;
  type: EntityType;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  range: number;
  position: Position;
  isDead: boolean;
  specialAbilities?: SpecialAbility[];
}

export type ActionType = 'move' | 'attack' | 'special' | 'status';

export interface BattleActionLog {
  turn: number;
  entityId: string;
  actionType: ActionType;
  targetId?: string;
  message: string;
}

export interface BattleResult {
  playerVictory: boolean;
  turns: number;
  survivingPlayerEntities: BattleEntity[];
  survivingEnemyEntities: BattleEntity[];
  logs: BattleActionLog[];
}

export interface BattleState {
  turn: number;
  playerTeam: BattleEntity[];
  enemyTeam: BattleEntity[];
  actionLogs: BattleActionLog[];
  isCompleted: boolean;
  result: BattleResult | null;
  gridSize: { width: number; height: number };
  statusEffects: StatusEffect[];
}

// Formation analysis 
interface FormationAnalysis {
  center: Position;
  spread: number;
  type: 'solo' | 'clustered' | 'balanced' | 'scattered';
}

interface BattlefieldAnalysis {
  threats: Array<[BattleEntity, number]>; // Entity and threat level
  opportunities: Array<[string, BattleEntity]>; // Type and entity
  safeSpots: Set<string>; // Serialized positions "x,y"
  dangerZones: Set<string>; // Serialized positions "x,y"
  teamFormation: FormationAnalysis | null;
}

// Helper functions
const calculateDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y); // Manhattan distance
};

const serializePosition = (pos: Position): string => {
  return `${pos.x},${pos.y}`;
};

const deserializePosition = (posStr: string): Position => {
  const [x, y] = posStr.split(',').map(Number);
  return { x, y };
};

/**
 * Calculate threat level of an entity similar to Python implementation
 */
const calculateThreatLevel = (entity: BattleEntity): number => {
  const hpRatio = entity.hp / 1000;  // Normalize HP
  const damageRatio = entity.attack / 300;  // Normalize damage
  const speedRatio = entity.speed / 500;  // Normalize speed

  // Weight the factors based on importance
  return (0.3 * hpRatio + 0.4 * damageRatio + 0.3 * speedRatio);
};

/**
 * Find optimal target based on difficulty and strategy
 */
const findOptimalTarget = (
  entity: BattleEntity,
  enemyTeam: BattleEntity[],
  difficulty: DifficultyLevel,
  currentStrategy: AIStrategy
): BattleEntity | null => {
  const livingEnemies = enemyTeam.filter(enemy => !enemy.isDead);
  if (livingEnemies.length === 0) return null;

  // Get enemies in range
  const inRangeEnemies = livingEnemies.filter(
    enemy => calculateDistance(entity.position, enemy.position) <= entity.range
  );

  // If no enemies in range, target closest enemy for movement
  if (inRangeEnemies.length === 0) {
    return livingEnemies.reduce((closest, enemy) => {
      const distToCurrent = calculateDistance(entity.position, enemy.position);
      const distToClosest = closest
        ? calculateDistance(entity.position, closest.position)
        : Infinity;
      return distToCurrent < distToClosest ? enemy : closest;
    }, livingEnemies[0]);
  }

  // Easy difficulty - random target
  if (difficulty === 'easy') {
    return inRangeEnemies[Math.floor(Math.random() * inRangeEnemies.length)];
  }

  // Medium difficulty - focus on vulnerable targets
  if (difficulty === 'medium') {
    return inRangeEnemies.reduce((bestTarget, enemy) => {
      const hpRatio = enemy.hp / enemy.maxHp;
      const bestHpRatio = bestTarget ? bestTarget.hp / bestTarget.maxHp : 1;
      return hpRatio < bestHpRatio ? enemy : bestTarget;
    }, inRangeEnemies[0]);
  }

  // Hard difficulty - use strategies
  switch (currentStrategy) {
    case AIStrategy.AGGRESSIVE:
      // Target high damage dealers
      return inRangeEnemies.reduce((bestTarget, enemy) => {
        return enemy.attack > (bestTarget?.attack || 0) ? enemy : bestTarget;
      }, inRangeEnemies[0]);

    case AIStrategy.TACTICAL:
      // Target based on threat assessment
      return inRangeEnemies.reduce((bestTarget, enemy) => {
        const threatScore = calculateThreatLevel(enemy);
        const bestThreatScore = bestTarget ? calculateThreatLevel(bestTarget) : 0;
        return threatScore > bestThreatScore ? enemy : bestTarget;
      }, inRangeEnemies[0]);

    case AIStrategy.DEFENSIVE:
      // Focus on eliminating immediate threats
      return inRangeEnemies.reduce((bestTarget, enemy) => {
        return enemy.hp < (bestTarget?.hp || Infinity) ? enemy : bestTarget;
      }, inRangeEnemies[0]);

    default:
      return inRangeEnemies[0];
  }
};

/**
 * Calculate damage similar to Python implementation
 */
const calculateDamage = (attacker: BattleEntity, defender: BattleEntity): number => {
  // Base damage with variance
  const baseDamage = attacker.attack * (Math.random() * 0.4 + 0.8); // 80-120% variance

  // Damage reduction based on defense (similar to Python's armor calculation)
  const damageReduction = defender.defense / (defender.defense + 100); // Diminishing returns
  const finalDamage = Math.round(baseDamage * (1 - damageReduction));

  // Always do at least 1 damage
  return Math.max(1, finalDamage);
};

/**
 * Calculate armor damage similar to Python implementation
 */
const calculateArmorDamage = (damage: number, defense: number): number => {
  const actualDmg = damage * 100 / (100 + defense);
  const armorDmg = (1 - actualDmg / damage) * defense * 0.3;
  return Math.max(0, Math.floor(armorDmg));
};

/**
 * Strategic movement toward target
 */
const moveTowardsTargetTactically = (
  entity: BattleEntity,
  target: BattleEntity,
  allEntities: BattleEntity[],
  gridSize: { width: number; height: number },
  strategy: AIStrategy
): Position => {
  const currentDistance = calculateDistance(entity.position, target.position);

  // If we're in range and using tactical strategy, sometimes stay in place
  if (currentDistance <= entity.range && strategy === AIStrategy.TACTICAL) {
    if (Math.random() > 0.7) {
      return entity.position; // Sometimes stay in place if already in range
    }
  }

  // Get all possible moves (all adjacent tiles)
  const possibleMoves: Position[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      // Skip diagonal moves and current position
      if ((dx === 0 && dy === 0) || (dx !== 0 && dy !== 0)) continue;

      const newX = entity.position.x + dx;
      const newY = entity.position.y + dy;

      // Ensure we're still in bounds
      if (newX < 0 || newX >= gridSize.width || newY < 0 || newY >= gridSize.height) {
        continue;
      }

      // Check if position is occupied
      const isOccupied = allEntities.some(e =>
        !e.isDead && e.position.x === newX && e.position.y === newY
      );

      if (!isOccupied) {
        possibleMoves.push({ x: newX, y: newY });
      }
    }
  }

  // If no valid moves, stay in place
  if (possibleMoves.length === 0) {
    return entity.position;
  }

  // Different movement strategies based on AI strategy
  switch (strategy) {
    case AIStrategy.AGGRESSIVE:
      // Move to get closest to target
      return possibleMoves.reduce((best, pos) => {
        const distToCurrent = calculateDistance(pos, target.position);
        const distToBest = calculateDistance(best, target.position);
        return distToCurrent < distToBest ? pos : best;
      }, possibleMoves[0]);

    case AIStrategy.DEFENSIVE:
      // If we're too close to target, try to maintain distance
      if (currentDistance <= 2) {
        return possibleMoves.reduce((best, pos) => {
          const distToCurrent = calculateDistance(pos, target.position);
          const distToBest = calculateDistance(best, target.position);
          return distToCurrent > distToBest ? pos : best;
        }, possibleMoves[0]);
      }
      // Otherwise, approach cautiously
      return possibleMoves.reduce((best, pos) => {
        const distToCurrent = calculateDistance(pos, target.position);
        const distToBest = calculateDistance(best, target.position);
        return distToCurrent < distToBest ? pos : best;
      }, possibleMoves[0]);

    case AIStrategy.TACTICAL:
      // If nearly at optimal range, optimize position
      if (Math.abs(currentDistance - entity.range) <= 1) {
        // Try to optimize positioning (e.g., stay away from other enemies)
        return possibleMoves.reduce((best, pos) => {
          // This is a simplified tactical positioning
          const currentBestScore = allEntities.reduce((score, e) => {
            if (e.id !== entity.id && e.id !== target.id) {
              return score - (1 / calculateDistance(best, e.position));
            }
            return score;
          }, 0);

          const newScore = allEntities.reduce((score, e) => {
            if (e.id !== entity.id && e.id !== target.id) {
              return score - (1 / calculateDistance(pos, e.position));
            }
            return score;
          }, 0);

          return newScore > currentBestScore ? pos : best;
        }, possibleMoves[0]);
      }
      // Otherwise, move toward target
      return possibleMoves.reduce((best, pos) => {
        const distToCurrent = calculateDistance(pos, target.position);
        const distToBest = calculateDistance(best, target.position);
        return distToCurrent < distToBest ? pos : best;
      }, possibleMoves[0]);

    case AIStrategy.RANDOM:
    default:
      // Random movement from possible moves
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }
};

/**
 * Check if position is occupied
 */
const isPositionOccupied = (pos: Position, entities: BattleEntity[]): boolean => {
  return entities.some(entity =>
    !entity.isDead && entity.position.x === pos.x && entity.position.y === pos.y
  );
};

/**
 * Analyze formation like Python implementation
 */
const analyzeFormation = (entities: BattleEntity[]): FormationAnalysis | null => {
  if (entities.length <= 0) {
    return null;
  }

  // Calculate the center of the formation
  const center = entities.reduce(
    (sum, entity) => {
      return {
        x: sum.x + entity.position.x / entities.length,
        y: sum.y + entity.position.y / entities.length
      };
    },
    { x: 0, y: 0 }
  );

  // Calculate how spread out the formation is
  const spread = entities.reduce(
    (maxDist, entity) => {
      const dist = calculateDistance(center, entity.position);
      return Math.max(maxDist, dist);
    },
    0
  );

  // Determine formation type
  let formationType: 'solo' | 'clustered' | 'balanced' | 'scattered';
  if (entities.length <= 1) {
    formationType = 'solo';
  } else if (spread < 2) {
    formationType = 'clustered';
  } else if (spread < 4) {
    formationType = 'balanced';
  } else {
    formationType = 'scattered';
  }

  return {
    center,
    spread,
    type: formationType
  };
};

export class BattleSimulator {
  private state: BattleState;
  private maxTurns: number = 30;
  private difficultyLevel: DifficultyLevel;
  private aiStrategy: AIStrategy;
  private movesPerTurn: number = 3; // Similar to Python implementation
  private currentMoveCount: number = 0;

  /**
   * Initialize battle simulator with teams and settings
   */
  constructor(
    playerTeam: BattleEntity[],
    enemyTeam: BattleEntity[],
    gridWidth = 8,
    gridHeight = 8,
    difficulty: DifficultyLevel = 'medium'
  ) {
    this.difficultyLevel = difficulty;

    // Pick AI strategy based on difficulty
    const strategyMap = {
      'easy': [AIStrategy.RANDOM, AIStrategy.DEFENSIVE],
      'medium': [AIStrategy.DEFENSIVE, AIStrategy.AGGRESSIVE],
      'hard': [AIStrategy.AGGRESSIVE, AIStrategy.TACTICAL],
    };

    const availableStrategies = strategyMap[difficulty];
    this.aiStrategy = availableStrategies[Math.floor(Math.random() * availableStrategies.length)];

    this.state = {
      turn: 1,
      playerTeam: JSON.parse(JSON.stringify(playerTeam)), // Deep clone to avoid mutations
      enemyTeam: JSON.parse(JSON.stringify(enemyTeam)),
      actionLogs: [],
      isCompleted: false,
      result: null,
      gridSize: { width: gridWidth, height: gridHeight },
      statusEffects: []
    };

    // Initialize abilities
    [...this.state.playerTeam, ...this.state.enemyTeam].forEach(entity => {
      // Initialize MP if not already set
      if (!entity.mp) {
        entity.mp = 100;
        entity.maxMp = 100;
      }

      // Initialize max HP if not already set
      if (!entity.maxHp) {
        entity.maxHp = entity.hp;
      }

      // Initialize special abilities cooldowns
      if (entity.specialAbilities) {
        entity.specialAbilities.forEach(ability => {
          ability.currentCooldown = 0;
        });
      }
    });

    // If positions are not provided, initialize them
    this.assignInitialPositions();
  }

  /**
   * Assign initial grid positions to all entities
   */
  private assignInitialPositions(): void {
    // Place player team on the left side of grid
    this.state.playerTeam.forEach((entity, index) => {
      if (!entity.position) {
        const row = Math.floor(index / 2);
        const col = index % 2;
        entity.position = {
          x: col,
          y: 1 + row
        };
      }
    });

    // Place enemy team on the right side of grid
    this.state.enemyTeam.forEach((entity, index) => {
      if (!entity.position) {
        const row = Math.floor(index / 2);
        const col = index % 2;
        entity.position = {
          x: this.state.gridSize.width - 1 - col,
          y: 1 + row
        };
      }
    });
  }

  /**
   * Get current battle state (returns a clone to prevent mutations)
   */
  public getCurrentState(): BattleState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Simulate the entire match until completion
   */
  public simulateEntireMatch(): BattleState {
    while (!this.state.isCompleted) {
      this.simulateTurn();
    }
    return this.getCurrentState();
  }

  /**
   * Change difficulty level
   */
  public setDifficulty(difficulty: DifficultyLevel): void {
    this.difficultyLevel = difficulty;

    // Update strategy based on new difficulty
    const strategyMap = {
      'easy': [AIStrategy.RANDOM, AIStrategy.DEFENSIVE],
      'medium': [AIStrategy.DEFENSIVE, AIStrategy.AGGRESSIVE],
      'hard': [AIStrategy.AGGRESSIVE, AIStrategy.TACTICAL],
    };

    const availableStrategies = strategyMap[difficulty];
    this.aiStrategy = availableStrategies[Math.floor(Math.random() * availableStrategies.length)];
  }

  /**
   * Analyze battlefield state for strategic decision making
   */
  private analyzeBattlefield(entity: BattleEntity, allies: BattleEntity[], enemies: BattleEntity[]): BattlefieldAnalysis {
    const analysis: BattlefieldAnalysis = {
      threats: [],
      opportunities: [],
      safeSpots: new Set<string>(),
      dangerZones: new Set<string>(),
      teamFormation: null
    };

    // Identify immediate threats
    for (const enemy of enemies) {
      const threatLevel = calculateThreatLevel(enemy);
      if (threatLevel > 0.7) {
        analysis.threats.push([enemy, threatLevel]);

        // Mark danger zones around high-threat enemies
        const attackRange = enemy.range;
        for (let dx = -attackRange; dx <= attackRange; dx++) {
          for (let dy = -attackRange; dy <= attackRange; dy++) {
            if (Math.abs(dx) + Math.abs(dy) <= attackRange) {
              const dangerX = enemy.position.x + dx;
              const dangerY = enemy.position.y + dy;
              analysis.dangerZones.add(`${dangerX},${dangerY}`);
            }
          }
        }
      }
    }

    // Find tactical opportunities (low HP targets)
    for (const enemy of enemies) {
      if (enemy.hp < entity.attack * 2) {
        analysis.opportunities.push(['finishing_blow', enemy]);
      } else if (enemy.hp < enemy.maxHp * 0.3) {
        analysis.opportunities.push(['wounded_target', enemy]);
      }
    }

    // Analyze team formation
    analysis.teamFormation = analyzeFormation(allies);

    return analysis;
  }

  /**
   * Update AI strategy based on battle conditions
   */
  private updateAIStrategy(): void {
    if (this.difficultyLevel !== 'hard') return;

    // Calculate team health ratios
    const playerTeamHpRatio = this.calculateTeamHealthPercentage(this.state.playerTeam);
    const enemyTeamHpRatio = this.calculateTeamHealthPercentage(this.state.enemyTeam);

    // Change strategy based on battle conditions
    if (playerTeamHpRatio < 0.3) {
      // Critical situation - be defensive
      this.aiStrategy = AIStrategy.DEFENSIVE;
    } else if (enemyTeamHpRatio < 0.3) {
      // Enemy nearly defeated - be aggressive
      this.aiStrategy = AIStrategy.AGGRESSIVE;
    } else if (playerTeamHpRatio > 0.7) {
      // Good condition - be tactical
      this.aiStrategy = AIStrategy.TACTICAL;
    }
  }

  /**
   * Simulate a single turn of battle
   */
  public simulateTurn(): BattleState {
    if (this.state.isCompleted) {
      return this.getCurrentState();
    }

    // Update AI strategy based on battle conditions
    this.updateAIStrategy();

    // Process existing status effects
    this.processStatusEffects();

    // Reset move count for new turn
    this.currentMoveCount = 0;

    // Team turn-based system like Python implementation
    for (let team of [this.state.playerTeam, this.state.enemyTeam]) {
      // Skip team's turn if defeated
      if (!team.some(entity => !entity.isDead)) continue;

      this.currentMoveCount = 0;

      // Execute multiple moves per team
      while (this.currentMoveCount < this.movesPerTurn) {
        // Get living entities
        const livingEntities = team.filter(e => !e.isDead);
        if (livingEntities.length === 0) break;

        // Pick random entity to act (like Python version)
        const entity = livingEntities[Math.floor(Math.random() * livingEntities.length)];

        // Execute entity's action
        this.executeEntityAction(entity);

        this.currentMoveCount++;
      }

      // Cool down abilities for this team after they take all their moves
      team.forEach(entity => {
        if (!entity.isDead && entity.specialAbilities) {
          entity.specialAbilities.forEach(ability => {
            if (ability.currentCooldown > 0) {
              ability.currentCooldown--;
            }
          });
        }
      });
    }

    // Check if battle is over
    const playersAlive = this.state.playerTeam.some(entity => !entity.isDead);
    const enemiesAlive = this.state.enemyTeam.some(entity => !entity.isDead);

    // Increment turn
    this.state.turn++;

    // Check victory conditions
    if (!enemiesAlive || !playersAlive || this.state.turn > this.maxTurns) {
      this.state.isCompleted = true;

      // If max turns reached, compare team health percentages
      const playerVictory = !playersAlive ? false : !enemiesAlive ? true :
        this.calculateTeamHealthPercentage(this.state.playerTeam) >=
        this.calculateTeamHealthPercentage(this.state.enemyTeam);

      this.state.result = {
        playerVictory,
        turns: this.state.turn - 1,
        survivingPlayerEntities: this.state.playerTeam.filter(e => !e.isDead),
        survivingEnemyEntities: this.state.enemyTeam.filter(e => !e.isDead),
        logs: this.state.actionLogs
      };

      this.state.actionLogs.push({
        turn: this.state.turn - 1,
        entityId: '',
        actionType: 'status',
        message: `Battle ended! ${playerVictory ? 'Your team' : 'Enemy team'} is victorious!`
      });
    }

    return this.getCurrentState();
  }

  /**
   * Execute an action for an entity (attack, move, use ability)
   */
  private executeEntityAction(entity: BattleEntity): void {
    if (entity.isDead) return; // Skip if entity died during this turn

    // Check if entity is stunned
    if (this.hasStatusEffect(entity.id, 'stun')) {
      this.state.actionLogs.push({
        turn: this.state.turn,
        entityId: entity.id,
        actionType: 'status',
        message: `${entity.name} is stunned and cannot act!`
      });
      return;
    }

    const isPlayer = this.state.playerTeam.some(e => e.id === entity.id);
    const alliesTeam = isPlayer ? this.state.playerTeam : this.state.enemyTeam;
    const enemyTeam = isPlayer ? this.state.enemyTeam : this.state.playerTeam;

    // Get team battlefield analysis for more strategic decisions
    const battlefieldAnalysis = this.analyzeBattlefield(entity, alliesTeam, enemyTeam);

    // Check for healing opportunities (like in Python version)
    if (entity.specialAbilities) {
      const healAbility = entity.specialAbilities.find(ability =>
        ability.statusEffectType === 'heal' &&
        ability.currentCooldown === 0 &&
        entity.mp >= (ability.mpCost)
      );

      // Check if entity needs healing
      if (healAbility && entity.hp < entity.maxHp * 0.5) {
        // Self heal
        this.useSpecialAbility(entity, entity, healAbility);
        return;
      }

      // Check if allies need healing
      const criticalAlly = alliesTeam.find(ally =>
        !ally.isDead && ally.hp < ally.maxHp * 0.3
      );

      if (healAbility && criticalAlly) {
        this.useSpecialAbility(entity, criticalAlly, healAbility);
        return;
      }
    }

    // Find optimal target based on strategy and difficulty
    const target = findOptimalTarget(entity, enemyTeam, this.difficultyLevel, this.aiStrategy);
    if (!target) return; // No targets left

    const distance = calculateDistance(entity.position, target.position);

    // Special ability usage according to Python implementation
    // In Python, abilities are used every 3rd turn
    if (entity.specialAbilities && entity.specialAbilities.length > 0 && this.state.turn % 3 === 0) {
      // Filter abilities that are ready and entity has enough MP
      const availableAbilities = entity.specialAbilities.filter(ability =>
        ability.currentCooldown === 0 &&
        entity.mp >= ability.mpCost
      );

      if (availableAbilities.length > 0) {
        // Choose random ability like Python implementation
        const selectedAbility = availableAbilities[
          Math.floor(Math.random() * availableAbilities.length)
        ];

        // Use the ability if in range
        if (distance <= entity.range + 1) {
          this.useSpecialAbility(entity, target, selectedAbility);
          return;
        }
      }
    }

    // Check if target is within attack range
    if (distance <= entity.range) {
      // Check if target has evasion
      if (this.hasStatusEffect(target.id, 'evasion')) {
        // Target evades the attack
        this.state.actionLogs.push({
          turn: this.state.turn,
          entityId: entity.id,
          actionType: 'attack',
          targetId: target.id,
          message: `${entity.name} attacks ${target.name}, but it was evaded!`
        });
      } else {
        // Normal attack
        const damage = calculateDamage(entity, target);
        const armorDamage = calculateArmorDamage(damage, target.defense);

        target.hp = Math.max(0, target.hp - damage);
        target.defense = Math.max(0, target.defense - armorDamage);

        if (target.hp === 0) {
          target.isDead = true;
        }

        this.state.actionLogs.push({
          turn: this.state.turn,
          entityId: entity.id,
          actionType: 'attack',
          targetId: target.id,
          message: `${entity.name} attacks ${target.name} for ${damage} damage (${armorDamage} armor damage)!`
        });

        if (target.isDead) {
          this.state.actionLogs.push({
            turn: this.state.turn,
            entityId: target.id,
            actionType: 'status',
            message: `${target.name} has been defeated!`
          });
        }
      }
    } else {
      // Use tactical movement
      const allEntities = [...this.state.playerTeam, ...this.state.enemyTeam];
      const newPosition = moveTowardsTargetTactically(
        entity,
        target,
        allEntities,
        this.state.gridSize,
        this.aiStrategy
      );

      if (newPosition.x !== entity.position.x || newPosition.y !== entity.position.y) {
        const oldPosition = { ...entity.position };
        entity.position = newPosition;

        this.state.actionLogs.push({
          turn: this.state.turn,
          entityId: entity.id,
          actionType: 'move',
          message: `${entity.name} moves from (${oldPosition.x},${oldPosition.y}) to (${newPosition.x},${newPosition.y})`
        });
      } else {
        this.state.actionLogs.push({
          turn: this.state.turn,
          entityId: entity.id,
          actionType: 'status',
          message: `${entity.name} couldn't move - position is blocked`
        });
      }
    }
  }

  /**
   * Use a special ability on a target
   */
  private useSpecialAbility(caster: BattleEntity, target: BattleEntity, ability: SpecialAbility): void {
    // Reduce MP
    caster.mp -= ability.mpCost;

    // Apply effects based on ability type
    if (ability.statusEffectType) {
      switch (ability.statusEffectType) {
        case 'poison':
          this.applyStatusEffect({
            name: 'poison',
            source: caster.id,
            target: target.id,
            duration: ability.statusEffectDuration || 3,
            value: ability.damage || 10
          });

          this.state.actionLogs.push({
            turn: this.state.turn,
            entityId: caster.id,
            actionType: 'special',
            targetId: target.id,
            message: `${caster.name} used ${ability.jutsuName || ability.name} on ${target.name}, poisoning them for ${ability.statusEffectDuration || 3} turns!`
          });
          break;

        case 'stun':
          this.applyStatusEffect({
            name: 'stun',
            source: caster.id,
            target: target.id,
            duration: ability.statusEffectDuration || 1,
            value: 0
          });

          this.state.actionLogs.push({
            turn: this.state.turn,
            entityId: caster.id,
            actionType: 'special',
            targetId: target.id,
            message: `${caster.name} used ${ability.jutsuName || ability.name} on ${target.name}, stunning them for ${ability.statusEffectDuration || 1} turn(s)!`
          });
          break;

        case 'evasion':
          this.applyStatusEffect({
            name: 'evasion',
            source: caster.id,
            target: caster.id, // Self buff
            duration: ability.statusEffectDuration || 1,
            value: 0
          });

          this.state.actionLogs.push({
            turn: this.state.turn,
            entityId: caster.id,
            actionType: 'special',
            message: `${caster.name} used ${ability.jutsuName || ability.name}, boosting evasion for ${ability.statusEffectDuration || 1} turn(s)!`
          });
          break;

        case 'buff':
          this.applyStatusEffect({
            name: 'buff',
            source: caster.id,
            target: caster.id, // Self buff
            duration: 3,
            value: ability.damage || 30
          });

          // Apply the buff immediately
          caster.attack += (ability.damage || 30);

          this.state.actionLogs.push({
            turn: this.state.turn,
            entityId: caster.id,
            actionType: 'special',
            message: `${caster.name} used ${ability.jutsuName || ability.name}, increasing attack by ${ability.damage || 30}!`
          });
          break;

        case 'heal':
          const healAmount = ability.damage || 150;
          target.hp = Math.min(target.maxHp, target.hp + healAmount);

          this.state.actionLogs.push({
            turn: this.state.turn,
            entityId: caster.id,
            actionType: 'special',
            targetId: target.id,
            message: `${caster.name} used ${ability.jutsuName || ability.name} on ${target.name}, healing for ${healAmount} HP!`
          });
          break;
      }
    } else {
      // Critical strike ability (does extra damage)
      const critMultiplier = ability.damage || 2;
      const baseDamage = caster.attack;
      const extraDamage = Math.round(baseDamage * critMultiplier);

      target.hp = Math.max(0, target.hp - extraDamage);

      if (target.hp === 0) {
        target.isDead = true;
      }

      this.state.actionLogs.push({
        turn: this.state.turn,
        entityId: caster.id,
        actionType: 'special',
        targetId: target.id,
        message: `${caster.name} used ${ability.jutsuName || ability.name} on ${target.name} for ${extraDamage} critical damage!`
      });

      if (target.isDead) {
        this.state.actionLogs.push({
          turn: this.state.turn,
          entityId: target.id,
          actionType: 'status',
          message: `${target.name} has been defeated!`
        });
      }
    }

    // Set cooldown
    ability.currentCooldown = ability.cooldown;
  }

  /**
   * Apply a status effect to an entity
   */
  private applyStatusEffect(effect: StatusEffect): void {
    // Remove any existing effect of the same type on the same target
    this.state.statusEffects = this.state.statusEffects.filter(
      e => !(e.name === effect.name && e.target === effect.target)
    );

    // Add the new effect
    this.state.statusEffects.push(effect);
  }

  /**
   * Process all active status effects
   */
  private processStatusEffects(): void {
    const expiredEffects: StatusEffect[] = [];

    // Process each active effect
    for (const effect of this.state.statusEffects) {
      // Apply poison damage
      if (effect.name === 'poison') {
        const target = this.findEntityById(effect.target);
        if (target) {
          target.hp = Math.max(0, target.hp - effect.value);

          this.state.actionLogs.push({
            turn: this.state.turn,
            entityId: target.id,
            actionType: 'status',
            message: `${target.name} takes ${effect.value} poison damage!`
          });

          if (target.hp === 0) {
            target.isDead = true;
            this.state.actionLogs.push({
              turn: this.state.turn,
              entityId: target.id,
              actionType: 'status',
              message: `${target.name} has been defeated by poison!`
            });
          }
        }
      }

      // Remove buff effect when expired
      if (effect.name === 'buff' && effect.duration === 1) {
        const target = this.findEntityById(effect.target);
        if (target) {
          target.attack -= effect.value;
          this.state.actionLogs.push({
            turn: this.state.turn,
            entityId: target.id,
            actionType: 'status',
            message: `${target.name}'s attack buff has worn off!`
          });
        }
      }

      // Decrease duration
      effect.duration--;
      if (effect.duration <= 0) {
        expiredEffects.push(effect);
      }
    }

    // Remove expired effects
    for (const expiredEffect of expiredEffects) {
      this.state.statusEffects = this.state.statusEffects.filter(e => e !== expiredEffect);

      const target = this.findEntityById(expiredEffect.target);
      if (target) {
        this.state.actionLogs.push({
          turn: this.state.turn,
          entityId: target.id,
          actionType: 'status',
          message: `${target.name}'s ${expiredEffect.name} effect has worn off!`
        });
      }
    }
  }

  /**
   * Check if entity has a specific status effect
   */
  private hasStatusEffect(entityId: string, effectName: 'stun' | 'evasion' | 'poison' | 'buff'): boolean {
    return this.state.statusEffects.some(
      effect => effect.target === entityId && effect.name === effectName
    );
  }

  /**
   * Find entity by ID
   */
  private findEntityById(id: string): BattleEntity | undefined {
    return [...this.state.playerTeam, ...this.state.enemyTeam].find(e => e.id === id);
  }

  /**
   * Calculate team health percentage
   */
  private calculateTeamHealthPercentage(team: BattleEntity[]): number {
    const totalMaxHp = team.reduce((sum, entity) => sum + entity.maxHp, 0);
    const currentHp = team.reduce((sum, entity) => sum + entity.hp, 0);
    return totalMaxHp > 0 ? (currentHp / totalMaxHp) : 0;
  }
}