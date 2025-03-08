from characters import Character
from teams import Team
from engine import AutoBattleField

# JSON data for Sasuke and Naruto (same as before)
sasuke_data = {
    "name": "Sasuke",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 1000},
        {"name": "mp", "value": 200},
        {"name": "armor", "value": 500},
        {"name": "range", "value": 300},
        {"name": "dmg", "value": 150},
        {"name": "speed", "value": 400},
        {"name": "stamina", "value": 90}
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
        {"name": "hp", "value": 1200},
        {"name": "mp", "value": 300},
        {"name": "armor", "value": 400},
        {"name": "range", "value": 300},
        {"name": "dmg", "value": 130},
        {"name": "speed", "value": 450},
        {"name": "stamina", "value": 99}
    ],
    "special_abilities": [
        {"name": "evasion", "value": 200, "mp_cost": 30},
        {"name": "critical strike", "value": 350, "mp_cost": 60}
    ]
}

# JSON data for two Otsutsuki characters
otsutsuki1_data = {
    "name": "Isshiki",
    "class": "Otsutsuki",
    "attributes": [
        {"name": "hp", "value": 1200},
        {"name": "mp", "value": 500},
        {"name": "armor", "value": 800},
        {"name": "range", "value": 350},
        {"name": "dmg", "value": 200},
        {"name": "speed", "value": 500},
        {"name": "stamina", "value": 100}
    ],
    "special_abilities": [
        {"name": "repulsion", "value": 400, "mp_cost": 100},
        {"name": "cellular manipulation", "value": 500, "mp_cost": 120}
    ]
}

otsutsuki2_data = {
    "name": "Kaguya",
    "class": "Otsutsuki",
    "attributes": [
        {"name": "hp", "value": 1300},
        {"name": "mp", "value": 600},
        {"name": "armor", "value": 900},
        {"name": "range", "value": 400},
        {"name": "dmg", "value": 220},
        {"name": "speed", "value": 550},
        {"name": "stamina", "value": 80}
    ],
    "special_abilities": [
        {"name": "dimension shift", "value": 450, "mp_cost": 110},
        {"name": "divine retribution", "value": 600, "mp_cost": 130}
    ]
}

# Create character instances from JSON
sasuke = Character.from_json(sasuke_data)
naruto = Character.from_json(naruto_data)
otsutsuki1 = Character.from_json(otsutsuki1_data)
otsutsuki2 = Character.from_json(otsutsuki2_data)

# Create teams:
# Team Ninjas with Sasuke and Naruto
team_ninjas = Team("Team Ninjas")
team_ninjas.assemble([sasuke, naruto])

# Team Otsutsuki with Isshiki and Kaguya
team_otsutsuki = Team("Team Otsutsuki")
team_otsutsuki.assemble([otsutsuki1, otsutsuki2])

# Instantiate the battlefield with, say, 2 moves per turn (each team has 2 members)
battlefield = AutoBattleField(team_ninjas, team_otsutsuki, moves_per_turn=2)

# Run the battle simulation until one team is defeated
battlefield.run_battle()

