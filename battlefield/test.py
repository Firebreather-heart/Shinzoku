import random
from characters import Character
from teams import Team
from engine import AutoBattleField

# Team Allied (4 players)
naruto_data = {
    "name": "Naruto Uzumaki",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 5000},
        {"name": "mp", "value": 8000},
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
            "mp_cost": 100, "jutsu_name": "Chou Odama Rasenshuriken"},
        {
            "name": "critical strike", "value": 5,
            "mp_cost": 300, "jutsu_name": "Biju-dama rasenshuriken",
        }
    ]
}

sasuke_data = {
    "name": "Sasuke Uchiha",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4800},
        {"name": "mp", "value": 5000},
        {"name": "armor", "value": 620},
        {"name": "range", "value": 340},
        {"name": "dmg", "value": 260},
        {"name": "speed", "value": 490},
        {"name": "stamina", "value": 1150}
    ],
    "special_abilities": [
        {"name": "stun", "value": 2, "mp_cost": 80,
            "jutsu_name": "Chidori Breakdown"},
        {"name": "buff", "value": 50, "mp_cost": 600, "jutsu_name": "Susanoo"},
        {"name": "poison", "value": 5, "mp_cost": 400, "jutsu_name": "Amaterasu"},
    ]
}

kakashi_data = {
    "name": "Kakashi Hatake",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4500},
        {"name": "mp", "value": 3000},
        {"name": "armor", "value": 580},
        {"name": "range", "value": 360},
        {"name": "dmg", "value": 240},
        {"name": "speed", "value": 480},
        {"name": "stamina", "value": 1100}
    ],
    "special_abilities": [
        {"name": "heal self", "value": 150,
            "mp_cost": 70, "jutsu_name": "Healing Light"},
        {"name": "critical strike", "value": 5, "mp_cost": 40, "jutsu_name": "Kamui Raikiri"},
        {"name": "buff", "value": 50, "mp_cost": 600, "jutsu_name": "Susanoo"},
    ]
}

sakura_data = {
    "name": "Sakura Haruno",
    "class": "Medic",
    "attributes": [
        {"name": "hp", "value": 6000},
        {"name": "mp", "value": 2000},
        {"name": "armor", "value": 600},
        {"name": "range", "value": 320},
        {"name": "dmg", "value": 220},
        {"name": "speed", "value": 460},
        {"name": "stamina", "value": 1050}
    ],
    "special_abilities": [
        {"name": "heal others", "value": 300,
            "mp_cost": 50, "jutsu_name": "Celestial Heal"}
    ]
}

team_allied = Team("Allied Shinobi Forces")
team_allied.assemble([
    Character.from_json(naruto_data),
    Character.from_json(sasuke_data),
    Character.from_json(kakashi_data),
    Character.from_json(sakura_data)
])

# Team Adversaries (4 players)
itachi_data = {
    "name": "Itachi Uchiha",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4600},
        {"name": "mp", "value": 3000},
        {"name": "armor", "value": 600},
        {"name": "range", "value": 330},
        {"name": "dmg", "value": 250},
        {"name": "speed", "value": 500},
        {"name": "stamina", "value": 1150}
    ],
    "special_abilities": [
        {"name": "heal self", "value": 200,
            "mp_cost": 80, "jutsu_name": "Crow Healing"},
        {"name": "buff", "value": 35, "mp_cost": 350, "jutsu_name": "Susanoo"},
        {"name": "poison", "value": 4, "mp_cost": 400, "jutsu_name": "Amaterasu"},
    ]
}

obito_data = {
    "name": "Obito Uchiha",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4800},
        {"name": "mp", "value": 6050},
        {"name": "armor", "value": 620},
        {"name": "range", "value": 340},
        {"name": "dmg", "value": 260},
        {"name": "speed", "value": 490},
        {"name": "stamina", "value": 1150}
    ],
    "special_abilities": [
        {"name": "critical strike", "value": 2, "mp_cost": 180, "jutsu_name": "Fireball Jutsu"},
        {"name": "evasion", "value": 300, "mp_cost": 80, "jutsu_name": "Kamui"},
    ]
}

shikamaru_data = {
    "name": "Shikamaru Nara",
    "class": "Tactician",
    "attributes": [
        {"name": "hp", "value": 4100},
        {"name": "mp", "value": 2500},
        {"name": "armor", "value": 540},
        {"name": "range", "value": 310},
        {"name": "dmg", "value": 220},
        {"name": "speed", "value": 470},
        {"name": "stamina", "value": 1080}
    ],
    "special_abilities": [
        {"name": "buff", "value": 25, "mp_cost": 40,
            "jutsu_name": "Shadow Stitching Jutsu"},
        {"name": "stun", "value": 2, "mp_cost": 100, "jutsu_name": "Shadow Strangle Jutsu"}
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
            "jutsu_name": "Flying Thunder God Evasion"},
        {"name": "critical strike", "value": 3, "mp_cost": 100, "jutsu_name": "Rasengan"},
        {"name": "critical strike", "value": 5, "mp_cost": 200, "jutsu_name": "Hiriashin Level 2"},
    ]
}

team_adversaries = Team("Akatsuki")
team_adversaries.assemble([
    Character.from_json(itachi_data),
    Character.from_json(obito_data),
    Character.from_json(shikamaru_data),
    Character.from_json(minato_data)
])

# Instantiate the battlefield.
# Using 3 moves per turn to allow multiple actions in each turn.
battlefield = AutoBattleField(team_allied, team_adversaries, moves_per_turn=3)

# Run the battle simulation until one team is defeated.
battlefield.run_battle()

