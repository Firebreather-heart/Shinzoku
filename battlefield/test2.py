import random
from characters import Character
from teams import Team
from engine import AutoBattleField

# Demon Slayers (4 characters)
tanjiro_data = {
    "name": "Tanjiro Kamado",
    "class": "Demon Slayer",
    "attributes": [
        {"name": "hp", "value": 5000},
        {"name": "mp", "value": 7000},
        {"name": "armor", "value": 500},
        {"name": "range", "value": 350},
        {"name": "dmg", "value": 500},
        {"name": "speed", "value": 450},
        {"name": "stamina", "value": 1100}
    ],
    "special_abilities": [
        {"name": "critical strike", "value": 2, "mp_cost": 90,
            "jutsu_name": "Water Breathing Slash"},
        {"name": "evasion", "value": 180, "mp_cost": 40, "jutsu_name": "Quick Step"}
    ]
}

zenitsu_data = {
    "name": "Zenitsu Agatsuma",
    "class": "Demon Slayer",
    "attributes": [
        {"name": "hp", "value": 4200},
        {"name": "mp", "value": 800},
        {"name": "armor", "value": 480},
        {"name": "range", "value": 340},
        {"name": "dmg", "value": 220},
        {"name": "speed", "value": 460},
        {"name": "stamina", "value": 1050}
    ],
    "special_abilities": [
        {
            "name": "critical strike", "value": 8, "mp_cost": 100, "jutsu_name": "Flaming thunder God"
        },
        {"name": "stun", "value": 3, "mp_cost": 75,
            "jutsu_name": "Thunder Breathing Stun"},
        
    ]
}

inosuke_data = {
    "name": "Inosuke Hashibira",
    "class": "Demon Slayer",
    "attributes": [
        {"name": "hp", "value": 4800},
        {"name": "mp", "value": 600},
        {"name": "armor", "value": 510},
        {"name": "range", "value": 360},
        {"name": "dmg", "value": 250},
        {"name": "speed", "value": 470},
        {"name": "stamina", "value": 1120}
    ],
    "special_abilities": [
        {"name": "buff", "value": 25, "mp_cost": 50,
            "jutsu_name": "Beast Breathing Frenzy"}
    ]
}

nezuko_data = {
    "name": "Nezuko Kamado",
    "class": "Demon Slayer",
    "attributes": [
        {"name": "hp", "value": 4500},
        {"name": "mp", "value": 5050},
        {"name": "armor", "value": 490},
        {"name": "range", "value": 330},
        {"name": "dmg", "value": 230},
        {"name": "speed", "value": 440},
        {"name": "stamina", "value": 1080}
    ],
    "special_abilities": [
        {"name": "heal self", "value": 200, "mp_cost": 80,
            "jutsu_name": "Demon Blood Art: Self-Heal"}
    ]
}

team_slayers = Team("Demon Slayers")
team_slayers.assemble([
    Character.from_json(tanjiro_data),
    Character.from_json(zenitsu_data),
    Character.from_json(inosuke_data),
    Character.from_json(nezuko_data)
])

# Demons (4 characters)
muzan_data = {
    "name": "Muzan Kibutsuji",
    "class": "Demon",
    "attributes": [
        {"name": "hp", "value": 6000},
        {"name": "mp", "value": 8000},
        {"name": "armor", "value": 650},
        {"name": "range", "value": 380},
        {"name": "dmg", "value": 600},
        {"name": "speed", "value": 480},
        {"name": "stamina", "value": 1200}
    ],
    "special_abilities": [
        {"name": "critical strike", "value": 3, "mp_cost": 110,
            "jutsu_name": "Demon's Crimson Slash"}
    ]
}

rui_data = {
    "name": "Rui",
    "class": "Demon",
    "attributes": [
        {"name": "hp", "value": 4200},
        {"name": "mp", "value": 700},
        {"name": "armor", "value": 600},
        {"name": "range", "value": 360},
        {"name": "dmg", "value": 240},
        {"name": "speed", "value": 450},
        {"name": "stamina", "value": 1100}
    ],
    "special_abilities": [
        {"name": "poison", "value": 15, "mp_cost": 70,
            "jutsu_name": "Toxic Blood Mist"}
    ]
}

doma_data = {
    "name": "Doma",
    "class": "Demon",
    "attributes": [
        {"name": "hp", "value": 4800},
        {"name": "mp", "value": 750},
        {"name": "armor", "value": 630},
        {"name": "range", "value": 370},
        {"name": "dmg", "value": 260},
        {"name": "speed", "value": 460},
        {"name": "stamina", "value": 1150}
    ],
    "special_abilities": [
        {"name": "stun", "value": 1, "mp_cost": 80, "jutsu_name": "Icy Demon Stun"}
    ]
}

kyokusa_data = {
    "name": "Kyokusa",
    "class": "Demon",
    "attributes": [
        {"name": "hp", "value": 4500},
        {"name": "mp", "value": 1000},
        {"name": "armor", "value": 620},
        {"name": "range", "value": 350},
        {"name": "dmg", "value": 250},
        {"name": "speed", "value": 470},
        {"name": "stamina", "value": 1100}
    ],
    "special_abilities": [
        {"name": "buff", "value": 30, "mp_cost": 60,
            "jutsu_name": "Demon Aura Surge"}
    ]
}

team_demons = Team("Demon Army")
team_demons.assemble([
    Character.from_json(muzan_data),
    Character.from_json(rui_data),
    Character.from_json(doma_data),
    Character.from_json(kyokusa_data)
])

# Instantiate the battlefield with 3 moves per turn.
battlefield = AutoBattleField(team_slayers, team_demons, moves_per_turn=3)

# Run the battle simulation until one team is defeated.
battlefield.run_battle()


