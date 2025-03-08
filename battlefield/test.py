from characters import Character

data = {
    "name": "Sasuke",
    "class": "Ninja",
    "attributes": [
        {
            "name": "hp", "value": 1000
        },
        {
            "name": "mp", "value": 1000
        },
        {
            "name": "armor", "value": 1000
        },
        {
            "name": "range", "value": 1000
        },
        {
            "name": "dmg", "value": 1000
        },
        {
            "name": "speed", "value": 1000
        }
    ],
    "special_abilities": [
        {
            "name": "evasion",
            "value": 300
        },
        {
            "name": "critical strike",
            "value": 300
        }
    ]
}

sasuke = Character.from_json(data)