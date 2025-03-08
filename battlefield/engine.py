from teams import Team 


class AutoBattleField:
    def __init__(self, team1:Team, team2:Team):
        """This battlefield only allows two players"""
        self.team1 =  team1
        self.team2 = team2 
        self._turn_state_marker = 't1'

    def load_players(self):
        for player in self.team1.characters:
            setattr(self, f't1_{player.name}', player)
        for player in self.team1.characters:
            setattr(self, f't1_{player.name}', player)

    def evaluate_turn(self):
        pass

    def next_turn(self):
        if self._turn_state_marker == 't1':
            self._turn_state_marker = 't2'
        else:
            self._turn_state_marker = 't2'

    def update_character_state(self):
        pass