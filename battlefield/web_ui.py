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
    "name": "Alpha Warrior",
    "class": "Warrior",
    "attributes": [
        {"name": "hp", "value": 1000},
        {"name": "mp", "value": 500},
        {"name": "armor", "value": 50},
        {"name": "range", "value": 3},
        {"name": "dmg", "value": 400},
        {"name": "speed", "value": 200},
        {"name": "stamina", "value": 1000}
    ],
    "special_abilities": []
}

# Second character for Team Alpha
team_a_data_2 = {
    "name": "Alpha Mage",
    "class": "Mage",
    "attributes": [
        {"name": "hp", "value": 700},
        {"name": "mp", "value": 800},
        {"name": "armor", "value": 30},
        {"name": "range", "value": 4},
        {"name": "dmg", "value": 550},
        {"name": "speed", "value": 180},
        {"name": "stamina", "value": 800}
    ],
    "special_abilities": []
}

# First character for Team Bravo
team_b_data = {
    "name": "Bravo Assassin",
    "class": "Assassin",
    "attributes": [
        {"name": "hp", "value": 300},
        {"name": "mp", "value": 400},
        {"name": "armor", "value": 40},
        {"name": "range", "value": 5},
        {"name": "dmg", "value": 500},
        {"name": "speed", "value": 250},
        {"name": "stamina", "value": 900}
    ],
    "special_abilities": []
}

# Second character for Team Bravo
team_b_data_2 = {
    "name": "Bravo Archer",
    "class": "Archer",
    "attributes": [
        {"name": "hp", "value": 500},
        {"name": "mp", "value": 300},
        {"name": "armor", "value": 35},
        {"name": "range", "value": 6},
        {"name": "dmg", "value": 400},
        {"name": "speed", "value": 220},
        {"name": "stamina", "value": 850}
    ],
    "special_abilities": []
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
