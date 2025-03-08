from teams import Team 
from characters import Character, Attribute


class AutoBattleField:
    def __init__(self, team1:Team, team2:Team):
        """This battlefield only allows two players"""
        self.team1 =  team1
        self.team2 = team2 
        self._turn_state_marker = team1.name


    def get_player(self, team:Team, name:str):
        """Get player by team name and player name"""
        return next((player for player in team.characters if player.name == name))

    def evaluate_turn(self):
        pass

    def next_turn(self):
        """Change the turn state marker"""
        if self._turn_state_marker == self.team1.name:
            self._turn_state_marker = self.team2.name
        else:
            self._turn_state_marker = self.team1.name
    
    def active_team(self):
        """Get the active team"""
        return self.team1 if self._turn_state_marker == self.team1.name else self.team2

    def update_character_state(self, team:Team , player:Character, attribute:Attribute, value:int):
        player = self.get_player(team, player.name)
        player.modify_attribute(attribute.name, value)

    def initiate_player_action(self, player:Character):
        #first pick an opponent at random
        pass

    def pick_opponent(self,):
        """Choose an opponent based on a simple vulnerability score."""
        active_team = self.active_team()
        opponent_team = self.team1 if active_team is self.team2 else self.team2

        # Evaluate each opponent and score them (here, lower HP means more vulnerable)
        def vulnerability(player: Character):
            return -(player.get_attribute('hp') + player.get_attribute('armor') * 0.5)

        # Get the opponents from the team and pick the one with the highest vulnerability score
        opponents = opponent_team.characters
        target = max(opponents, key=vulnerability)
        return target
