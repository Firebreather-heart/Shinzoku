from characters import Character
from teams import Team
from engine import AutoBattleField

# JSON data for two characters
sasuke_data = {
    "name": "Sasuke",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 500},
        {"name": "mp", "value": 200},
        {"name": "armor", "value": 500},
        {"name": "range", "value": 300},
        {"name": "dmg", "value": 150},
        {"name": "speed", "value": 400},
        {"name": "stamina", "value": 1000}
    ],
    "special_abilities": [
        {"name": "evasion", "value": 300, "mp_cost": 50},
        {"name": "critical strike", "value": 300, "mp_cost": 50}
    ]
}

naruto_data = {
    "name": "Naruto",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 600},
        {"name": "mp", "value": 300},
        {"name": "armor", "value": 400},
        {"name": "range", "value": 300},
        {"name": "dmg", "value": 130},
        {"name": "speed", "value": 450},
        {"name": "stamina", "value": 1000}
    ],
    "special_abilities": [
        {"name": "evasion", "value": 200, "mp_cost": 30},
        {"name": "critical strike", "value": 350, "mp_cost": 60}
    ]
}

# Create characters from JSON
sasuke = Character.from_json(sasuke_data)
naruto = Character.from_json(naruto_data)

# Create teams (one character per team)
team1 = Team("Team Sasuke")
team1.assemble([sasuke])
team2 = Team("Team Naruto")
team2.assemble([naruto])

# Instantiate the battlefield with one move per turn (since each team has one member)
battlefield = AutoBattleField(team1, team2, moves_per_turn=1)

# Run the battle simulation until one team is defeated
battlefield.run_battle()

print("Battle finished!")