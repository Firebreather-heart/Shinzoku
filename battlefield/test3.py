import random
from characters import Character
from teams import Team
from engine import AutoBattleField

# ----- Heroes (5 players) -----
naruto_data = {
    "name": "Naruto Uzumaki",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 5000},
        {"name": "mp", "value": 800},
        {"name": "armor", "value": 600},
        {"name": "range", "value": 350},
        {"name": "dmg", "value": 250},
        {"name": "speed", "value": 500},
        {"name": "stamina", "value": 1200}
    ],
    "special_abilities": [
        {"name": "evasion", "value": 200, "mp_cost": 50,
            "jutsu_name": "Shadow Clone Evasion"},
        {"name": "critical strike", "value": 3,
            "mp_cost": 100, "jutsu_name": "Rasengan Barrage"}
    ]
}

sasuke_data = {
    "name": "Sasuke Uchiha",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4800},
        {"name": "mp", "value": 750},
        {"name": "armor", "value": 620},
        {"name": "range", "value": 340},
        {"name": "dmg", "value": 260},
        {"name": "speed", "value": 490},
        {"name": "stamina", "value": 1150}
    ],
    "special_abilities": [
        {"name": "stun", "value": 0, "mp_cost": 80,
            "jutsu_name": "Chidori Breakdown"},
        {"name": "buff", "value": 30, "mp_cost": 60, "jutsu_name": "Susanoo"}
    ]
}

kakashi_data = {
    "name": "Kakashi Hatake",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4500},
        {"name": "mp", "value": 700},
        {"name": "armor", "value": 580},
        {"name": "range", "value": 360},
        {"name": "dmg", "value": 240},
        {"name": "speed", "value": 480},
        {"name": "stamina", "value": 1100}
    ],
    "special_abilities": [
        {"name": "heal self", "value": 150,
            "mp_cost": 70, "jutsu_name": "Healing Light"}
    ]
}

sakura_data = {
    "name": "Sakura Haruno",
    "class": "Medic",
    "attributes": [
        {"name": "hp", "value": 4300},
        {"name": "mp", "value": 900},
        {"name": "armor", "value": 600},
        {"name": "range", "value": 320},
        {"name": "dmg", "value": 220},
        {"name": "speed", "value": 460},
        {"name": "stamina", "value": 1050}
    ],
    "special_abilities": [
        {"name": "heal others", "value": 150,
            "mp_cost": 50, "jutsu_name": "Celestial Heal"}
    ]
}

minato_data = {
    "name": "Minato Namikaze",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4400},
        {"name": "mp", "value": 8000},
        {"name": "armor", "value": 580},
        {"name": "range", "value": 370},
        {"name": "dmg", "value": 260},
        {"name": "speed", "value": 520},
        {"name": "stamina", "value": 1150}
    ],
    "special_abilities": [
        {"name": "evasion", "value": 220, "mp_cost": 60,
            "jutsu_name": "Flying Thunder God Evasion"}
    ]
}

team_heroes = Team("Heroes")
team_heroes.assemble([
    Character.from_json(naruto_data),
    Character.from_json(sasuke_data),
    Character.from_json(kakashi_data),
    Character.from_json(sakura_data),
    Character.from_json(minato_data)
])

# ----- Villains (7 players) -----
itachi_data = {
    "name": "Itachi Uchiha",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4600},
        {"name": "mp", "value": 800},
        {"name": "armor", "value": 600},
        {"name": "range", "value": 330},
        {"name": "dmg", "value": 250},
        {"name": "speed", "value": 500},
        {"name": "stamina", "value": 1150}
    ],
    "special_abilities": [
        {"name": "heal self", "value": 200,
            "mp_cost": 80, "jutsu_name": "Crow Healing"}
    ]
}

obito_data = {
    "name": "Obito Uchiha",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4800},
        {"name": "mp", "value": 750},
        {"name": "armor", "value": 620},
        {"name": "range", "value": 340},
        {"name": "dmg", "value": 260},
        {"name": "speed", "value": 490},
        {"name": "stamina", "value": 1150}
    ],
    "special_abilities": [
        {"name": "stun", "value": 0, "mp_cost": 80, "jutsu_name": "Kamui Stun"}
    ]
}

madara_data = {
    "name": "Madara Uchiha",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 5200},
        {"name": "mp", "value": 850},
        {"name": "armor", "value": 700},
        {"name": "range", "value": 380},
        {"name": "dmg", "value": 280},
        {"name": "speed", "value": 510},
        {"name": "stamina", "value": 1250}
    ],
    "special_abilities": [
        {"name": "critical strike", "value": 3, "mp_cost": 100,
            "jutsu_name": "Infinite Tsukuyomi Smash"}
    ]
}

pain_data = {
    "name": "Pain",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 5000},
        {"name": "mp", "value": 800},
        {"name": "armor", "value": 680},
        {"name": "range", "value": 360},
        {"name": "dmg", "value": 270},
        {"name": "speed", "value": 500},
        {"name": "stamina", "value": 1200}
    ],
    "special_abilities": [
        {"name": "buff", "value": 30, "mp_cost": 70, "jutsu_name": "Deva Path Force"}
    ]
}

deidara_data = {
    "name": "Deidara",
    "class": "Artificer",
    "attributes": [
        {"name": "hp", "value": 4500},
        {"name": "mp", "value": 900},
        {"name": "armor", "value": 640},
        {"name": "range", "value": 370},
        {"name": "dmg", "value": 260},
        {"name": "speed", "value": 480},
        {"name": "stamina", "value": 1100}
    ],
    "special_abilities": [
        {"name": "critical strike", "value": 2, "mp_cost": 90,
            "jutsu_name": "Explosive Clay Attack"}
    ]
}

hidan_data = {
    "name": "Hidan",
    "class": "Assassin",
    "attributes": [
        {"name": "hp", "value": 4300},
        {"name": "mp", "value": 700},
        {"name": "armor", "value": 660},
        {"name": "range", "value": 320},
        {"name": "dmg", "value": 240},
        {"name": "speed", "value": 470},
        {"name": "stamina", "value": 1080}
    ],
    "special_abilities": [
        {"name": "stun", "value": 0, "mp_cost": 75,
            "jutsu_name": "Cursed Ritual Stun"}
    ]
}

team_villains = Team("Villains")
team_villains.assemble([
    Character.from_json(itachi_data),
    Character.from_json(obito_data),
    Character.from_json(madara_data),
    Character.from_json(pain_data),
    Character.from_json(deidara_data),
    Character.from_json(hidan_data),
    # You can add more characters if desired.
])

# ----- Instantiate the battlefield and run the simulation -----
# Using a turn cap to prevent endless battles.
battlefield = AutoBattleField(team_heroes, team_villains, moves_per_turn=3)
winner = battlefield.run_battle(max_turns=200)


