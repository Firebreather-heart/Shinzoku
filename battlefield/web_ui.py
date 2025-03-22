from flask import Flask, render_template, jsonify, request
from teams import Team
from characters import Character
from manual_battle import ManualBattleField, Position
from io import StringIO
import sys

app = Flask(__name__)

# --- Setup sample teams using your existing JSON definitions ---

# First character for Team Alpha
team_a_data = {
    "name": "Naruto Uzumaki",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 5000},
        {"name": "mp", "value": 8000},
        {"name": "armor", "value": 600},
        {"name": "range", "value": 5},
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

# Second character for Team Alpha
team_a_data_2 = {
    "name": "Madara Uchiha",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 5200},
        {"name": "mp", "value": 850},
        {"name": "armor", "value": 700},
        {"name": "range", "value": 5},
        {"name": "dmg", "value": 280},
        {"name": "speed", "value": 510},
        {"name": "stamina", "value": 1250}
    ],
    "special_abilities": [
        {"name": "critical strike", "value": 3, "mp_cost": 100,
            "jutsu_name": "Infinite Tsukuyomi Smash"}
    ]
}

# First character for Team Bravo
team_b_data = {
    "name": "Sasuke Uchiha",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4800},
        {"name": "mp", "value": 5000},
        {"name": "armor", "value": 620},
        {"name": "range", "value": 4},
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

# Second character for Team Bravo
team_b_data_2 = {
    "name": "Kakashi Hatake",
    "class": "Ninja",
    "attributes": [
        {"name": "hp", "value": 4500},
        {"name": "mp", "value": 3000},
        {"name": "armor", "value": 580},
        {"name": "range", "value": 4},
        {"name": "dmg", "value": 240},
        {"name": "speed", "value": 480},
        {"name": "stamina", "value": 1100}
    ],
    "special_abilities": [
        {"name": "heal self", "value": 150,
            "mp_cost": 70, "jutsu_name": "Healing Light"},
        {"name": "critical strike", "value": 5,
            "mp_cost": 40, "jutsu_name": "Kamui Raikiri"},
        {"name": "buff", "value": 50, "mp_cost": 600, "jutsu_name": "Susanoo"},
    ]
}

teamA = Team("Alpha")
teamB = Team("Bravo")
teamA.assemble([
    Character.from_json(team_a_data),
    Character.from_json(team_a_data_2)
])
teamB.assemble([
    Character.from_json(team_b_data),
    Character.from_json(team_b_data_2)
])

# Create the battlefield instance – both teams are AI for this example
battlefield = ManualBattleField(teamA, teamB, grid_size=(50, 20)) 


def get_grid_as_html() -> str:
    """Capture the grid output (as text) and wrap it in a <pre> block."""
    old_stdout = sys.stdout
    sys.stdout = mystdout = StringIO()
    battlefield.display_grid()
    sys.stdout = old_stdout
    grid_text = mystdout.getvalue()
    return f"<pre>{grid_text}</pre>"


@app.route('/')
def index():
    grid_html = get_grid_as_html()
    log_html = "\n".join(battlefield.commentary)
    return render_template("index.html",
                           turn=battlefield.turn_count,
                           grid=grid_html,
                           log=log_html)


@app.route('/next_turn', methods=['POST'])
def next_turn():
    # Process AI turns for every character in both teams.
    for team in [battlefield.human_team, battlefield.ai_team]:
        for character in team.characters:
            if character.get_attribute('hp') > 0:
                battlefield.ai_turn(character)
    battlefield.turn_count += 1
    battlefield.log(f"Turn {battlefield.turn_count} completed.")
    grid_html = get_grid_as_html()
    log_html = "\n".join(battlefield.commentary)
    return jsonify({
        "turn": battlefield.turn_count,
        "grid": grid_html,
        "log": log_html
    })


if __name__ == '__main__':
    app.run(debug=True)
